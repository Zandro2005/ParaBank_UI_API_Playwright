import { test as base, expect } from '@playwright/test';
import { UserApi, Customer } from '@api/UserApi';
import { AuthApi } from '@api/AuthApi';
import { AccountApi, Account } from '@api/AccountApi';
import { TransferApi } from '@api/TransferApi';
import { TransactionApi } from '@api/TransactionApi';
import { generateRandomUser, CustomerRegistrationData } from '@utils/testDataGenerator';

export interface AuthenticatedUser {
    customer: Customer;
    credentials: CustomerRegistrationData;
}

type BankingFixtures = {
    userApi: UserApi;
    authApi: AuthApi;
    accountApi: AccountApi;
    transferApi: TransferApi;
    transactionApi: TransactionApi;
    authenticatedUser: AuthenticatedUser;
    _pairedAccounts: [Account, Account];
    sourceAccount: Account;
    destinationAccount: Account;
    testAccount: Account;
};

export const test = base.extend<BankingFixtures>({
    // Bind API clients to page.request so cookies set by API calls are shared with the browser page
    userApi: async ({ page }, use) => {
        await use(new UserApi(page.request));
    },

    authApi: async ({ page }, use) => {
        await use(new AuthApi(page.request));
    },

    accountApi: async ({ page }, use) => {
        await use(new AccountApi(page.request));
    },

    transferApi: async ({ page }, use) => {
        await use(new TransferApi(page.request));
    },

    transactionApi: async ({ page }, use) => {
        await use(new TransactionApi(page.request));
    },

    authenticatedUser: async ({ page, userApi, authApi }, use) => {
        const credentials = generateRandomUser('hyb');

        // 1. Register user via page.request so JSESSIONID is stored directly in browser context
        const regRes = await userApi.register(credentials);
        expect(regRes.status()).toBe(200);

        // 2. Fetch generated Customer record (including customer ID)
        const loginRes = await authApi.login(credentials.username, credentials.password);
        expect(loginRes.status()).toBe(200);
        const customer: Customer = await loginRes.json();

        // 3. Open Accounts Overview already authenticated (skipping login UI clicks)
        await page.goto('overview.htm');
        await page.locator('#accountTable').waitFor({ state: 'visible' });

        await use({ customer, credentials });
    },

    // Creates/fetches a funded pair of accounts together so sourceAccount reflects post-creation balance
    _pairedAccounts: async ({ authenticatedUser, accountApi }, use) => {
        const customerId = authenticatedUser.customer.id;

        const res = await accountApi.getCustomerAccounts(customerId);
        expect(res.status()).toBe(200);
        let accounts: Account[] = await res.json();
        expect(accounts.length).toBeGreaterThan(0);

        if (accounts.length < 2) {
            const createRes = await accountApi.createAccount(customerId, 0, accounts[0].id);
            expect(createRes.status()).toBe(200);

            const refreshRes = await accountApi.getCustomerAccounts(customerId);
            expect(refreshRes.status()).toBe(200);
            accounts = await refreshRes.json();
        }

        const sorted = [...accounts].sort((a, b) => b.balance - a.balance);
        await use([sorted[0], sorted[1]]);
    },

    sourceAccount: async ({ _pairedAccounts }, use) => {
        await use(_pairedAccounts[0]);
    },

    destinationAccount: async ({ _pairedAccounts }, use) => {
        await use(_pairedAccounts[1]);
    },

    testAccount: async ({ sourceAccount }, use) => {
        await use(sourceAccount);
    },
});

export { expect };
