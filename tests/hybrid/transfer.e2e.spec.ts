import { test, expect } from '@fixtures/bankingFixture';
import { AccountApi, Account } from '@api/AccountApi';
import { Transaction } from '@api/TransactionApi';
import { TransferPage } from '@pages/TransferPage';
import { AccountsPage } from '@pages/AccountsPage';
import { transferTestData } from '@test-data/transfers';

// Serial mode + pacing keeps live parabank.parasoft.com below Cloudflare 429 rate limits
test.describe.configure({ mode: 'serial' });

test.afterEach(async () => {
    await new Promise((resolve) => setTimeout(resolve, 600));
});

/** Converts dollar floats into integer cents to avoid IEEE 754 precision issues. */
function toCents(amount: number): number {
    return Math.round(amount * 100);
}

/** Fetches current balances [A, B] for two accounts via AccountApi. */
async function getPairBalances(
    accountApi: AccountApi,
    accountAId: number,
    accountBId: number
): Promise<[number, number]> {
    const [resA, resB] = await Promise.all([
        accountApi.getAccount(accountAId),
        accountApi.getAccount(accountBId),
    ]);
    expect(resA.status()).toBe(200);
    expect(resB.status()).toBe(200);

    const [accA, accB]: [Account, Account] = await Promise.all([resA.json(), resB.json()]);
    return [accA.balance, accB.balance];
}

test.describe('3.1 Hybrid Fund Transfer Workflows', () => {
    test('TC-TRF-HYB-001 Main Banking Flow: API Setup -> UI Transfer -> API Balance Verification', async ({
        page,
        authenticatedUser,
        sourceAccount,
        destinationAccount,
        accountApi,
    }) => {
        const transferPage = new TransferPage(page);
        const amount = transferTestData.validAmount; // $50.00

        expect(authenticatedUser.customer.id).toBeGreaterThan(0);

        // 1. API: Record opening balances S and D
        const [initialS, initialD] = await getPairBalances(
            accountApi,
            sourceAccount.id,
            destinationAccount.id
        );

        // 2. UI: Navigate to Transfer Funds, submit transfer, and assert confirmation message
        await transferPage.clickTransferFundsLink();
        await transferPage.transferFunds(amount.toFixed(2), sourceAccount.id, destinationAccount.id);

        await expect(transferPage.transferCompleteHeading).toBeVisible();
        await expect(transferPage.amountResult).toHaveText(`$${amount.toFixed(2)}`);
        await expect(transferPage.fromAccountIdResult).toHaveText(String(sourceAccount.id));
        await expect(transferPage.toAccountIdResult).toHaveText(String(destinationAccount.id));

        // 3. API: Fetch updated balances and confirm S - X and D + X
        const [afterS, afterD] = await getPairBalances(
            accountApi,
            sourceAccount.id,
            destinationAccount.id
        );
        expect(toCents(afterS)).toBe(toCents(initialS) - toCents(amount));
        expect(toCents(afterD)).toBe(toCents(initialD) + toCents(amount));
    });

    test('TC-TRF-HYB-002 Transfer between newly API-created accounts', async ({
        page,
        authenticatedUser,
        sourceAccount,
        accountApi,
    }) => {
        const transferPage = new TransferPage(page);
        const transferAmount = 35;

        // 1. API: Create 2 brand-new CHECKING accounts funded by sourceAccount
        const createRes1 = await accountApi.createAccount(
            authenticatedUser.customer.id,
            0,
            sourceAccount.id
        );
        const createRes2 = await accountApi.createAccount(
            authenticatedUser.customer.id,
            0,
            sourceAccount.id
        );
        expect(createRes1.status()).toBe(200);
        expect(createRes2.status()).toBe(200);

        const newAccount1: Account = await createRes1.json();
        const newAccount2: Account = await createRes2.json();
        const [initialBal1, initialBal2] = await getPairBalances(
            accountApi,
            newAccount1.id,
            newAccount2.id
        );

        // 2. UI: Execute transfer between the 2 newly created accounts
        await transferPage.clickTransferFundsLink();
        await transferPage.transferFunds(String(transferAmount), newAccount1.id, newAccount2.id);

        await expect(transferPage.transferCompleteHeading).toBeVisible();
        await expect(transferPage.fromAccountIdResult).toHaveText(String(newAccount1.id));
        await expect(transferPage.toAccountIdResult).toHaveText(String(newAccount2.id));

        // 3. API: Verify updated balances on both new accounts
        const [afterBal1, afterBal2] = await getPairBalances(
            accountApi,
            newAccount1.id,
            newAccount2.id
        );
        expect(toCents(afterBal1)).toBe(toCents(initialBal1) - toCents(transferAmount));
        expect(toCents(afterBal2)).toBe(toCents(initialBal2) + toCents(transferAmount));
    });

    test('TC-TRF-HYB-003 UI transfer logged in API transaction ledger', async ({
        page,
        sourceAccount,
        destinationAccount,
        transactionApi,
    }) => {
        const transferPage = new TransferPage(page);
        const amount = 45;

        // 1. API: Snapshot existing transaction IDs before transfer
        const [beforeSrcRes, beforeDestRes] = await Promise.all([
            transactionApi.getAccountTransactions(sourceAccount.id),
            transactionApi.getAccountTransactions(destinationAccount.id),
        ]);
        const beforeSrcIds = new Set(
            ((await beforeSrcRes.json()) as Transaction[]).map((t) => t.id)
        );
        const beforeDestIds = new Set(
            ((await beforeDestRes.json()) as Transaction[]).map((t) => t.id)
        );

        // 2. UI: Execute fund transfer
        await transferPage.clickTransferFundsLink();
        await transferPage.transferFunds(String(amount), sourceAccount.id, destinationAccount.id);
        await expect(transferPage.transferCompleteHeading).toBeVisible();

        // 3. API: Query transaction ledgers for both accounts and verify double-entry records
        const [afterSrcRes, afterDestRes] = await Promise.all([
            transactionApi.getAccountTransactions(sourceAccount.id),
            transactionApi.getAccountTransactions(destinationAccount.id),
        ]);
        expect(afterSrcRes.status()).toBe(200);
        expect(afterDestRes.status()).toBe(200);

        const srcTxns: Transaction[] = await afterSrcRes.json();
        const destTxns: Transaction[] = await afterDestRes.json();

        const debitEntry = srcTxns.find(
            (t) => !beforeSrcIds.has(t.id) && t.type === 'Debit' && t.amount === amount
        );
        const creditEntry = destTxns.find(
            (t) => !beforeDestIds.has(t.id) && t.type === 'Credit' && t.amount === amount
        );

        expect(debitEntry).toBeDefined();
        expect(creditEntry).toBeDefined();
        // Server calendar day matches today (within 24h tolerance across local/server timezones)
        expect(Math.abs(Date.now() - debitEntry!.date)).toBeLessThan(24 * 60 * 60 * 1000);
        expect(Math.abs(Date.now() - creditEntry!.date)).toBeLessThan(24 * 60 * 60 * 1000);
    });

    test('TC-TRF-HYB-004 Fractional decimal transfer precision E2E', async ({
        page,
        sourceAccount,
        destinationAccount,
        accountApi,
    }) => {
        const transferPage = new TransferPage(page);
        const fractionalAmount = transferTestData.fractionalAmount; // 12.34

        // 1. API: Record opening balances
        const [initialS, initialD] = await getPairBalances(
            accountApi,
            sourceAccount.id,
            destinationAccount.id
        );

        // 2. UI: Transfer $12.34 via browser form
        await transferPage.clickTransferFundsLink();
        await transferPage.transferFunds(
            fractionalAmount.toFixed(2),
            sourceAccount.id,
            destinationAccount.id
        );
        await expect(transferPage.transferCompleteHeading).toBeVisible();
        await expect(transferPage.amountResult).toHaveText(`$${fractionalAmount.toFixed(2)}`);

        // 3. API: Confirm exact balance deltas to the cent (zero IEEE 754 drift)
        const [afterS, afterD] = await getPairBalances(
            accountApi,
            sourceAccount.id,
            destinationAccount.id
        );
        expect(toCents(afterS)).toBe(toCents(initialS) - toCents(fractionalAmount));
        expect(toCents(afterD)).toBe(toCents(initialD) + toCents(fractionalAmount));
    });

    test('TC-TRF-HYB-005 Failed UI transfer leaves backend balances intact', async ({
        page,
        sourceAccount,
        destinationAccount,
        accountApi,
    }) => {
        const transferPage = new TransferPage(page);

        // 1. API: Record opening balances
        const [initialS, initialD] = await getPairBalances(
            accountApi,
            sourceAccount.id,
            destinationAccount.id
        );

        // 2. UI: Submit transfer with empty amount
        await transferPage.clickTransferFundsLink();
        await transferPage.transferFunds('', sourceAccount.id, destinationAccount.id);

        await expect(transferPage.errorHeading).toBeVisible();
        await expect(transferPage.transferCompleteHeading).not.toBeVisible();

        // 3. API: Verify backend balances are 100% unchanged
        const [afterS, afterD] = await getPairBalances(
            accountApi,
            sourceAccount.id,
            destinationAccount.id
        );
        expect(toCents(afterS)).toBe(toCents(initialS));
        expect(toCents(afterD)).toBe(toCents(initialD));
    });

    test('TC-TRF-HYB-006 Multiple sequential UI transfers stay consistent', async ({
        page,
        sourceAccount,
        destinationAccount,
        accountApi,
    }) => {
        const transferPage = new TransferPage(page);
        const sequentialAmounts = [10, 20, 30];
        const totalTransferred = sequentialAmounts.reduce((sum, val) => sum + val, 0); // $60

        // 1. API: Record opening balances
        const [initialS, initialD] = await getPairBalances(
            accountApi,
            sourceAccount.id,
            destinationAccount.id
        );

        // 2. UI: Execute sequential transfers ($10 -> $20 -> $30)
        for (const amount of sequentialAmounts) {
            await transferPage.clickTransferFundsLink();
            await transferPage.transferFunds(String(amount), sourceAccount.id, destinationAccount.id);
            await expect(transferPage.transferCompleteHeading).toBeVisible();
        }

        // 3. API: Verify cumulative debit and credit equal exactly $60
        const [afterS, afterD] = await getPairBalances(
            accountApi,
            sourceAccount.id,
            destinationAccount.id
        );
        expect(toCents(afterS)).toBe(toCents(initialS) - toCents(totalTransferred));
        expect(toCents(afterD)).toBe(toCents(initialD) + toCents(totalTransferred));
    });

    test('TC-TRF-HYB-007 API transfer immediately reflected in UI table', async ({
        page,
        authenticatedUser,
        sourceAccount,
        destinationAccount,
        transferApi,
        accountApi,
    }) => {
        const accountsPage = new AccountsPage(page);
        const transferAmount = 25;

        expect(authenticatedUser.customer.id).toBeGreaterThan(0);

        // 1. API: Read initial balances and execute direct API transfer
        const [initialS, initialD] = await getPairBalances(
            accountApi,
            sourceAccount.id,
            destinationAccount.id
        );
        const transferRes = await transferApi.transfer(
            sourceAccount.id,
            destinationAccount.id,
            transferAmount
        );
        expect(transferRes.status()).toBe(200);

        const [apiBalanceS, apiBalanceD] = await getPairBalances(
            accountApi,
            sourceAccount.id,
            destinationAccount.id
        );
        expect(toCents(apiBalanceS)).toBe(toCents(initialS) - toCents(transferAmount));
        expect(toCents(apiBalanceD)).toBe(toCents(initialD) + toCents(transferAmount));

        // 2. UI: Reload Accounts Overview and verify UI table reflects exact backend balances
        await page.reload();
        const uiBalanceS = await accountsPage.getAccountBalance(sourceAccount.id);
        const uiBalanceD = await accountsPage.getAccountBalance(destinationAccount.id);

        expect(toCents(uiBalanceS)).toBe(toCents(apiBalanceS));
        expect(toCents(uiBalanceD)).toBe(toCents(apiBalanceD));
    });
});
