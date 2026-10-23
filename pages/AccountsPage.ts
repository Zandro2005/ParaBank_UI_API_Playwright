import { Locator, Page } from '@playwright/test';

export class AccountsPage {
    readonly page: Page;
    readonly overviewTable: Locator;
    readonly accountRows: Locator;
    readonly balanceCells: Locator;
    readonly totalRow: Locator;
    readonly totalBalanceCell: Locator;
    readonly accountColumnHeader: Locator;
    readonly balanceColumnHeader: Locator;
    readonly availableAmountColumnHeader: Locator;

    // Open New Account elements
    readonly openNewAccountLink: Locator;
    readonly openNewAccountSubmitBtn: Locator;
    readonly accountType: Locator;
    readonly accountId: Locator;
    readonly accountHeading: Locator;
    readonly newAccountIdLink: Locator;

    // Account Details elements
    readonly accountDetailsHeading: Locator;
    readonly detailsAccountId: Locator;
    readonly detailsAccountType: Locator;
    readonly detailsBalance: Locator;
    readonly detailsAvailableBalance: Locator;
    readonly activityPeriodSelect: Locator;
    readonly transactionTypeSelect: Locator;
    readonly activityFilterSubmitBtn: Locator;
    readonly transactionTable: Locator;

    // Request Loan elements
    readonly requestLoanLink: Locator;
    readonly loanAmountInput: Locator;
    readonly loanDownPaymentInput: Locator;
    readonly loanFromAccountIdSelect: Locator;
    readonly applyLoanBtn: Locator;
    readonly loanHeading: Locator;
    readonly loanStatus: Locator;
    readonly loanNewAccountIdLink: Locator;

    constructor(page: Page) {
        this.page = page;
        this.overviewTable = page.locator('#accountTable');
        this.accountRows = page.locator('#accountTable tbody tr').filter({ has: page.locator('td a') });
        this.balanceCells = this.accountRows.locator('td:nth-child(2)');
        this.totalRow = page.locator('#accountTable tbody tr').filter({ hasText: 'Total' });
        this.totalBalanceCell = this.totalRow.locator('td:nth-child(2)');
        this.accountColumnHeader = page.getByRole('columnheader', { name: 'Account' });
        this.balanceColumnHeader = page.getByRole('columnheader', { name: 'Balance' });
        this.availableAmountColumnHeader = page.getByRole('columnheader', { name: 'Available Amount' });

        // Navigation link in left sidebar menu
        this.openNewAccountLink = page.getByRole('link', { name: 'Open New Account' });
        // Form submit button on openaccount.htm
        this.openNewAccountSubmitBtn = page.getByRole('button', { name: 'Open New Account' });
        this.accountType = page.locator('#type');
        this.accountId = page.locator('#fromAccountId');
        this.accountHeading = page.getByRole('heading', { name: 'Account Opened!' });
        this.newAccountIdLink = page.locator('#newAccountId');

        // Account Details locators
        this.accountDetailsHeading = page.getByRole('heading', { name: 'Account Details' });
        this.detailsAccountId = page.locator('#accountId');
        this.detailsAccountType = page.locator('#accountType');
        this.detailsBalance = page.locator('#balance');
        this.detailsAvailableBalance = page.locator('#availableBalance');
        this.activityPeriodSelect = page.locator('#month');
        this.transactionTypeSelect = page.locator('#transactionType');
        this.activityFilterSubmitBtn = page.locator('input[value="Go"], button:has-text("Go")');
        this.transactionTable = page.locator('#transactionTable');

        // Request Loan locators
        this.requestLoanLink = page.getByRole('link', { name: 'Request Loan' });
        this.loanAmountInput = page.locator('#amount');
        this.loanDownPaymentInput = page.locator('#downPayment');
        this.loanFromAccountIdSelect = page.locator('#fromAccountId');
        this.applyLoanBtn = page.locator('input[value="Apply Now"], button:has-text("Apply Now")');
        this.loanHeading = page.getByRole('heading', { name: 'Loan Request Processed' });
        this.loanStatus = page.locator('#loanStatus');
        this.loanNewAccountIdLink = page.locator('#newAccountId');
    }

    async navigate(): Promise<void> {
        await this.page.goto('overview.htm');
        await this.overviewTable.waitFor({ state: 'visible' });
    }

    async getAccountBalances(): Promise<number[]> {
        await this.accountRows.first().waitFor({ state: 'visible' });
        const texts = await this.balanceCells.allInnerTexts();
        return texts.map(text => this.parseCurrency(text));
    }

    async getTotalBalance(): Promise<number> {
        await this.totalBalanceCell.waitFor({ state: 'visible' });
        const text = await this.totalBalanceCell.innerText();
        return this.parseCurrency(text);
    }

    parseCurrency(value: string): number {
        return parseFloat(value.replace(/[^0-9.-]+/g, ''));
    }

    async clickOpenNewAccountLink(): Promise<void> {
        await this.openNewAccountLink.click();
        await this.page.waitForURL('**/openaccount.htm');
        await this.accountId.waitFor({ state: 'visible' });
    }

    async selectAccountType(type: 'CHECKING' | 'SAVINGS' = 'CHECKING'): Promise<void> {
        await this.accountType.selectOption(type);
    }

    async selectAccountId(index: number = 0): Promise<void> {
        // Wait for accounts to finish loading in dropdown, then select by index
        await this.accountId.locator('option').first().waitFor({ state: 'attached' });
        await this.accountId.selectOption({ index });
    }

    async clickOpenNewAccountBtn(): Promise<void> {
        await this.openNewAccountSubmitBtn.click();
    }

    async openAccount(type: 'CHECKING' | 'SAVINGS' = 'CHECKING'): Promise<string> {
        await this.clickOpenNewAccountLink();
        await this.selectAccountType(type);
        await this.selectAccountId(0);
        await this.clickOpenNewAccountBtn();
        await this.accountHeading.waitFor({ state: 'visible' });
        await this.newAccountIdLink.waitFor({ state: 'visible' });
        return (await this.newAccountIdLink.innerText()).trim();
    }

    async clickRequestLoanLink(): Promise<void> {
        await this.requestLoanLink.click();
        await this.page.waitForURL('**/requestloan.htm');
        await this.loanAmountInput.waitFor({ state: 'visible' });
    }

    async applyForLoan(amount: string, downPayment: string): Promise<void> {
        await this.loanAmountInput.fill(amount);
        await this.loanDownPaymentInput.fill(downPayment);
        await this.loanFromAccountIdSelect.locator('option').first().waitFor({ state: 'attached' });
        await this.applyLoanBtn.click();
    }
}
