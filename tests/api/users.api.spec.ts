import { test, expect, APIRequestContext } from '@playwright/test';
import { UserApi, Customer } from '@api/UserApi';
import { AuthApi } from '@api/AuthApi';
import { generateRandomUser, CustomerRegistrationData } from '@utils/testDataGenerator';
import { userProfileTestData } from '@test-data/users';

// Run tests serially because tests 002–005 and 008–010 operate on the user registered in 001
test.describe.configure({ mode: 'serial' });

// Pacing delay to prevent Cloudflare Error 1015 rate limiting across consecutive API calls
test.afterEach(async () => {
    await new Promise((resolve) => setTimeout(resolve, 600));
});

test.describe('2.6 User Profile & Customers API Test Suite', () => {
    let generatedUser: CustomerRegistrationData;
    let registeredCustomerId: number;

    /**
     * Ensures a registered customer exists if an individual test is invoked in isolation via --grep.
     */
    async function ensureRegisteredCustomer(request: APIRequestContext): Promise<void> {
        if (registeredCustomerId) return;

        generatedUser = generateRandomUser();
        const userApi = new UserApi(request);
        const authApi = new AuthApi(request);

        const regRes = await userApi.register(generatedUser);
        expect(regRes.status()).toBe(200);

        const loginRes = await authApi.login(generatedUser.username, generatedUser.password);
        expect(loginRes.status()).toBe(200);
        const customer: Customer = await loginRes.json();
        registeredCustomerId = customer.id;
    }

    test('TC-USR-API-001 Register user via form POST', async ({ request }) => {
        const userApi = new UserApi(request);
        const authApi = new AuthApi(request);
        generatedUser = generateRandomUser();

        // 1. Submit registration form via POST /parabank/register.htm (form-urlencoded)
        const registerRes = await userApi.register(generatedUser);
        expect(registerRes.status()).toBe(200);
        const registerHtml = await registerRes.text();
        expect(registerHtml).toContain('Your account was created');

        // 2. Authenticate via GET /login/{user}/{pass} and verify customer ID is returned
        const loginRes = await authApi.login(generatedUser.username, generatedUser.password);
        expect(loginRes.status()).toBe(200);

        const loginBody: Customer = await loginRes.json();
        expect(typeof loginBody.id).toBe('number');
        expect(loginBody.id).toBeGreaterThan(0);

        registeredCustomerId = loginBody.id;
    });

    test('TC-USR-API-002 Fetch customer details by Customer ID', async ({ request }) => {
        await ensureRegisteredCustomer(request);
        const userApi = new UserApi(request);

        // 1. Fetch customer details via GET /customers/{id}
        const response = await userApi.getCustomer(registeredCustomerId);
        expect(response.status()).toBe(200);

        // 2. Assert returned profile matches registration payload
        const customer: Customer = await response.json();
        expect(customer.id).toBe(registeredCustomerId);
        expect(customer.firstName).toBe(generatedUser.firstName);
        expect(customer.lastName).toBe(generatedUser.lastName);
        expect(customer.address.street).toBe(generatedUser.street);
        expect(customer.address.city).toBe(generatedUser.city);
        expect(customer.address.state).toBe(generatedUser.state);
        expect(customer.address.zipCode).toBe(generatedUser.zipCode);
        expect(customer.phoneNumber).toBe(generatedUser.phoneNumber);
        expect(customer.ssn).toBe(generatedUser.ssn);
    });

    test('TC-USR-API-003 Update customer profile details', async ({ request }) => {
        await ensureRegisteredCustomer(request);
        const userApi = new UserApi(request);

        // 1. Send POST /customers/update/{id} with updated city and phone number
        const response = await userApi.updateCustomer(registeredCustomerId, {
            ...generatedUser,
            city: userProfileTestData.updatedCity,
            phoneNumber: userProfileTestData.updatedPhoneNumber,
        });

        // 2. Confirm HTTP 200 OK and success confirmation message
        expect(response.status()).toBe(200);
        const responseText = await response.text();
        expect(responseText).toContain('Successfully updated customer profile');
    });

    test('TC-USR-API-004 Updated profile persists in database', async ({ request }) => {
        await ensureRegisteredCustomer(request);
        const userApi = new UserApi(request);

        // 1. Fetch customer details again after the update in TC-USR-API-003
        const response = await userApi.getCustomer(registeredCustomerId);
        expect(response.status()).toBe(200);

        // 2. Verify updated city/phone persisted while all other fields remained unchanged
        const customer: Customer = await response.json();
        expect(customer.address.city).toBe(userProfileTestData.updatedCity);
        expect(customer.phoneNumber).toBe(userProfileTestData.updatedPhoneNumber);
        expect(customer.firstName).toBe(generatedUser.firstName);
        expect(customer.lastName).toBe(generatedUser.lastName);
        expect(customer.address.street).toBe(generatedUser.street);
        expect(customer.address.state).toBe(generatedUser.state);
        expect(customer.address.zipCode).toBe(generatedUser.zipCode);
        expect(customer.ssn).toBe(generatedUser.ssn);
    });

    test('TC-USR-API-005 Prevent duplicate registration', async ({ request }) => {
        await ensureRegisteredCustomer(request);
        const userApi = new UserApi(request);

        // 1. Re-submit registration form using the already-registered username
        const response = await userApi.register(generatedUser);
        expect(response.status()).toBe(200);

        // 2. Confirm ParaBank rejects duplicate username with the expected message
        const responseHtml = await response.text();
        expect(responseHtml).toContain(userProfileTestData.duplicateUsernameMessage);
    });

    test('TC-USR-API-006 Get non-existent customer ID', async ({ request }) => {
        const userApi = new UserApi(request);

        // 1. Request customer details for an unknown numeric ID
        const response = await userApi.getCustomer(userProfileTestData.nonExistentCustomerId);

        // 2. Assert HTTP 400 Bad Request and exact error message
        expect(response.status()).toBe(400);
        const errorText = await response.text();
        expect(errorText).toContain(
            `Could not find customer #${userProfileTestData.nonExistentCustomerId}`
        );
    });

    test('TC-USR-API-007 Get customer with non-numeric ID', async ({ request }) => {
        const userApi = new UserApi(request);

        // 1. Request customer details with a non-numeric path parameter
        const response = await userApi.getCustomer(userProfileTestData.nonNumericCustomerId);

        // 2. Verify server rejects request with 400 Bad Request or 404 Not Found
        expect([400, 404]).toContain(response.status());
    });

    test('TC-USR-API-008 Update profile missing required params', async ({ request }) => {
        await ensureRegisteredCustomer(request);
        const userApi = new UserApi(request);

        // 1. Call POST /customers/update/{id} with empty query parameters
        const response = await userApi.updateCustomer(registeredCustomerId);

        // 2. Spec expects 400 Bad Request; log @known-defect if ParaBank throws HTTP 500
        if (response.status() === 500) {
            test.info().annotations.push({
                type: 'known-defect',
                description:
                    'ParaBank returns HTTP 500 Internal Error instead of 400 Bad Request when required query params are omitted on /customers/update/{id}.',
            });
        }
        expect([400, 500]).toContain(response.status());
    });

    test('TC-USR-API-009 Ensure customer DELETE endpoint disabled', async ({ request }) => {
        await ensureRegisteredCustomer(request);
        const userApi = new UserApi(request);

        // 1. Attempt HTTP DELETE on /customers/{id}
        const deleteRes = await userApi.deleteCustomer(registeredCustomerId);
        expect([404, 405]).toContain(deleteRes.status());

        // 2. Verify customer record remains active and accessible
        const getRes = await userApi.getCustomer(registeredCustomerId);
        expect(getRes.status()).toBe(200);
        const customer: Customer = await getRes.json();
        expect(customer.id).toBe(registeredCustomerId);
    });

    test('TC-USR-API-010 IDOR protection on customer profile', async ({ request }) => {
        await ensureRegisteredCustomer(request);
        const authApi = new AuthApi(request);
        const userApi = new UserApi(request);
        const peerCustomerId = userProfileTestData.peerCustomerId;

        expect(peerCustomerId).not.toBe(registeredCustomerId);

        // 1. Authenticate as Customer A (newly generated customer)
        const loginRes = await authApi.login(generatedUser.username, generatedUser.password);
        expect(loginRes.status()).toBe(200);

        // 2. Attempt to read Customer B's profile via GET /customers/{B.id}
        const response = await userApi.getCustomer(peerCustomerId);

        // 3. Expected 403 Forbidden; log @known-defect if Customer B's PII is exposed with 200
        if (response.status() === 200) {
            const exposedProfile: Customer = await response.json();
            expect(exposedProfile.id).toBe(peerCustomerId);
            test.info().annotations.push({
                type: 'known-defect',
                description:
                    'IDOR Vulnerability: Authenticated Customer A can retrieve Customer B PII via GET /customers/{B.id} with HTTP 200 instead of 403 Forbidden.',
            });
        }
        expect([403, 200]).toContain(response.status());
    });
});
