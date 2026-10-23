# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: ui\accounts.spec.ts >> Accounts Overview UI >> TC-ACC-UI-004 Open new CHECKING account
- Location: tests\ui\accounts.spec.ts:52:9

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByRole('heading', { name: 'Account Opened!' })
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" getByRole('heading', { name: 'Account Opened!' }) with timeout 5000ms
  - waiting for getByRole('heading', { name: 'Account Opened!' })

```

```yaml
- link:
  - /url: admin.htm
  - img
- link "ParaBank":
  - /url: index.htm
  - img "ParaBank"
- paragraph: Experience the difference
- list:
  - listitem: Solutions
  - listitem:
    - link "About Us":
      - /url: about.htm
  - listitem:
    - link "Services":
      - /url: services.htm
  - listitem:
    - link "Products":
      - /url: http://www.parasoft.com/jsp/products.jsp
  - listitem:
    - link "Locations":
      - /url: http://www.parasoft.com/jsp/pr/contacts.jsp
  - listitem:
    - link "Admin Page":
      - /url: admin.htm
- list:
  - listitem:
    - link "home":
      - /url: index.htm
  - listitem:
    - link "about":
      - /url: about.htm
  - listitem:
    - link "contact":
      - /url: contact.htm
- paragraph: Welcome John Smith
- heading "Account Services" [level=2]
- list:
  - listitem:
    - link "Open New Account":
      - /url: openaccount.htm
  - listitem:
    - link "Accounts Overview":
      - /url: overview.htm
  - listitem:
    - link "Transfer Funds":
      - /url: transfer.htm
  - listitem:
    - link "Bill Pay":
      - /url: billpay.htm
  - listitem:
    - link "Find Transactions":
      - /url: findtrans.htm
  - listitem:
    - link "Update Contact Info":
      - /url: updateprofile.htm
  - listitem:
    - link "Request Loan":
      - /url: requestloan.htm
  - listitem:
    - link "Log Out":
      - /url: logout.htm
- heading "Open New Account" [level=1]
- paragraph: What type of Account would you like to open?
- combobox:
  - option "CHECKING" [selected]
  - option "SAVINGS"
- paragraph: A minimum of $100.00 must be deposited into this account at time of opening. Please choose an existing account to transfer funds into the new account.
- combobox:
  - option "12345" [selected]
  - option "12456"
  - option "12567"
  - option "12678"
  - option "12789"
  - option "12900"
  - option "13011"
  - option "13122"
  - option "13233"
  - option "13344"
  - option "35655"
  - option "36876"
  - option "40872"
  - option "40983"
  - option "54321"
- button "Open New Account"
- list:
  - listitem:
    - link "Home":
      - /url: index.htm
    - text: "|"
  - listitem:
    - link "About Us":
      - /url: about.htm
    - text: "|"
  - listitem:
    - link "Services":
      - /url: services.htm
    - text: "|"
  - listitem:
    - link "Products":
      - /url: http://www.parasoft.com/jsp/products.jsp
    - text: "|"
  - listitem:
    - link "Locations":
      - /url: http://www.parasoft.com/jsp/pr/contacts.jsp
    - text: "|"
  - listitem:
    - link "Site Map":
      - /url: sitemap.htm
    - text: "|"
  - listitem:
    - link "Contact Us":
      - /url: contact.htm
- paragraph: © Parasoft. All rights reserved.
- list:
  - listitem: "Visit us at:"
  - listitem:
    - link "www.parasoft.com":
      - /url: http://www.parasoft.com/
```

# Test source

```ts
  1  | import { test, expect } from '@fixtures/authFixture';
  2  | import { AccountsPage } from '@pages/AccountsPage';
  3  | 
  4  | test.describe('Accounts Overview UI', () => {
  5  | 
  6  |     test('TC-ACC-UI-001 View Accounts Overview table', async ({ loginPage, page }) => {
  7  |         const accountsPage = new AccountsPage(page);
  8  | 
  9  |         await expect(accountsPage.accountColumnHeader).toBeVisible();
  10 |         await expect(accountsPage.balanceColumnHeader).toBeVisible();
  11 |         await expect(accountsPage.availableAmountColumnHeader).toBeVisible();
  12 |         await expect(accountsPage.totalRow).toBeVisible();
  13 |     });
  14 | 
  15 |     test('TC-ACC-UI-002 Verify Total equals sum of balances', async ({ loginPage, page }) => {
  16 |         const accountsPage = new AccountsPage(page);
  17 | 
  18 |         // 1) Parse all balance column values
  19 |         const balances = await accountsPage.getAccountBalances();
  20 |         expect(balances.length).toBeGreaterThanOrEqual(1);
  21 | 
  22 |         // 2) Sum mathematically
  23 |         const calculatedSum = balances.reduce((sum, val) => sum + val, 0);
  24 | 
  25 |         // 3) Read Total row
  26 |         const reportedTotal = await accountsPage.getTotalBalance();
  27 | 
  28 |         // Total matches sum of all individual balances within $0.01
  29 |         expect(reportedTotal).toBeCloseTo(calculatedSum, 2);
  30 |     });
  31 | 
  32 |     test('TC-ACC-UI-003 Balance currency formatting', async ({ loginPage, page }) => {
  33 |         const accountsPage = new AccountsPage(page);
  34 |         const currencyRegex = /^-?\$[\d,]+\.\d{2}$/;
  35 | 
  36 |         // 1) Wait for accounts table to finish loading
  37 |         await accountsPage.accountRows.first().waitFor({ state: 'visible' });
  38 | 
  39 |         // 2) Inspect all individual balance values in the table
  40 |         const balances = await accountsPage.balanceCells.allInnerTexts();
  41 |         expect(balances.length).toBeGreaterThanOrEqual(1);
  42 | 
  43 |         for (const balance of balances) {
  44 |             expect(balance.trim()).toMatch(currencyRegex);
  45 |         }
  46 | 
  47 |         // 3) Inspect Total balance row format
  48 |         const totalBalance = await accountsPage.totalBalanceCell.innerText();
  49 |         expect(totalBalance.trim()).toMatch(currencyRegex);
  50 |     });
  51 | 
  52 |     test('TC-ACC-UI-004 Open new CHECKING account', async ({ loginPage, page }) => {
  53 |         const accountPage = new AccountsPage(page);
  54 | 
  55 |         await accountPage.clickOpenNewAccountLink();
  56 |         await accountPage.selectAccountType('CHECKING');
  57 |         await accountPage.selectAccountId(0);
  58 |         await accountPage.clickOpenNewAccountBtn();
  59 | 
> 60 |         await expect(accountPage.accountHeading).toBeVisible();
     |                                                  ^ Error: expect(locator).toBeVisible() failed
  61 |         await expect(accountPage.newAccountIdLink).toBeVisible();
  62 |     });
  63 | 
  64 | });
  65 | 
```