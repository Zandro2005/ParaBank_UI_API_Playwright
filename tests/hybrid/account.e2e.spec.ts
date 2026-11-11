import { test, expect } from '@fixtures/bankingFixture';
import { UserApi, Customer } from '@api/UserApi';
import { AuthApi } from '@api/AuthApi';
import { Account } from '@api/AccountApi';
import { LoginPage } from '@pages/LoginPage';
import { ProfilePage } from '@pages/ProfilePage';
import { AccountsPage } from '@pages/AccountsPage';
import { generateRandomUser } from '@utils/testDataGenerator';
import { toCents, getAccountBalanceViaApi } from '@utils/apiHelpers';

// Serial mode + pacing keeps live parabank.parasoft.com below Cloudflare 429 rate limits
test.describe.configure({ mode: 'serial' });

test.afterEach(async () => {
    await new Promise((resolve) => setTimeout(resolve, 600));
});

test.describe('3.3 Hybrid Account & Profile Workflows', () => {
    test('TC-USR-HYB-001 API Create User -> UI Login -> UI Update Profile -> API Verification', async ({
        page,
        request,
    }) => {
        // Use isolated `request` so registering does not log the browser session in automatically
        const userApi = new UserApi(request);
        const authApi = new AuthApi(request);
        const loginPage = new LoginPage(page);
        const profilePage = new ProfilePage(page);
        const userData = generateRandomUser('usrhyb');

        // 1. API: Register new user and retrieve customer ID
        const regRes = await userApi.register(userData);
        expect(regRes.status()).toBe(200);

        const authRes = await authApi.login(userData.username, userData.password);
        expect(authRes.status()).toBe(200);
        const registeredCustomer: Customer = await authRes.json();

        // 2. UI: Log in and update city & phone number
        await loginPage.navigate();
        await loginPage.fillLoginCredentials(userData.username, userData.password);
        await loginPage.clickLoginBtn();
        await expect(loginPage.overviewHeading).toBeVisible();

        await profilePage.clickUpdateContactInfoLink();
        await profilePage.city.fill('NewCity');
        await profilePage.phone.fill('555-9999');
        await profilePage.clickUpdateProfileBtn();
        await expect(profilePage.profileUpdatedHeading).toBeVisible();

        // 3. API: Confirm GET /customers/{id} persisted the updated city and phone
        const customerRes = await userApi.getCustomer(registeredCustomer.id);
        expect(customerRes.status()).toBe(200);
        const updatedCustomer: Customer = await customerRes.json();

        expect(updatedCustomer.address.city).toBe('NewCity');
        expect(updatedCustomer.phoneNumber).toBe('555-9999');
    });

    test('TC-USR-HYB-002 API user data correctly populated in UI', async ({
        page,
        request,
    }) => {
        const userApi = new UserApi(request);
        const loginPage = new LoginPage(page);
        const profilePage = new ProfilePage(page);
        const userData = generateRandomUser('usrhyb');

        // 1. API: Register generated user
        const regRes = await userApi.register(userData);
        expect(regRes.status()).toBe(200);

        // 2. UI: Log in and verify welcome banner matches registered name
        await loginPage.navigate();
        await loginPage.fillLoginCredentials(userData.username, userData.password);
        await loginPage.clickLoginBtn();
        await expect(loginPage.overviewHeading).toBeVisible();
        await expect(page.locator('#leftPanel .smallText')).toContainText(
            `${userData.firstName} ${userData.lastName}`
        );

        // 3. UI: Inspect contact profile form values match registration data verbatim
        await profilePage.clickUpdateContactInfoLink();
        await expect(profilePage.firstname).toHaveValue(userData.firstName);
        await expect(profilePage.lastname).toHaveValue(userData.lastName);
        await expect(profilePage.address).toHaveValue(userData.street);
        await expect(profilePage.city).toHaveValue(userData.city);
        await expect(profilePage.state).toHaveValue(userData.state);
        await expect(profilePage.zipCode).toHaveValue(userData.zipCode);
        await expect(profilePage.phone).toHaveValue(userData.phoneNumber);
    });

    test('TC-USR-HYB-003 UI registration verified via API', async ({ page, request }) => {
        const authApi = new AuthApi(request);
        const userApi = new UserApi(request);
        const profilePage = new ProfilePage(page);
        const userData = generateRandomUser('uireg');

        // 1. UI: Complete registration form in browser
        await profilePage.navigate();
        await profilePage.clickRegisterLink();
        await profilePage.fillRegisterCredentials({
            firstname: userData.firstName,
            lastname: userData.lastName,
            address: userData.street,
            city: userData.city,
            state: userData.state,
            zipCode: userData.zipCode,
            phone: userData.phoneNumber,
            ssn: userData.ssn,
            username: userData.username,
            password: userData.password,
            confirmPassword: userData.password,
        });
        await profilePage.clickRegisterBtn();
        await expect(profilePage.welcomeMessage).toBeVisible();

        // 2. API: Authenticate and verify customer fields match UI inputs
        const loginRes = await authApi.login(userData.username, userData.password);
        expect(loginRes.status()).toBe(200);
        const loginCustomer: Customer = await loginRes.json();

        const getRes = await userApi.getCustomer(loginCustomer.id);
        expect(getRes.status()).toBe(200);
        const customer: Customer = await getRes.json();

        expect(customer.firstName).toBe(userData.firstName);
        expect(customer.lastName).toBe(userData.lastName);
        expect(customer.address.street).toBe(userData.street);
        expect(customer.address.city).toBe(userData.city);
        expect(customer.address.state).toBe(userData.state);
        expect(customer.address.zipCode).toBe(userData.zipCode);
        expect(customer.phoneNumber).toBe(userData.phoneNumber);
        expect(customer.ssn).toBe(userData.ssn);
    });

    test('TC-ACC-HYB-001 API Account Creation -> UI Verification', async ({
        page,
        authenticatedUser,
        sourceAccount,
        accountApi,
    }) => {
        const accountsPage = new AccountsPage(page);

        // 1. API: Create a new SAVINGS account (type 1) funded by sourceAccount
        const createRes = await accountApi.createAccount(
            authenticatedUser.customer.id,
            1,
            sourceAccount.id
        );
        expect(createRes.status()).toBe(200);
        const newAccount: Account = await createRes.json();
        // POST /createAccount initially returns balance: 0 before minimum opening deposit posts;
        // fetch GET /accounts/{id} to read the actual funded opening balance
        const apiBalance = await getAccountBalanceViaApi(accountApi, newAccount.id);

        // 2. UI: Refresh Accounts Overview and open the new account details page
        await accountsPage.navigate();
        const accountLink = accountsPage.overviewTable.getByRole('link', {
            name: String(newAccount.id),
        });
        await expect(accountLink).toBeVisible();
        await accountLink.click();

        await expect(accountsPage.accountDetailsHeading).toBeVisible();
        await expect(accountsPage.detailsAccountId).toHaveText(String(newAccount.id));
        await expect(accountsPage.detailsAccountType).toHaveText('SAVINGS');
        await expect(accountsPage.detailsBalance).toHaveText(`$${apiBalance.toFixed(2)}`);
    });

    test('TC-ACC-HYB-002 UI Account Creation -> API Verification', async ({
        page,
        authenticatedUser,
        accountApi,
    }) => {
        const accountsPage = new AccountsPage(page);

        // 1. UI: Open a new CHECKING account and capture its ID
        const createdAccountId = await accountsPage.openAccount('CHECKING');
        expect(createdAccountId).toMatch(/^\d+$/);

        // 2. API: Fetch created account via GET /accounts/{id} and verify metadata
        const getRes = await accountApi.getAccount(createdAccountId);
        expect(getRes.status()).toBe(200);
        const account: Account = await getRes.json();

        expect(account.id).toBe(Number(createdAccountId));
        expect(account.type).toBe('CHECKING');
        expect(account.customerId).toBe(authenticatedUser.customer.id);
        expect(account.balance).toBeGreaterThan(0);
    });

    test('TC-ACC-HYB-003 Balance totals consistency between API and UI', async ({
        page,
        authenticatedUser,
        sourceAccount,
        destinationAccount,
        accountApi,
    }) => {
        const accountsPage = new AccountsPage(page);
        expect(sourceAccount.id).not.toBe(destinationAccount.id);

        // 1. API: Sum balances across all accounts belonging to the customer
        const accountsRes = await accountApi.getCustomerAccounts(authenticatedUser.customer.id);
        expect(accountsRes.status()).toBe(200);
        const accounts: Account[] = await accountsRes.json();
        expect(accounts.length).toBeGreaterThanOrEqual(2);

        const apiTotalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);

        // 2. UI: Navigate to Accounts Overview and verify Total row matches API sum
        await accountsPage.navigate();
        const uiTotalBalance = await accountsPage.getTotalBalance();

        expect(toCents(uiTotalBalance)).toBe(toCents(apiTotalBalance));
    });
});
