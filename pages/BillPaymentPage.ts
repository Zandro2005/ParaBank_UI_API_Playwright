import { Locator, Page } from '@playwright/test';

export type BillPayData = {
    payeeName: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    phone: string;
    account: string;
    verifyAccount: string;
    amount: string;
};

export class BillPaymentPage {
    readonly page: Page;
    readonly billPayLink: Locator;
    readonly payeeNameInput: Locator;
    readonly addressInput: Locator;
    readonly cityInput: Locator;
    readonly stateInput: Locator;
    readonly zipCodeInput: Locator;
    readonly phoneInput: Locator;
    readonly accountInput: Locator;
    readonly verifyAccountInput: Locator;
    readonly amountInput: Locator;
    readonly fromAccountSelect: Locator;
    readonly sendPaymentBtn: Locator;
    readonly billPayCompleteHeading: Locator;
    readonly payeeNameResult: Locator;
    readonly amountResult: Locator;
    readonly fromAccountIdResult: Locator;
    readonly errorHeading: Locator;
    readonly errorMessages: Locator;

    constructor(page: Page) {
        this.page = page;
        this.billPayLink = page.getByRole('link', { name: 'Bill Pay' });
        this.payeeNameInput = page.locator('input[name="payee.name"]');
        this.addressInput = page.locator('input[name="payee.address.street"]');
        this.cityInput = page.locator('input[name="payee.address.city"]');
        this.stateInput = page.locator('input[name="payee.address.state"]');
        this.zipCodeInput = page.locator('input[name="payee.address.zipCode"]');
        this.phoneInput = page.locator('input[name="payee.phoneNumber"]');
        this.accountInput = page.locator('input[name="payee.accountNumber"]');
        this.verifyAccountInput = page.locator('input[name="verifyAccount"]');
        this.amountInput = page.locator('input[name="amount"]');
        this.fromAccountSelect = page.locator('select[name="fromAccountId"]');
        this.sendPaymentBtn = page.getByRole('button', { name: 'Send Payment' });
        this.billPayCompleteHeading = page.getByRole('heading', { name: 'Bill Payment Complete' });
        this.payeeNameResult = page.locator('#payeeName');
        this.amountResult = page.locator('#amount');
        this.fromAccountIdResult = page.locator('#fromAccountId');
        this.errorHeading = page.getByRole('heading', { name: 'Error!' });
        this.errorMessages = page.locator('#billpayForm .error, #rightPanel .error');
    }

    async clickBillPayLink(): Promise<void> {
        await this.billPayLink.click();
        await this.page.waitForURL('**/billpay.htm');
        await this.fromAccountSelect.locator('option').first().waitFor({ state: 'attached' });
    }

    async fillBillPayForm(data: BillPayData): Promise<void> {
        await this.payeeNameInput.fill(data.payeeName);
        await this.addressInput.fill(data.address);
        await this.cityInput.fill(data.city);
        await this.stateInput.fill(data.state);
        await this.zipCodeInput.fill(data.zipCode);
        await this.phoneInput.fill(data.phone);
        await this.accountInput.fill(data.account);
        await this.verifyAccountInput.fill(data.verifyAccount);
        await this.amountInput.fill(data.amount);
    }

    async selectFromAccount(index: number = 0): Promise<string> {
        await this.fromAccountSelect.locator('option').first().waitFor({ state: 'attached' });
        const value = await this.fromAccountSelect.locator('option').nth(index).innerText();
        await this.fromAccountSelect.selectOption({ index });
        return value.trim();
    }

    async clickSendPaymentBtn(): Promise<void> {
        await this.sendPaymentBtn.click();
    }

    getErrorMessage(message?: string): Locator {
        return message
            ? this.errorMessages.filter({ hasText: message })
            : this.errorMessages;
    }
}
