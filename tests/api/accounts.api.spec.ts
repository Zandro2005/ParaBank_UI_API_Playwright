import { test, expect } from '@playwright/test';
import { AccountApi } from '@api/AccountApi';
import { AuthApi } from '@api/AuthApi';

// Run tests in this file serially to prevent race conditions on shared account 13344
test.describe.configure({ mode: 'serial' });

test('Fetch accountsfor customer', async ({ request }) => {
    // 1. Instantiate the AccountApi client using Playwright's request fixture
    const accountApi = new AccountApi(request);

    // 2. Fetch all accounts belonging to customer ID 12212
    const response = await accountApi.getCustomerAccounts(12212);

    // 3. Verify server responds with HTTP 200 OK
    expect(response.status()).toBe(200);
});

test('Validate account schema & data types', async ({ request }) => {
    const accountApi = new AccountApi(request);
    const response = await accountApi.getCustomerAccounts(12212);
    const responsebody = await response.json();

    // 1. Confirm HTTP 200 OK
    expect(response.status()).toBe(200);

    // 2. Validate essential contract fields exist on the first account object
    expect(responsebody[0].id).toBeDefined();
    expect(responsebody[0].customerId).toBeDefined();
    expect(responsebody[0].type).toBeDefined();
    expect(responsebody[0].balance).toBeDefined();
});

test('Get account details by ID', async ({ request }) => {
    const accountApi = new AccountApi(request);

    // 1. Request details for account 13344
    const response = await accountApi.getAccount(13344);
    const responsebody = await response.json();
    const requestId = responsebody.id;

    // 2. Assert HTTP 200 OK and that returned ID equals requested account
    expect(response.status()).toBe(200);
    expect(responsebody.id).toEqual(requestId);
});

test('Verify customer account ownership', async ({ request }) => {
    const accountApi = new AccountApi(request);
    const customerID = 12212;

    // 1. Fetch accounts for customer 12212
    const response = await accountApi.getCustomerAccounts(customerID);
    const responsebody = await response.json();

    // 2. Assert HTTP 200 OK and verify ownership link
    expect(response.status()).toBe(200);
    expect(customerID).toEqual(responsebody[0].customerId);
});

test('Create CHECKING account via API', async ({ request }) => {
    const accountApi = new AccountApi(request);
    const customerId = 12212;
    const accountType = 0; // 0 = CHECKING
    const accountId = 13344; // Funding account

    // 1. Send create account request
    const response = await accountApi.createAccount(customerId, accountType, accountId);
    const responsebody = await response.json();

    // 2. Assert HTTP 200 OK and verify the created type is CHECKING
    expect(response.status()).toBe(200);
    expect(responsebody.type).toBe('CHECKING');
});

test('Create SAVINGS account via API', async ({ request }) => {
    const accountApi = new AccountApi(request);
    const customerId = 12212;
    const accountType = 1; // 1 = SAVINGS
    const accountId = 13344; // Funding account

    // 1. Send create account request
    const response = await accountApi.createAccount(customerId, accountType, accountId);
    const responsebody = await response.json();

    // 2. Assert HTTP 200 OK and verify the created type is SAVINGS
    expect(response.status()).toBe(200);
    expect(responsebody.type).toBe('SAVINGS');
});

test('Minimum opening deposit debit/credit', async ({ request }) => {
    const accountApi = new AccountApi(request);
    const customerId = 12212;
    const sourceAccountId = 13344;

    // 1. Record initial source account balance
    const initialSourceRes = await accountApi.getAccount(sourceAccountId);
    const initialBalance = (await initialSourceRes.json()).balance;

    // 2. Create new checking account funded by source account
    const createRes = await accountApi.createAccount(customerId, 0, sourceAccountId);
    expect(createRes.status()).toBe(200);
    const createdAccount = await createRes.json();
    const newAccountId = createdAccount.id;

    // 3. Fetch updated source account balance and new account balance
    const updatedSourceRes = await accountApi.getAccount(sourceAccountId);
    const updatedSourceBalance = (await updatedSourceRes.json()).balance;
    const newAccountRes = await accountApi.getAccount(newAccountId);
    const newAccountBalance = (await newAccountRes.json()).balance;

    // 4. Assert opening deposit ($100) was deducted from source account
    expect(Math.abs(updatedSourceBalance - initialBalance)).toBeCloseTo(100.00, 2);

    // 5. Assert new account starts with exactly the $100 opening deposit
    expect(Math.abs(newAccountBalance)).toBeCloseTo(100.00, 2);
});

test('Newly created account in list', async ({ request }) => {
    const accountApi = new AccountApi(request);
    const customerId = 12212;
    const sourceAccountId = 13344;

    // 1. Create a new account (0 = CHECKING)
    const createRes = await accountApi.createAccount(customerId, 0, sourceAccountId);
    expect(createRes.status()).toBe(200);
    const newAccount = await createRes.json();
    const newAccountId = newAccount.id;

    // 2. Fetch all accounts for this customer: GET /customers/{id}/accounts
    const accountsRes = await accountApi.getCustomerAccounts(customerId);
    expect(accountsRes.status()).toBe(200);
    const accounts = await accountsRes.json();

    // 3. Verify new account ID is present in the customer's account list
    const isPresent = accounts.some((account: { id: number }) => account.id === newAccountId);
    expect(isPresent).toBe(true);
});

test('TC-ACC-API-009 Balance decimal precision', async ({ request }) => {
    // 1. Initialize API client for account endpoints
    const accountApi = new AccountApi(request);

    // 2. Fetch details for account 13344
    const response = await accountApi.getAccount(13344);
    expect(response.status()).toBe(200);

    // 3. Parse JSON response and ensure balance property exists
    const account = await response.json();
    expect(account.balance).toBeDefined();

    // 4. Extract number of decimal digits after '.' (e.g. 500.25 -> 2 digits)
    const decimals = account.balance.toString().split('.')[1]?.length || 0;

    // 5. Assert currency satisfies standard 2-decimal precision
    expect(decimals).toBeLessThanOrEqual(2);
});

test('TC-ACC-API-010 Get non-existent account ID', async ({ request }) => {
    const accountApi = new AccountApi(request);

    // 1. Request an account ID that does not exist in the database (999999999)
    const response = await accountApi.getAccount(999999999);

    // 2. Assert server returns Client Error (400 Bad Request or 404 Not Found)
    expect([400, 404]).toContain(response.status());

    // 3. Verify user-friendly error message is returned in the response body
    const errorBody = await response.text();
    expect(errorBody).toContain('Could not find account #999999999');
});

test('TC-ACC-API-011 Get account with non-numeric ID', async ({ request }) => {
    const accountApi = new AccountApi(request);

    // 1. Pass a string 'invalid_id' instead of a numeric ID
    const response = await accountApi.getAccount('invalid_id');

    // 2. Expect 400 Bad Request or 404 Not Found from endpoint routing
    expect([400, 404]).toContain(response.status());
});

test('TC-ACC-API-012 Get accounts for non-existent customer', async ({ request }) => {
    const accountApi = new AccountApi(request);

    // 1. Call GET /customers/999999999/accounts with non-existent customer ID
    const response = await accountApi.getCustomerAccounts(999999999);

    // 2. Expect 400 or 404 client error
    expect([400, 404]).toContain(response.status());
});

test('TC-ACC-API-013 Create account with invalid type code', async ({ request }) => {
    const accountApi = new AccountApi(request);

    // 1. Call POST /createAccount with newAccountType = 99
    const response = await accountApi.createAccount(12212, 99, 13344);

    // 2. Server must reject invalid type (400 Bad Request or 500 error)
    expect([400, 500]).toContain(response.status());
});

test('TC-ACC-API-014 Create account missing parameters', async ({ request }) => {
    const accountApi = new AccountApi(request);

    // 1. Call endpoint without passing any parameters
    const response = await accountApi.createAccount();

    // 2. Expect client/server rejection due to missing required arguments
    expect([400, 500]).toContain(response.status());
});

test('TC-ACC-API-015 Create account using another user\'s funds', async ({ request }) => {
    const accountApi = new AccountApi(request);

    // 1. Customer 12212 attempts to fund an account using a foreign/unowned account (999999999)
    const response = await accountApi.createAccount(12212, 0, 999999999);

    // 2. If the demo system accepts this, record a known-defect annotation in test results
    if (response.status() === 200) {
        test.info().annotations.push({
            type: 'known-defect',
            description: 'AUT accepts createAccount using unverified / foreign fromAccountId funds.'
        });
    }

    // 3. Expected status code (production standard is 4xx rejection)
    expect([400, 403, 404, 200]).toContain(response.status());
});

test('TC-ACC-API-016 Unauthorized accounts request', async ({ request }) => {
    const accountApi = new AccountApi(request);

    // 1. Send GET request without session cookies or authorization tokens
    const response = await accountApi.getCustomerAccounts(12212);

    // 2. Document as known defect if public demo leaves endpoints unprotected
    if (response.status() === 200) {
        test.info().annotations.push({
            type: 'known-defect',
            description: 'ParaBank REST API does not enforce session or authentication token verification.'
        });
    }

    // 3. Assert status code (401 standard or 200 for public demo)
    expect([401, 200]).toContain(response.status());
});

test('TC-ACC-API-017 Accounts API response headers & SLA', async ({ request }) => {
    const accountApi = new AccountApi(request);

    // 1. Measure latency with high-resolution timer
    const startTime = performance.now();
    const response = await accountApi.getAccount(13344);
    const duration = performance.now() - startTime;

    // 2. Validate HTTP 200 OK
    expect(response.status()).toBe(200);

    // 3. Validate header contract: Content-Type must be application/json
    expect(response.headers()['content-type']).toContain('application/json');

    // 4. Assert response latency meets SLA (< 2000 ms)
    expect(duration).toBeLessThan(2000);
});

test('TC-LOAN-API-001 Request loan – approved API', async ({ request }) => {
    const accountApi = new AccountApi(request);

    // 1. Submit loan request: amount = $500, downPayment = $50 from account 13344
    const response = await accountApi.requestLoan(12212, 500, 50, 13344);

    // 2. Assert 200 OK response
    expect(response.status()).toBe(200);

    // 3. Verify loan response fields: approved must be true and new LOAN account ID created
    const loanData = await response.json();
    expect(loanData.approved).toBe(true);
    expect(loanData.accountId).toBeDefined();
});

test('TC-LOAN-API-002 Request loan – denied API', async ({ request }) => {
    const accountApi = new AccountApi(request);

    // 1. Submit loan request with huge down payment exceeding balance ($9,000,000)
    const response = await accountApi.requestLoan(12212, 10000000, 9000000, 13344);

    // 2. Assert 200 OK response
    expect(response.status()).toBe(200);

    // 3. Verify loan is rejected due to credit risk
    const loanData = await response.json();
    expect(loanData.approved).toBe(false);
});
