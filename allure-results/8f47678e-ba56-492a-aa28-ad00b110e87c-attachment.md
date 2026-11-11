# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: ui\transfer.spec.ts >> Fund Transfer UI >> TC-TRF-UI-001 Valid transfer via UI
- Location: tests\ui\transfer.spec.ts:7:9

# Error details

```
Error: locator.count: Target page, context or browser has been closed
```

# Test source

```ts
  1   | import { test, expect } from '@fixtures/authFixture';
  2   | import { TransferPage } from '@pages/TransferPage';
  3   | import { AccountsPage } from '@pages/AccountsPage';
  4   | 
  5   | test.describe('Fund Transfer UI', () => {
  6   | 
  7   |     test('TC-TRF-UI-001 Valid transfer via UI', async ({ loginPage, page }) => {
  8   |         const accountsPage = new AccountsPage(page);
  9   |         const transferPage = new TransferPage(page);
  10  | 
  11  |         // Ensure at least 2 accounts exist
  12  |         await accountsPage.accountRows.first().waitFor({ state: 'visible' });
> 13  |         if ((await accountsPage.accountRows.count()) < 2) {
      |                                             ^ Error: locator.count: Target page, context or browser has been closed
  14  |             await accountsPage.openAccount('CHECKING');
  15  |         }
  16  | 
  17  |         await transferPage.clickTransferFundsLink();
  18  |         await transferPage.fillAmount('25.00');
  19  |         const fromAcc = await transferPage.selectFromAccount(0);
  20  |         const toAcc = await transferPage.selectToAccount(1);
  21  |         await transferPage.clickTransferBtn();
  22  | 
  23  |         await expect(transferPage.transferCompleteHeading).toBeVisible();
  24  |         await expect(transferPage.amountResult).toHaveText('$25.00');
  25  |         await expect(transferPage.fromAccountIdResult).toHaveText(fromAcc);
  26  |         await expect(transferPage.toAccountIdResult).toHaveText(toAcc);
  27  |     });
  28  | 
  29  |     test('TC-TRF-UI-002 From / To account dropdowns populated', async ({ loginPage, page }) => {
  30  |         const accountsPage = new AccountsPage(page);
  31  |         const transferPage = new TransferPage(page);
  32  | 
  33  |         // Read all active account numbers from Accounts Overview
  34  |         await accountsPage.accountRows.first().waitFor({ state: 'visible' });
  35  |         const overviewAccountLinks = accountsPage.accountRows.locator('td a');
  36  |         const expectedAccounts = (await overviewAccountLinks.allInnerTexts()).map(t => t.trim());
  37  | 
  38  |         await transferPage.clickTransferFundsLink();
  39  | 
  40  |         const fromOptions = (await transferPage.fromAccountSelect.locator('option').allInnerTexts()).map(t => t.trim());
  41  |         const toOptions = (await transferPage.toAccountSelect.locator('option').allInnerTexts()).map(t => t.trim());
  42  | 
  43  |         expect(fromOptions.sort()).toEqual(expectedAccounts.sort());
  44  |         expect(toOptions.sort()).toEqual(expectedAccounts.sort());
  45  |     });
  46  | 
  47  |     test('TC-TRF-UI-003 Transfer with empty amount', async ({ loginPage, page }) => {
  48  |         const transferPage = new TransferPage(page);
  49  | 
  50  |         await transferPage.clickTransferFundsLink();
  51  |         await transferPage.selectFromAccount(0);
  52  |         await transferPage.selectToAccount(0);
  53  |         await transferPage.clickTransferBtn();
  54  | 
  55  |         await expect(transferPage.errorHeading).toBeVisible();
  56  |         await expect(transferPage.transferCompleteHeading).not.toBeVisible();
  57  |     });
  58  | 
  59  |     test('TC-TRF-UI-004 Transfer with non-numeric amount', async ({ loginPage, page }) => {
  60  |         const transferPage = new TransferPage(page);
  61  | 
  62  |         await transferPage.clickTransferFundsLink();
  63  |         await transferPage.fillAmount('abc');
  64  |         await transferPage.clickTransferBtn();
  65  | 
  66  |         await expect(transferPage.errorHeading).toBeVisible();
  67  |         await expect(transferPage.transferCompleteHeading).not.toBeVisible();
  68  |     });
  69  | 
  70  |     test('TC-TRF-UI-005 Transfer with zero amount', { tag: '@known-defect' }, async ({ loginPage, page }) => {
  71  |         // ParaBank defect: AUT accepts $0.00 transfers instead of rejecting them with an error
  72  |         test.fail();
  73  |         const transferPage = new TransferPage(page);
  74  | 
  75  |         await transferPage.clickTransferFundsLink();
  76  |         await transferPage.fillAmount('0');
  77  |         await transferPage.clickTransferBtn();
  78  | 
  79  |         await expect(transferPage.errorHeading).toBeVisible();
  80  |     });
  81  | 
  82  |     test('TC-TRF-UI-006 Transfer with negative amount', { tag: '@known-defect' }, async ({ loginPage, page }) => {
  83  |         // ParaBank defect: AUT accepts negative transfers and reverses money flow instead of rejecting
  84  |         test.fail();
  85  |         const transferPage = new TransferPage(page);
  86  | 
  87  |         await transferPage.clickTransferFundsLink();
  88  |         await transferPage.fillAmount('-10');
  89  |         await transferPage.clickTransferBtn();
  90  | 
  91  |         await expect(transferPage.errorHeading).toBeVisible();
  92  |     });
  93  | 
  94  |     test('TC-TRF-UI-007 Transfer to the same account', { tag: '@known-defect' }, async ({ loginPage, page }) => {
  95  |         // ParaBank defect: AUT allows transferring funds from and to the exact same account
  96  |         test.fail();
  97  |         const transferPage = new TransferPage(page);
  98  | 
  99  |         await transferPage.clickTransferFundsLink();
  100 |         await transferPage.fillAmount('10');
  101 |         await transferPage.selectFromAccount(0);
  102 |         await transferPage.selectToAccount(0);
  103 |         await transferPage.clickTransferBtn();
  104 | 
  105 |         await expect(transferPage.errorHeading).toBeVisible();
  106 |     });
  107 | 
  108 | });
  109 | 
```