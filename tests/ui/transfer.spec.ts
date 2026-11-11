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

test.describe('3.5 Fund Transfer UI Resilience (API Mocking)', () => {
    async function submitMockedTransfer(
        page: import('@playwright/test').Page,
        routeHandler: (route: import('@playwright/test').Route) => Promise<void>
    ) {
        const pageErrors: Error[] = [];
        page.on('pageerror', (err) => pageErrors.push(err));

        const transferPage = new TransferPage(page);
        await transferPage.clickTransferFundsLink();
        await page.route('**/services_proxy/bank/transfer*', routeHandler);

        await transferPage.fillAmount('25.00');
        await transferPage.selectFromAccount(0);
        await transferPage.selectToAccount(0);
        await transferPage.clickTransferBtn();

        return { transferPage, pageErrors };
    }

    test('TC-TRF-MCK-001 Transfer - Mocked 200 Success', async ({ loginPage, page }) => {
        const { transferPage } = await submitMockedTransfer(page, async (route) => {
            await route.fulfill({
                status: 200,
                contentType: 'text/plain',
                body: 'Successfully transferred $25.00 from account #13344 to account #13344',
            });
        });

        await expect(transferPage.transferCompleteHeading).toBeVisible();
        await expect(transferPage.amountResult).toHaveText('$25.00');
    });

    const httpErrorMockCases = [
        { name: 'TC-TRF-MCK-002 Transfer - 400 Bad Request', status: 400, body: 'Bad Request' },
        { name: 'TC-TRF-MCK-003 Transfer - 401 Unauthorized', status: 401, body: 'Unauthorized' },
        { name: 'TC-TRF-MCK-004 Transfer - 403 Forbidden', status: 403, body: 'Forbidden' },
        { name: 'TC-TRF-MCK-005 Transfer - 404 Endpoint Not Found', status: 404, body: 'Not Found' },
        { name: 'TC-TRF-MCK-006 Transfer - 500 Internal Server Error', status: 500, body: 'Internal Server Error' },
    ];

    for (const scenario of httpErrorMockCases) {
        test(scenario.name, async ({ loginPage, page }) => {
            const { transferPage, pageErrors } = await submitMockedTransfer(page, async (route) => {
                await route.fulfill({
                    status: scenario.status,
                    contentType: 'application/json',
                    body: JSON.stringify({ message: scenario.body }),
                });
            });

            await expect(transferPage.errorHeading).toBeVisible();
            await expect(page.locator('#showError p.error')).toContainText(
                'An internal error has occurred'
            );
            await expect(transferPage.transferCompleteHeading).not.toBeVisible();
            expect(pageErrors).toHaveLength(0);
        });
    }

    test('TC-TRF-MCK-007 Transfer - Network Timeout', async ({ loginPage, page }) => {
        const { transferPage, pageErrors } = await submitMockedTransfer(page, async (route) => {
            await route.abort('timedout');
        });

        await expect(transferPage.errorHeading).toBeVisible();
        await expect(transferPage.transferCompleteHeading).not.toBeVisible();
        await expect(transferPage.transferFundsLink).toBeVisible();
        expect(pageErrors).toHaveLength(0);
    });

    test('TC-TRF-MCK-008 Transfer - Empty Response Body', async ({ loginPage, page }) => {
        const { pageErrors } = await submitMockedTransfer(page, async (route) => {
            await route.fulfill({
                status: 200,
                contentType: 'text/plain',
                body: '',
            });
        });

        await expect(
            page.locator('#showResult h1.title, #showError h1.title').filter({ visible: true })
        ).toBeVisible();
        await expect(page.locator('#rightPanel')).not.toContainText(/undefined|NaN/);
        expect(pageErrors).toHaveLength(0);
    });

    test('TC-TRF-MCK-009 Transfer - Malformed JSON Response', async ({ loginPage, page }) => {
        const { pageErrors } = await submitMockedTransfer(page, async (route) => {
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: '{"error":',
            });
        });

        await expect(
            page.locator('#showResult h1.title, #showError h1.title').filter({ visible: true })
        ).toBeVisible();
        expect(pageErrors).toHaveLength(0);
    });
});
