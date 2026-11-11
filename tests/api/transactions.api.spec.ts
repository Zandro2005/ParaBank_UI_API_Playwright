import { test, expect } from '@playwright/test';
import { TransactionApi, Transaction } from '@api/TransactionApi';
import { AccountApi } from '@api/AccountApi';
import { TransferApi } from '@api/TransferApi';

// Run tests serially to maintain predictable state and avoid Cloudflare rate-limit bursts
test.describe.configure({ mode: 'serial' });

/**
 * Formats a Unix epoch timestamp (ms) into MM-DD-YYYY using UTC
 * so date queries match ParaBank's server calendar dates regardless of local timezone.
 */
function formatUtcMmDdYyyy(epochMs: number): string {
    const dt = new Date(epochMs);
    const mm = String(dt.getUTCMonth() + 1).padStart(2, '0');
    const dd = String(dt.getUTCDate()).padStart(2, '0');
    const yyyy = dt.getUTCFullYear();
    return `${mm}-${dd}-${yyyy}`;
}

test.describe('2.4 Transactions API Test Suite', () => {
    const customerId = 12212;
    const knownTransferAmount = 37.5;

    let accountId = 13344;
    let knownTransaction: Transaction;

    test.beforeAll(async ({ request }) => {
        const accountApi = new AccountApi(request);
        const transferApi = new TransferApi(request);
        const transactionApi = new TransactionApi(request);

        // 1. Fetch existing accounts for customer 12212 and pick the highest-balance account
        const accRes = await accountApi.getCustomerAccounts(customerId);
        expect(accRes.status()).toBe(200);
        const accounts = await accRes.json();
        const sortedAccounts = [...accounts].sort((a: any, b: any) => b.balance - a.balance);
        accountId = sortedAccounts[0]?.id || 13344;

        // 2. Ensure a second account exists so we can execute a deterministic transfer
        let destAccountId = sortedAccounts[1]?.id;
        if (!destAccountId) {
            const createRes = await accountApi.createAccount(customerId, 0, accountId);
            expect(createRes.status()).toBe(200);
            destAccountId = (await createRes.json()).id;
        }

        // 3. Execute a transfer of a known amount ($37.50) so amount/date query tests have guaranteed data
        const transferRes = await transferApi.transfer(accountId, destAccountId, knownTransferAmount);
        expect(transferRes.status()).toBe(200);

        // 4. Fetch account transactions and store the matching transaction as reference data
        const txRes = await transactionApi.getAccountTransactions(accountId);
        expect(txRes.status()).toBe(200);
        const transactions: Transaction[] = await txRes.json();
        const matched = transactions.find((tx) => tx.amount === knownTransferAmount);
        knownTransaction = matched || transactions[0];
        expect(knownTransaction).toBeDefined();
    });

    test.afterEach(async () => {
        // Pacing delay to stay safely below parabank.parasoft.com Cloudflare rate limits
        await new Promise((resolve) => setTimeout(resolve, 300));
    });

    test('TC-TXN-API-001 Get transactions for account', async ({ request }) => {
        const transactionApi = new TransactionApi(request);

        // 1. Send GET /accounts/{id}/transactions for an active account
        const response = await transactionApi.getAccountTransactions(accountId);

        // 2. Verify HTTP 200 OK status
        expect(response.status()).toBe(200);

        // 3. Verify response body is a non-empty JSON array of transaction objects
        const transactions: Transaction[] = await response.json();
        expect(Array.isArray(transactions)).toBe(true);
        expect(transactions.length).toBeGreaterThan(0);
    });

    test('TC-TXN-API-002 Validate transaction schema & types', async ({ request }) => {
        const transactionApi = new TransactionApi(request);

        // 1. Fetch account transactions list
        const response = await transactionApi.getAccountTransactions(accountId);
        expect(response.status()).toBe(200);

        const transactions: Transaction[] = await response.json();
        expect(transactions.length).toBeGreaterThan(0);

        // 2. Validate contract fields and primitive types on the first transaction entry
        const tx = transactions[0];
        expect(Number.isInteger(tx.id)).toBe(true);
        expect(Number.isInteger(tx.accountId)).toBe(true);
        expect(['Credit', 'Debit']).toContain(tx.type);
        expect(typeof tx.date).toBe('number');
        expect(tx.date).toBeGreaterThan(0);
        expect(typeof tx.amount).toBe('number');
        expect(typeof tx.description).toBe('string');
        expect(tx.description.length).toBeGreaterThan(0);
    });

    test('TC-TXN-API-003 Get individual transaction by ID', async ({ request }) => {
        const transactionApi = new TransactionApi(request);

        // 1. Request a single transaction using a known transaction ID from the list
        const response = await transactionApi.getTransaction(knownTransaction.id);

        // 2. Verify HTTP 200 OK
        expect(response.status()).toBe(200);

        // 3. Assert returned payload exactly matches the entry from the account transaction list
        const txDetails: Transaction = await response.json();
        expect(txDetails).toEqual(knownTransaction);
    });

    test('TC-TXN-API-004 Transaction account association', async ({ request }) => {
        const transactionApi = new TransactionApi(request);

        // 1. Fetch all transactions for the requested account
        const response = await transactionApi.getAccountTransactions(accountId);
        expect(response.status()).toBe(200);
        const transactions: Transaction[] = await response.json();

        // 2. Business rule: every returned transaction must belong exclusively to the requested accountId
        expect(transactions.length).toBeGreaterThan(0);
        for (const tx of transactions) {
            expect(tx.accountId).toBe(accountId);
        }
    });

    test('TC-TXN-API-005 Query transactions by specific amount', async ({ request }) => {
        const transactionApi = new TransactionApi(request);

        // 1. Query GET /accounts/{id}/transactions/amount/{X} using the transfer amount from beforeAll
        const response = await transactionApi.getTransactionsByAmount(accountId, knownTransferAmount);
        expect(response.status()).toBe(200);

        // 2. Verify at least one transaction is returned and every entry matches amount = X
        const matchingTxns: Transaction[] = await response.json();
        expect(Array.isArray(matchingTxns)).toBe(true);
        expect(matchingTxns.length).toBeGreaterThan(0);
        for (const tx of matchingTxns) {
            expect(tx.amount).toBeCloseTo(knownTransferAmount, 2);
        }
    });

    test('TC-TXN-API-006 Query transactions on specific date', async ({ request }) => {
        const transactionApi = new TransactionApi(request);

        // 1. Format the known transaction's date as MM-DD-YYYY (e.g., 11-11-2026)
        const targetDateStr = formatUtcMmDdYyyy(knownTransaction.date);

        // 2. Query GET /accounts/{id}/transactions/onDate/{MM-DD-YYYY}
        const response = await transactionApi.getTransactionsOnDate(accountId, targetDateStr);
        expect(response.status()).toBe(200);

        // 3. Confirm returned transactions include our reference transaction recorded on that date
        const txnsOnDate: Transaction[] = await response.json();
        expect(Array.isArray(txnsOnDate)).toBe(true);
        expect(txnsOnDate.length).toBeGreaterThan(0);
        expect(txnsOnDate.some((tx) => tx.id === knownTransaction.id)).toBe(true);
    });

    test('TC-TXN-API-007 Query transactions within date range', async ({ request }) => {
        const transactionApi = new TransactionApi(request);
        const oneDayMs = 24 * 60 * 60 * 1000;

        // 1. Build an inclusive [d1, d2] range spanning 7 days before through 1 day after knownTransaction
        const startEpoch = knownTransaction.date - 7 * oneDayMs;
        const endEpoch = knownTransaction.date + 1 * oneDayMs;
        const d1 = formatUtcMmDdYyyy(startEpoch);
        const d2 = formatUtcMmDdYyyy(endEpoch);

        // 2. Query GET /accounts/{id}/transactions/fromDate/{d1}/toDate/{d2}
        const response = await transactionApi.getTransactionsByDateRange(accountId, d1, d2);
        expect(response.status()).toBe(200);

        const txnsInRange: Transaction[] = await response.json();
        expect(Array.isArray(txnsInRange)).toBe(true);
        expect(txnsInRange.length).toBeGreaterThan(0);

        // 3. Assert every returned record's date falls within [d1, d2] (with 24h UTC/server offset tolerance)
        const minAllowedMs = startEpoch - oneDayMs;
        const maxAllowedMs = endEpoch + oneDayMs;
        for (const tx of txnsInRange) {
            expect(tx.date).toBeGreaterThanOrEqual(minAllowedMs);
            expect(tx.date).toBeLessThanOrEqual(maxAllowedMs);
        }
    });

    test('TC-TXN-API-008 Get transaction with non-existent ID', async ({ request }) => {
        const transactionApi = new TransactionApi(request);
        const nonExistentId = 999999999;

        // 1. Request transaction ID that does not exist
        const response = await transactionApi.getTransaction(nonExistentId);

        // 2. Assert 400 Bad Request and verify descriptive error message
        expect(response.status()).toBe(400);
        const errorText = await response.text();
        expect(errorText).toContain(`Could not find transaction #${nonExistentId}`);
    });

    test('TC-TXN-API-009 Get transactions for invalid account', async ({ request }) => {
        const transactionApi = new TransactionApi(request);
        const invalidAccountId = 999999999;

        // 1. Request transactions for a non-existent account ID
        const response = await transactionApi.getAccountTransactions(invalidAccountId);

        // 2. Assert 400 Bad Request
        expect(response.status()).toBe(400);
        const errorText = await response.text();
        expect(errorText).toContain(`Could not find transactions for account #${invalidAccountId}`);
    });

    test('TC-TXN-API-010 Query transactions with invalid date format', async ({ request }) => {
        const transactionApi = new TransactionApi(request);
        const invalidDate = '2026-99-99';

        // 1. Query using invalid date format (YYYY-MM-DD with out-of-range month/day)
        const response = await transactionApi.getTransactionsOnDate(accountId, invalidDate);

        // 2. ParaBank uses lenient SimpleDateFormat('MM-dd-yyyy') and may roll over invalid digits to 200 OK []
        if (response.status() === 200) {
            test.info().annotations.push({
                type: 'known-defect',
                description: 'ParaBank uses lenient date parsing on "2026-99-99" and returns 200 [] instead of 400 Bad Request.',
            });
            const body = await response.json();
            expect(body).toEqual([]);
        } else {
            // Strict server validation returns 400 Bad Request or 404 Not Found
            expect([400, 404]).toContain(response.status());
        }
    });
});
