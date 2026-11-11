import { test, expect } from '@fixtures/bankingFixture';
import { Transaction } from '@api/TransactionApi';
import { TransferPage } from '@pages/TransferPage';
import { TransactionsPage } from '@pages/TransactionsPage';
import { AccountsPage } from '@pages/AccountsPage';
import { validPayee } from '@test-data/payments';
import { formatUtcMmDdYyyy, snapshotTransactionIds } from '@utils/apiHelpers';

// Serial mode + pacing keeps live parabank.parasoft.com below Cloudflare 429 rate limits
test.describe.configure({ mode: 'serial' });

test.afterEach(async () => {
    await new Promise((resolve) => setTimeout(resolve, 600));
});

test.describe('3.4 Hybrid Transaction Verification', () => {
    test('TC-TXN-HYB-001 API Transaction -> UI Search -> API Record Match', async ({
        page,
        sourceAccount,
        destinationAccount,
        transferApi,
        transactionApi,
    }) => {
        const transactionsPage = new TransactionsPage(page);
        const uniqueAmount = 19.87;

        // 1. API: Execute transfer with a unique amount ($19.87)
        const transferRes = await transferApi.transfer(
            sourceAccount.id,
            destinationAccount.id,
            uniqueAmount
        );
        expect(transferRes.status()).toBe(200);

        // 2. UI: Find Transactions by Amount and inspect the matching record
        await transactionsPage.clickFindTransactionsLink();
        await transactionsPage.selectAccount(String(sourceAccount.id));
        await transactionsPage.searchByAmount(uniqueAmount.toFixed(2));

        await expect(transactionsPage.transactionResultsHeading).toBeVisible();
        const matchingRow = transactionsPage.transactionRows
            .filter({ hasText: `$${uniqueAmount.toFixed(2)}` })
            .first();
        await expect(matchingRow).toBeVisible();

        // 3. UI: Open Transaction Details and capture the Transaction ID
        await matchingRow.locator('td:nth-child(2) a').click();
        await expect(transactionsPage.transactionDetailsHeading).toBeVisible();
        const uiTransactionId = (await transactionsPage.detailTransactionId.innerText()).trim();
        expect(uiTransactionId).toMatch(/^\d+$/);

        // 4. API: Verify GET /transactions/{id} returns matching transaction record
        const txnRes = await transactionApi.getTransaction(uiTransactionId);
        expect(txnRes.status()).toBe(200);
        const apiTxn: Transaction = await txnRes.json();

        expect(apiTxn.id).toBe(Number(uiTransactionId));
        expect(apiTxn.accountId).toBe(sourceAccount.id);
        expect(apiTxn.type).toBe('Debit');
        expect(apiTxn.amount).toBe(uniqueAmount);
    });

    test('TC-TXN-HYB-002 API transfer displays in UI Account Activity table', async ({
        page,
        sourceAccount,
        destinationAccount,
        transferApi,
        transactionApi,
    }) => {
        const accountsPage = new AccountsPage(page);
        const transactionsPage = new TransactionsPage(page);
        const amount = 33.21;

        // 1. API: Execute transfer of $33.21 and resolve its server calendar date
        const transferRes = await transferApi.transfer(
            sourceAccount.id,
            destinationAccount.id,
            amount
        );
        expect(transferRes.status()).toBe(200);

        const apiTxRes = await transactionApi.getAccountTransactions(sourceAccount.id);
        const apiTxns: Transaction[] = await apiTxRes.json();
        const sentTxn = apiTxns.find(
            (t) => t.amount === amount && t.description === 'Funds Transfer Sent'
        );
        expect(sentTxn).toBeDefined();
        const expectedDate = formatUtcMmDdYyyy(sentTxn!.date);

        // 2. UI: Open Account Details activity table and verify the transfer row
        await accountsPage.navigate();
        await accountsPage.overviewTable.getByRole('link', { name: String(sourceAccount.id) }).click();
        await expect(accountsPage.accountDetailsHeading).toBeVisible();

        const targetRow = transactionsPage.transactionRows
            .filter({ hasText: 'Funds Transfer Sent' })
            .filter({ hasText: `$${amount.toFixed(2)}` })
            .first();
        await expect(targetRow).toBeVisible();
        await expect(targetRow.locator('td:nth-child(1)')).toHaveText(expectedDate);
        await expect(targetRow.locator('td:nth-child(3)')).toHaveText(`$${amount.toFixed(2)}`);
    });

    test('TC-TXN-HYB-003 UI transfer creates credit entry verified in API', async ({
        page,
        sourceAccount,
        destinationAccount,
        transactionApi,
    }) => {
        const transferPage = new TransferPage(page);
        const amount = 27.5;

        // 1. API: Snapshot destination transaction IDs before UI transfer
        const beforeDestIds = await snapshotTransactionIds(transactionApi, destinationAccount.id);

        // 2. UI: Submit transfer via TransferPage
        await transferPage.clickTransferFundsLink();
        await transferPage.transferFunds(
            amount.toFixed(2),
            sourceAccount.id,
            destinationAccount.id
        );
        await expect(transferPage.transferCompleteHeading).toBeVisible();

        // 3. API: Verify destination account gained a Credit +$27.50 entry dated today
        const txRes = await transactionApi.getAccountTransactions(destinationAccount.id);
        expect(txRes.status()).toBe(200);
        const transactions: Transaction[] = await txRes.json();

        const creditEntry = transactions.find(
            (t) =>
                !beforeDestIds.has(t.id) &&
                t.type === 'Credit' &&
                t.amount === amount &&
                t.description === 'Funds Transfer Received'
        );
        expect(creditEntry).toBeDefined();
        expect(Math.abs(Date.now() - creditEntry!.date)).toBeLessThan(24 * 60 * 60 * 1000);
    });

    test('TC-TXN-HYB-004 API bill payment searchable in UI by date', async ({
        page,
        sourceAccount,
        transferApi,
        transactionApi,
    }) => {
        const transactionsPage = new TransactionsPage(page);
        const billAmount = 42.15;

        // 1. API: Execute bill payment and determine server-recorded transaction date
        const beforeIds = await snapshotTransactionIds(transactionApi, sourceAccount.id);
        const payRes = await transferApi.billPay(sourceAccount.id, billAmount, validPayee);
        expect(payRes.status()).toBe(200);

        const txRes = await transactionApi.getAccountTransactions(sourceAccount.id);
        const txns: Transaction[] = await txRes.json();
        const billTxn = txns.find(
            (t) =>
                !beforeIds.has(t.id) &&
                t.amount === billAmount &&
                t.description === `Bill Payment to ${validPayee.name}`
        );
        expect(billTxn).toBeDefined();
        const searchDate = formatUtcMmDdYyyy(billTxn!.date);

        // 2. UI: Search transactions by Date and verify bill payment entry appears
        await transactionsPage.clickFindTransactionsLink();
        await transactionsPage.selectAccount(String(sourceAccount.id));
        await transactionsPage.searchByDate(searchDate);

        await expect(transactionsPage.transactionResultsHeading).toBeVisible();
        const resultRow = transactionsPage.transactionRows
            .filter({ hasText: `Bill Payment to ${validPayee.name}` })
            .filter({ hasText: `$${billAmount.toFixed(2)}` })
            .first();
        await expect(resultRow).toBeVisible();
    });
});
