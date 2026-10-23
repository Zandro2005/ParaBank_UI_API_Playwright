import { Locator, Page } from '@playwright/test';

export class TransactionsPage {
    readonly page: Page;
    readonly findTransactionsLink: Locator;

    // Account Activity Table (on activity.htm & findtrans.htm results)
    readonly transactionTable: Locator;
    readonly transactionRows: Locator;
    readonly dateColumnHeader: Locator;
    readonly transactionColumnHeader: Locator;
    readonly debitColumnHeader: Locator;
    readonly creditColumnHeader: Locator;

    // Transaction Details (on transaction.htm)
    readonly transactionDetailsHeading: Locator;
    readonly detailTransactionId: Locator;
    readonly detailDate: Locator;
    readonly detailDescription: Locator;
    readonly detailType: Locator;
    readonly detailAmount: Locator;

    // Find Transactions Form (on findtrans.htm)
    readonly accountSelect: Locator;
    readonly transactionIdInput: Locator;
    readonly findByIdBtn: Locator;
    readonly transactionIdError: Locator;

    readonly transactionDateInput: Locator;
    readonly findByDateBtn: Locator;
    readonly transactionDateError: Locator;

    readonly fromDateInput: Locator;
    readonly toDateInput: Locator;
    readonly findByDateRangeBtn: Locator;
    readonly dateRangeError: Locator;

    readonly amountInput: Locator;
    readonly findByAmountBtn: Locator;
    readonly amountError: Locator;

    readonly transactionResultsHeading: Locator;
    readonly errorHeading: Locator;

    constructor(page: Page) {
        this.page = page;
        this.findTransactionsLink = page.getByRole('link', { name: 'Find Transactions' });

        // Activity & Results table
        this.transactionTable = page.locator('#transactionTable');
        this.transactionRows = page.locator('#transactionTable tbody tr');
        this.dateColumnHeader = page.getByRole('columnheader', { name: 'Date' });
        this.transactionColumnHeader = page.getByRole('columnheader', { name: 'Transaction' });
        this.debitColumnHeader = page.getByRole('columnheader', { name: 'Debit (-)' });
        this.creditColumnHeader = page.getByRole('columnheader', { name: 'Credit (+)' });

        // Transaction Details page
        this.transactionDetailsHeading = page.getByRole('heading', { name: 'Transaction Details' });
        this.detailTransactionId = page.locator('#rightPanel table tr').filter({ hasText: 'Transaction ID:' }).locator('td:nth-child(2)');
        this.detailDate = page.locator('#rightPanel table tr').filter({ hasText: 'Date:' }).locator('td:nth-child(2)');
        this.detailDescription = page.locator('#rightPanel table tr').filter({ hasText: 'Description:' }).locator('td:nth-child(2)');
        this.detailType = page.locator('#rightPanel table tr').filter({ hasText: 'Type:' }).locator('td:nth-child(2)');
        this.detailAmount = page.locator('#rightPanel table tr').filter({ hasText: 'Amount:' }).locator('td:nth-child(2)');

        // Find Transactions form
        this.accountSelect = page.locator('#accountId');
        this.transactionIdInput = page.locator('#transactionId');
        this.findByIdBtn = page.locator('#findById');
        this.transactionIdError = page.locator('#transactionIdError');

        this.transactionDateInput = page.locator('#transactionDate');
        this.findByDateBtn = page.locator('#findByDate');
        this.transactionDateError = page.locator('#transactionDateError');

        this.fromDateInput = page.locator('#fromDate');
        this.toDateInput = page.locator('#toDate');
        this.findByDateRangeBtn = page.locator('#findByDateRange');
        this.dateRangeError = page.locator('#dateRangeError');

        this.amountInput = page.locator('#amount');
        this.findByAmountBtn = page.locator('#findByAmount');
        this.amountError = page.locator('#amountError');

        this.transactionResultsHeading = page.getByRole('heading', { name: 'Transaction Results' });
        this.errorHeading = page.getByRole('heading', { name: 'Error!' });
    }

    async clickFindTransactionsLink(): Promise<void> {
        await this.findTransactionsLink.click();
        await this.page.waitForURL('**/findtrans.htm');
        await this.accountSelect.locator('option').first().waitFor({ state: 'attached' });
    }

    async selectAccount(accountId: string): Promise<void> {
        await this.accountSelect.locator('option').first().waitFor({ state: 'attached' });
        await this.accountSelect.selectOption(accountId);
    }

    async searchById(id: string): Promise<void> {
        await this.transactionIdInput.fill(id);
        await this.findByIdBtn.click();
    }

    async searchByDate(date: string): Promise<void> {
        await this.transactionDateInput.fill(date);
        await this.findByDateBtn.click();
    }

    async searchByDateRange(fromDate: string, toDate: string): Promise<void> {
        await this.fromDateInput.fill(fromDate);
        await this.toDateInput.fill(toDate);
        await this.findByDateRangeBtn.click();
    }

    async searchByAmount(amount: string): Promise<void> {
        await this.amountInput.fill(amount);
        await this.findByAmountBtn.click();
    }
}

