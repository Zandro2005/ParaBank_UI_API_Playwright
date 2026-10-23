import { test, expect } from '@fixtures/authFixture';
import { BillPaymentPage } from '@pages/BillPaymentPage';
import { AccountsPage } from '@pages/AccountsPage';

test.describe('Bill Payment UI', () => {

    const validBillData = {
        payeeName: 'Electric Utility Co',
        address: '456 Power Ave',
        city: 'Los Angeles',
        state: 'CA',
        zipCode: '90001',
        phone: '555-888-9999',
        account: '98765',
        verifyAccount: '98765',
        amount: '30.00'
    };

    test('TC-BILL-UI-001 Valid bill payment submission', async ({ loginPage, page }) => {
        const billPayPage = new BillPaymentPage(page);

        await billPayPage.clickBillPayLink();
        await billPayPage.fillBillPayForm(validBillData);
        const fromAcc = await billPayPage.selectFromAccount(0);
        await billPayPage.clickSendPaymentBtn();

        await expect(billPayPage.billPayCompleteHeading).toBeVisible();
        await expect(billPayPage.payeeNameResult).toHaveText(validBillData.payeeName);
        await expect(billPayPage.amountResult).toHaveText('$30.00');
        await expect(billPayPage.fromAccountIdResult).toHaveText(fromAcc);
    });

    test('TC-BILL-UI-002 Submit completely empty bill pay form', async ({ loginPage, page }) => {
        const billPayPage = new BillPaymentPage(page);

        await billPayPage.clickBillPayLink();
        await billPayPage.clickSendPaymentBtn();

        await expect(billPayPage.getErrorMessage('Payee name is required.')).toBeVisible();
        await expect(billPayPage.getErrorMessage('Address is required.')).toBeVisible();
        await expect(billPayPage.getErrorMessage('City is required.')).toBeVisible();
        await expect(billPayPage.getErrorMessage('State is required.')).toBeVisible();
        await expect(billPayPage.getErrorMessage('Zip Code is required.')).toBeVisible();
        await expect(billPayPage.getErrorMessage('Phone number is required.')).toBeVisible();
        await expect(billPayPage.getErrorMessage('Account number is required.').first()).toBeVisible();
        await expect(billPayPage.getErrorMessage('The amount cannot be empty.')).toBeVisible();
    });

    test('TC-BILL-UI-003 Account and Verify Account mismatch', async ({ loginPage, page }) => {
        const billPayPage = new BillPaymentPage(page);

        await billPayPage.clickBillPayLink();
        await billPayPage.fillBillPayForm({
            ...validBillData,
            account: '11111',
            verifyAccount: '22222'
        });
        await billPayPage.clickSendPaymentBtn();

        await expect(billPayPage.getErrorMessage('The account numbers do not match.')).toBeVisible();
    });

    test('TC-BILL-UI-004 Non-numeric account number', async ({ loginPage, page }) => {
        const billPayPage = new BillPaymentPage(page);

        await billPayPage.clickBillPayLink();
        await billPayPage.fillBillPayForm({
            ...validBillData,
            account: 'XYZ',
            verifyAccount: 'XYZ'
        });
        await billPayPage.clickSendPaymentBtn();

        await expect(billPayPage.getErrorMessage('Please enter a valid number.').first()).toBeVisible();
    });

    test('TC-BILL-UI-005 Non-numeric amount', async ({ loginPage, page }) => {
        const billPayPage = new BillPaymentPage(page);

        await billPayPage.clickBillPayLink();
        await billPayPage.fillBillPayForm({
            ...validBillData,
            amount: 'test'
        });
        await billPayPage.clickSendPaymentBtn();

        await expect(billPayPage.getErrorMessage('Please enter a valid amount.')).toBeVisible();
    });

    test('TC-BILL-UI-006 From account dropdown verification', async ({ loginPage, page }) => {
        const accountsPage = new AccountsPage(page);
        const billPayPage = new BillPaymentPage(page);

        await accountsPage.accountRows.first().waitFor({ state: 'visible' });
        const expectedAccounts = (await accountsPage.accountRows.locator('td a').allInnerTexts()).map(t => t.trim());

        await billPayPage.clickBillPayLink();
        const dropdownAccounts = (await billPayPage.fromAccountSelect.locator('option').allInnerTexts()).map(t => t.trim());

        expect(dropdownAccounts.sort()).toEqual(expectedAccounts.sort());
    });

    test('TC-BILL-UI-007 XSS prevention in payee input', async ({ loginPage, page }) => {
        const billPayPage = new BillPaymentPage(page);
        const xssPayload = "<script>alert('xss')</script>";

        let dialogTriggered = false;
        page.on('dialog', async dialog => {
            dialogTriggered = true;
            await dialog.dismiss();
        });

        await billPayPage.clickBillPayLink();
        await billPayPage.fillBillPayForm({
            ...validBillData,
            payeeName: xssPayload
        });
        await billPayPage.clickSendPaymentBtn();

        // Wait for response state (either escaped confirmation or server-side rejection)
        await expect(
            page.locator('#billpayResult h1.title, #billpayError h1.title').filter({ visible: true })
        ).toBeVisible();
        expect(dialogTriggered).toBe(false);
    });

});
