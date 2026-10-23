import { test, expect } from '@fixtures/authFixture';
import { TransferPage } from '@pages/TransferPage';
import { AccountsPage } from '@pages/AccountsPage';

test.describe('Fund Transfer UI', () => {

    test('TC-TRF-UI-001 Valid transfer via UI', async ({ loginPage, page }) => {
        const accountsPage = new AccountsPage(page);
        const transferPage = new TransferPage(page);

        // Ensure at least 2 accounts exist
        await accountsPage.accountRows.first().waitFor({ state: 'visible' });
        if ((await accountsPage.accountRows.count()) < 2) {
            await accountsPage.openAccount('CHECKING');
        }

        await transferPage.clickTransferFundsLink();
        await transferPage.fillAmount('25.00');
        const fromAcc = await transferPage.selectFromAccount(0);
        const toAcc = await transferPage.selectToAccount(1);
        await transferPage.clickTransferBtn();

        await expect(transferPage.transferCompleteHeading).toBeVisible();
        await expect(transferPage.amountResult).toHaveText('$25.00');
        await expect(transferPage.fromAccountIdResult).toHaveText(fromAcc);
        await expect(transferPage.toAccountIdResult).toHaveText(toAcc);
    });

    test('TC-TRF-UI-002 From / To account dropdowns populated', async ({ loginPage, page }) => {
        const accountsPage = new AccountsPage(page);
        const transferPage = new TransferPage(page);

        // Read all active account numbers from Accounts Overview
        await accountsPage.accountRows.first().waitFor({ state: 'visible' });
        const overviewAccountLinks = accountsPage.accountRows.locator('td a');
        const expectedAccounts = (await overviewAccountLinks.allInnerTexts()).map(t => t.trim());

        await transferPage.clickTransferFundsLink();

        const fromOptions = (await transferPage.fromAccountSelect.locator('option').allInnerTexts()).map(t => t.trim());
        const toOptions = (await transferPage.toAccountSelect.locator('option').allInnerTexts()).map(t => t.trim());

        expect(fromOptions.sort()).toEqual(expectedAccounts.sort());
        expect(toOptions.sort()).toEqual(expectedAccounts.sort());
    });

    test('TC-TRF-UI-003 Transfer with empty amount', async ({ loginPage, page }) => {
        const transferPage = new TransferPage(page);

        await transferPage.clickTransferFundsLink();
        await transferPage.selectFromAccount(0);
        await transferPage.selectToAccount(0);
        await transferPage.clickTransferBtn();

        await expect(transferPage.errorHeading).toBeVisible();
        await expect(transferPage.transferCompleteHeading).not.toBeVisible();
    });

    test('TC-TRF-UI-004 Transfer with non-numeric amount', async ({ loginPage, page }) => {
        const transferPage = new TransferPage(page);

        await transferPage.clickTransferFundsLink();
        await transferPage.fillAmount('abc');
        await transferPage.clickTransferBtn();

        await expect(transferPage.errorHeading).toBeVisible();
        await expect(transferPage.transferCompleteHeading).not.toBeVisible();
    });

    test('TC-TRF-UI-005 Transfer with zero amount', { tag: '@known-defect' }, async ({ loginPage, page }) => {
        // ParaBank defect: AUT accepts $0.00 transfers instead of rejecting them with an error
        test.fail();
        const transferPage = new TransferPage(page);

        await transferPage.clickTransferFundsLink();
        await transferPage.fillAmount('0');
        await transferPage.clickTransferBtn();

        await expect(transferPage.errorHeading).toBeVisible();
    });

    test('TC-TRF-UI-006 Transfer with negative amount', { tag: '@known-defect' }, async ({ loginPage, page }) => {
        // ParaBank defect: AUT accepts negative transfers and reverses money flow instead of rejecting
        test.fail();
        const transferPage = new TransferPage(page);

        await transferPage.clickTransferFundsLink();
        await transferPage.fillAmount('-10');
        await transferPage.clickTransferBtn();

        await expect(transferPage.errorHeading).toBeVisible();
    });

    test('TC-TRF-UI-007 Transfer to the same account', { tag: '@known-defect' }, async ({ loginPage, page }) => {
        // ParaBank defect: AUT allows transferring funds from and to the exact same account
        test.fail();
        const transferPage = new TransferPage(page);

        await transferPage.clickTransferFundsLink();
        await transferPage.fillAmount('10');
        await transferPage.selectFromAccount(0);
        await transferPage.selectToAccount(0);
        await transferPage.clickTransferBtn();

        await expect(transferPage.errorHeading).toBeVisible();
    });

});
