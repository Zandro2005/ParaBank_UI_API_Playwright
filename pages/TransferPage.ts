import { Locator, Page } from '@playwright/test';

export class TransferPage {
    readonly page: Page;
    readonly transferFundsLink: Locator;
    readonly amountInput: Locator;
    readonly fromAccountSelect: Locator;
    readonly toAccountSelect: Locator;
    readonly transferBtn: Locator;
    readonly transferCompleteHeading: Locator;
    readonly amountResult: Locator;
    readonly fromAccountIdResult: Locator;
    readonly toAccountIdResult: Locator;
    readonly errorHeading: Locator;
    readonly errorMessages: Locator;

    constructor(page: Page) {
        this.page = page;
        this.transferFundsLink = page.getByRole('link', { name: 'Transfer Funds' });
        this.amountInput = page.locator('#amount');
        this.fromAccountSelect = page.locator('#fromAccountId');
        this.toAccountSelect = page.locator('#toAccountId');
        this.transferBtn = page.getByRole('button', { name: 'Transfer' });
        this.transferCompleteHeading = page.getByRole('heading', { name: 'Transfer Complete!' });
        this.amountResult = page.locator('#amountResult');
        this.fromAccountIdResult = page.locator('#fromAccountIdResult');
        this.toAccountIdResult = page.locator('#toAccountIdResult');
        this.errorHeading = page.getByRole('heading', { name: 'Error!' });
        this.errorMessages = page.locator('#showError .error, #rightPanel .error');
    }

    async clickTransferFundsLink(): Promise<void> {
        await this.transferFundsLink.click();
        await this.page.waitForURL('**/transfer.htm');
        await this.fromAccountSelect.locator('option').first().waitFor({ state: 'attached' });
        await this.toAccountSelect.locator('option').first().waitFor({ state: 'attached' });
    }

    async fillAmount(amount: string): Promise<void> {
        await this.amountInput.fill(amount);
    }

    async selectFromAccount(index: number = 0): Promise<string> {
        await this.fromAccountSelect.locator('option').first().waitFor({ state: 'attached' });
        const value = await this.fromAccountSelect.locator('option').nth(index).innerText();
        await this.fromAccountSelect.selectOption({ index });
        return value.trim();
    }

    async selectToAccount(index: number = 0): Promise<string> {
        await this.toAccountSelect.locator('option').first().waitFor({ state: 'attached' });
        const value = await this.toAccountSelect.locator('option').nth(index).innerText();
        await this.toAccountSelect.selectOption({ index });
        return value.trim();
    }

    private async selectAccountOptionById(selectLocator: Locator, accountId: number | string): Promise<void> {
        const idStr = String(accountId);
        await selectLocator.locator(`option[value="${idStr}"]`).waitFor({ state: 'attached' });
        await selectLocator.selectOption(idStr);
    }

    async selectFromAccountById(accountId: number | string): Promise<void> {
        await this.selectAccountOptionById(this.fromAccountSelect, accountId);
    }

    async selectToAccountById(accountId: number | string): Promise<void> {
        await this.selectAccountOptionById(this.toAccountSelect, accountId);
    }

    async transferFunds(
        amount: string,
        fromAccountId: number | string,
        toAccountId: number | string
    ): Promise<void> {
        await this.fillAmount(amount);
        await this.selectFromAccountById(fromAccountId);
        await this.selectToAccountById(toAccountId);
        await this.clickTransferBtn();
    }

    async clickTransferBtn(): Promise<void> {
        await this.transferBtn.click();
    }

    getErrorMessage(message?: string): Locator {
        return message
            ? this.errorMessages.filter({ hasText: message })
            : this.errorMessages;
    }
}
