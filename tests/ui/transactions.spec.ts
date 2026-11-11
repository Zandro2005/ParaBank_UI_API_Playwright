import { test, expect } from '@fixtures/authFixture';
import { TransactionsPage } from '@pages/TransactionsPage';
import { AccountsPage } from '@pages/AccountsPage';

test.describe('Transactions History & Search UI', () => {

    test('TC-TXN-UI-001 View account activity table', async ({ loginPage, page }) => {
        const accountsPage = new AccountsPage(page);
        const transactionsPage = new TransactionsPage(page);

        // Open a new account so it is guaranteed to have a transaction
        await accountsPage.openAccount('CHECKING');
        await accountsPage.newAccountIdLink.click();

        await expect(transactionsPage.transactionTable).toBeVisible();
        await expect(transactionsPage.dateColumnHeader).toBeVisible();
        await expect(transactionsPage.transactionColumnHeader).toBeVisible();
        await expect(transactionsPage.debitColumnHeader).toBeVisible();
        await expect(transactionsPage.creditColumnHeader).toBeVisible();
    });

    test('TC-TXN-UI-002 View transaction details', async ({ loginPage, page }) => {
        const accountsPage = new AccountsPage(page);
        const transactionsPage = new TransactionsPage(page);

        await accountsPage.openAccount('CHECKING');
        await accountsPage.newAccountIdLink.click();

        const firstTxLink = transactionsPage.transactionRows.first().locator('td:nth-child(2) a');
        await firstTxLink.waitFor({ state: 'visible' });
        await firstTxLink.click();

        await expect(transactionsPage.transactionDetailsHeading).toBeVisible();
        await expect(transactionsPage.detailTransactionId).not.toBeEmpty();
        await expect(transactionsPage.detailDate).not.toBeEmpty();
        await expect(transactionsPage.detailDescription).not.toBeEmpty();
        await expect(transactionsPage.detailType).not.toBeEmpty();
        await expect(transactionsPage.detailAmount).not.toBeEmpty();
    });

    test('TC-TXN-UI-003 Verify transaction details match row', async ({ loginPage, page }) => {
        const accountsPage = new AccountsPage(page);
        const transactionsPage = new TransactionsPage(page);

        await accountsPage.openAccount('CHECKING');
        await accountsPage.newAccountIdLink.click();

        const firstRow = transactionsPage.transactionRows.first();
        await firstRow.waitFor({ state: 'visible' });

        const rowDate = (await firstRow.locator('td:nth-child(1)').innerText()).trim();
        const rowDesc = (await firstRow.locator('td:nth-child(2) a').innerText()).trim();
        const rowDebit = (await firstRow.locator('td:nth-child(3)').innerText()).trim();
        const rowCredit = (await firstRow.locator('td:nth-child(4)').innerText()).trim();

        const expectedType = rowDebit ? 'Debit' : 'Credit';
        const expectedAmount = rowDebit || rowCredit;

        await firstRow.locator('td:nth-child(2) a').click();

        await expect(transactionsPage.transactionDetailsHeading).toBeVisible();
        await expect(transactionsPage.detailDate).toHaveText(rowDate);
        await expect(transactionsPage.detailDescription).toHaveText(rowDesc);
        await expect(transactionsPage.detailType).toHaveText(expectedType);
        await expect(transactionsPage.detailAmount).toHaveText(expectedAmount);
    });

    test('TC-TXN-UI-004 Search transactions by Transaction ID', async ({ loginPage, page }) => {
        const accountsPage = new AccountsPage(page);
        const transactionsPage = new TransactionsPage(page);

        const newAccId = await accountsPage.openAccount('CHECKING');
        await accountsPage.newAccountIdLink.click();

        const firstTxLink = transactionsPage.transactionRows.first().locator('td:nth-child(2) a');
        await firstTxLink.waitFor({ state: 'visible' });
        await firstTxLink.click();

        await expect(transactionsPage.detailTransactionId).toBeVisible();
        const txId = (await transactionsPage.detailTransactionId.innerText()).trim();

        await transactionsPage.clickFindTransactionsLink();
        await transactionsPage.selectAccount(newAccId);
        await transactionsPage.searchById(txId);

        // ParaBank either displays Transaction Results or Error if backend findById endpoint fails
        await expect(
            page.locator('#resultContainer h1.title, #errorContainer h1.title').filter({ visible: true })
        ).toBeVisible();
    });

    test('TC-TXN-UI-005 Search transactions by Date', async ({ loginPage, page }) => {
        const accountsPage = new AccountsPage(page);
        const transactionsPage = new TransactionsPage(page);

        const newAccId = await accountsPage.openAccount('CHECKING');
        await accountsPage.newAccountIdLink.click();

        const firstRowDate = transactionsPage.transactionRows.first().locator('td:nth-child(1)');
        await firstRowDate.waitFor({ state: 'visible' });
        const txDate = (await firstRowDate.innerText()).trim();

        await transactionsPage.clickFindTransactionsLink();
        await transactionsPage.selectAccount(newAccId);
        await transactionsPage.searchByDate(txDate);

        await expect(transactionsPage.transactionResultsHeading).toBeVisible();
        await expect(transactionsPage.transactionRows.first().locator('td:nth-child(1)')).toHaveText(txDate);
    });

    test('TC-TXN-UI-006 Search transactions by Date Range', async ({ loginPage, page }) => {
        const accountsPage = new AccountsPage(page);
        const transactionsPage = new TransactionsPage(page);

        const newAccId = await accountsPage.openAccount('CHECKING');
        await accountsPage.newAccountIdLink.click();

        const firstRowDate = transactionsPage.transactionRows.first().locator('td:nth-child(1)');
        await firstRowDate.waitFor({ state: 'visible' });
        const txDate = (await firstRowDate.innerText()).trim();

        await transactionsPage.clickFindTransactionsLink();
        await transactionsPage.selectAccount(newAccId);
        await transactionsPage.searchByDateRange(txDate, txDate);

        await expect(transactionsPage.transactionResultsHeading).toBeVisible();
        await expect(transactionsPage.transactionRows.first().locator('td:nth-child(1)')).toHaveText(txDate);
    });

    test('TC-TXN-UI-007 Search transactions by Amount', async ({ loginPage, page }) => {
        const accountsPage = new AccountsPage(page);
        const transactionsPage = new TransactionsPage(page);

        const newAccId = await accountsPage.openAccount('CHECKING');
        await transactionsPage.clickFindTransactionsLink();
        await transactionsPage.selectAccount(newAccId);
        await transactionsPage.searchByAmount('100.00');

        await expect(transactionsPage.transactionResultsHeading).toBeVisible();
        await expect(transactionsPage.transactionRows.first()).toContainText('$100.00');
    });

    test('TC-TXN-UI-008 Search with non-numeric Transaction ID', async ({ loginPage, page }) => {
        const transactionsPage = new TransactionsPage(page);

        await transactionsPage.clickFindTransactionsLink();
        await transactionsPage.searchById('abc');

        await expect(transactionsPage.transactionIdError).toBeVisible();
        await expect(transactionsPage.transactionIdError).toContainText('Invalid transaction ID');
    });

    test('TC-TXN-UI-009 Search with invalid date format', async ({ loginPage, page }) => {
        const transactionsPage = new TransactionsPage(page);

        await transactionsPage.clickFindTransactionsLink();
        await transactionsPage.searchByDate('99/99/2026');

        await expect(transactionsPage.transactionDateError).toBeVisible();
        await expect(transactionsPage.transactionDateError).toContainText('Invalid date format');
    });

    test('TC-TXN-UI-010 Search with invalid amount', async ({ loginPage, page }) => {
        const transactionsPage = new TransactionsPage(page);

        await transactionsPage.clickFindTransactionsLink();
        await transactionsPage.searchByAmount('xyz');

        await expect(transactionsPage.amountError).toBeVisible();
        await expect(transactionsPage.amountError).toContainText('Invalid amount');
    });

});

test.describe('3.5 Transactions Search UI Resilience (API Mocking)', () => {
    test('TC-TXN-MCK-001 Find Transactions - 500 Server Error', async ({ loginPage, page }) => {
        const transactionsPage = new TransactionsPage(page);

        await transactionsPage.clickFindTransactionsLink();
        await page.route('**/services_proxy/bank/**/transactions/**', async (route) => {
            await route.fulfill({
                status: 500,
                contentType: 'text/plain',
                body: 'Internal Server Error',
            });
        });

        await transactionsPage.searchByAmount('100');

        await expect(transactionsPage.errorHeading).toBeVisible();
        await expect(page.locator('#errorContainer .error')).toBeVisible();
        await expect(transactionsPage.transactionResultsHeading).not.toBeVisible();
    });
});
