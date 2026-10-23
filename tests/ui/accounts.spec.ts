import { test, expect } from '@fixtures/authFixture';
import { AccountsPage } from '@pages/AccountsPage';

test.describe('Accounts Overview UI', () => {

    test('TC-ACC-UI-001 View Accounts Overview table', async ({ loginPage, page }) => {
        const accountsPage = new AccountsPage(page);

        await expect(accountsPage.accountColumnHeader).toBeVisible();
        await expect(accountsPage.balanceColumnHeader).toBeVisible();
        await expect(accountsPage.availableAmountColumnHeader).toBeVisible();
        await expect(accountsPage.totalRow).toBeVisible();
    });

    test('TC-ACC-UI-002 Verify Total equals sum of balances', async ({ loginPage, page }) => {
        const accountsPage = new AccountsPage(page);

        // 1) Parse all balance column values
        const balances = await accountsPage.getAccountBalances();
        expect(balances.length).toBeGreaterThanOrEqual(1);

        // 2) Sum mathematically
        const calculatedSum = balances.reduce((sum, val) => sum + val, 0);

        // 3) Read Total row
        const reportedTotal = await accountsPage.getTotalBalance();

        // Total matches sum of all individual balances within $0.01
        expect(reportedTotal).toBeCloseTo(calculatedSum, 2);
    });

    test('TC-ACC-UI-003 Balance currency formatting', async ({ loginPage, page }) => {
        const accountsPage = new AccountsPage(page);
        const currencyRegex = /^-?\$[\d,]+\.\d{2}$/;

        // 1) Wait for accounts table to finish loading
        await accountsPage.accountRows.first().waitFor({ state: 'visible' });

        // 2) Inspect all individual balance values in the table
        const balances = await accountsPage.balanceCells.allInnerTexts();
        expect(balances.length).toBeGreaterThanOrEqual(1);

        for (const balance of balances) {
            expect(balance.trim()).toMatch(currencyRegex);
        }

        // 3) Inspect Total balance row format
        const totalBalance = await accountsPage.totalBalanceCell.innerText();
        expect(totalBalance.trim()).toMatch(currencyRegex);
    });

    test('TC-ACC-UI-004 Open new CHECKING account', async ({ loginPage, page }) => {
        const accountPage = new AccountsPage(page);

        await accountPage.clickOpenNewAccountLink();
        await accountPage.selectAccountType('CHECKING');
        await accountPage.selectAccountId(0);
        await accountPage.clickOpenNewAccountBtn();

        await expect(accountPage.accountHeading).toBeVisible();
        await expect(accountPage.newAccountIdLink).toBeVisible();
    });

    test('TC-ACC-UI-005 Open new SAVINGS account', async ({ loginPage, page }) => {
        const accountPage = new AccountsPage(page);

        await accountPage.clickOpenNewAccountLink();
        await accountPage.selectAccountType('SAVINGS');
        await accountPage.selectAccountId(0);
        await accountPage.clickOpenNewAccountBtn();

        await expect(accountPage.accountHeading).toBeVisible();
        await expect(accountPage.newAccountIdLink).toBeVisible();
    });

    test('TC-ACC-UI-006 Account type dropdown options', async ({ loginPage, page }) => {
        const accountPage = new AccountsPage(page);

        await accountPage.clickOpenNewAccountLink();
        const options = await accountPage.accountType.locator('option').allInnerTexts();

        expect(options).toContain('CHECKING');
        expect(options).toContain('SAVINGS');
    });

    test('TC-ACC-UI-007 Verify account details page', async ({ loginPage, page }) => {
        const accountPage = new AccountsPage(page);

        const newAccountId = await accountPage.openAccount('SAVINGS');
        await accountPage.newAccountIdLink.click();

        await expect(accountPage.accountDetailsHeading).toBeVisible();
        await expect(accountPage.detailsAccountId).toHaveText(newAccountId);
        await expect(accountPage.detailsAccountType).toHaveText('SAVINGS');
        await expect(accountPage.detailsBalance).not.toBeEmpty();
    });

    test('TC-ACC-UI-008 New account reflected in overview', async ({ loginPage, page }) => {
        const accountPage = new AccountsPage(page);

        const newAccountId = await accountPage.openAccount('CHECKING');
        await accountPage.navigate();

        const accountLink = accountPage.overviewTable.getByRole('link', { name: newAccountId });
        await expect(accountLink).toBeVisible();
    });

    test('TC-ACC-UI-009 Navigation between multiple accounts', async ({ loginPage, page }) => {
        const accountPage = new AccountsPage(page);

        // Ensure at least 2 accounts exist
        await accountPage.accountRows.first().waitFor({ state: 'visible' });
        const rowCount = await accountPage.accountRows.count();
        if (rowCount < 2) {
            await accountPage.openAccount('CHECKING');
            await accountPage.navigate();
            await accountPage.accountRows.first().waitFor({ state: 'visible' });
        }

        const firstLink = accountPage.accountRows.nth(0).locator('td a');
        const secondLink = accountPage.accountRows.nth(1).locator('td a');

        const firstAccId = (await firstLink.innerText()).trim();
        const secondAccId = (await secondLink.innerText()).trim();

        // 1) Click Account #1 link -> check details
        await firstLink.click();
        await expect(accountPage.detailsAccountId).toHaveText(firstAccId);

        // 2) Back to overview
        await accountPage.navigate();

        // 3) Click Account #2 link -> check details
        await accountPage.accountRows.nth(1).locator('td a').click();
        await expect(accountPage.detailsAccountId).toHaveText(secondAccId);
    });

    test('TC-ACC-UI-010 Account activity period filter', async ({ loginPage, page }) => {
        const accountPage = new AccountsPage(page);

        // Open an account so the source account (index 0) is guaranteed to have a Debit transaction
        await accountPage.openAccount('CHECKING');
        await accountPage.navigate();

        await accountPage.accountRows.first().waitFor({ state: 'visible' });
        await accountPage.accountRows.first().locator('td a').click();
        await expect(accountPage.accountDetailsHeading).toBeVisible();

        await accountPage.activityPeriodSelect.selectOption('All');
        await accountPage.transactionTypeSelect.selectOption('Debit');
        await accountPage.activityFilterSubmitBtn.click();

        await expect(accountPage.transactionTable).toBeVisible();
        const debitCells = accountPage.transactionTable.locator('tbody tr td:nth-child(3)');
        const creditCells = accountPage.transactionTable.locator('tbody tr td:nth-child(4)');

        await expect(debitCells.first()).toContainText('$');
        await expect(creditCells.filter({ hasText: '$' })).toHaveCount(0);
    });

    test('TC-LOAN-UI-001 Request loan – approved', async ({ loginPage, page }) => {
        const accountPage = new AccountsPage(page);

        await accountPage.clickRequestLoanLink();
        await accountPage.applyForLoan('500', '50');

        await expect(accountPage.loanHeading).toBeVisible();
        await expect(accountPage.loanStatus).toHaveText('Approved');
        await expect(accountPage.loanNewAccountIdLink).toBeVisible();
    });

    test('TC-LOAN-UI-002 Request loan – denied', async ({ loginPage, page }) => {
        const accountPage = new AccountsPage(page);

        await accountPage.clickRequestLoanLink();
        await accountPage.applyForLoan('500000', '10');

        await expect(accountPage.loanHeading).toBeVisible();
        await expect(accountPage.loanStatus).toHaveText('Denied');
    });

});
