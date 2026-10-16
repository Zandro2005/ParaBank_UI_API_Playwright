# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: ui\login.spec.ts >> Login: Login with invalid username
- Location: tests\ui\login.spec.ts:25:9

# Error details

```
Error: expect(locator).toContainText(expected) failed

Locator: locator('#rightPanel p.error')
Timeout: 5000ms
- Expected substring  - 1
+ Received string     + 3

- The username and password could not be verified
+
+ 			An internal error has occurred and has been logged.
+ 		

Call log:
  - Expect "toContainText" locator('#rightPanel p.error') with timeout 5000ms
  - waiting for locator('#rightPanel p.error')
    11 × locator resolved to <p class="error">↵⇆⇆⇆An internal error has occurred and has been l…</p>
       - unexpected value "
			An internal error has occurred and has been logged.
		"

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
- heading "Accounts Overview" [level=1]
- table:
  - rowgroup:
    - row "Account Balance* Available Amount":
      - columnheader "Account"
      - columnheader "Balance*"
      - columnheader "Available Amount"
  - rowgroup:
    - row "12345 -$2310.00 $0.00":
      - cell "12345":
        - link "12345":
          - /url: activity.htm?id=12345
      - cell "-$2310.00"
      - cell "$0.00"
    - row "12456 -$78.55 $0.00":
      - cell "12456":
        - link "12456":
          - /url: activity.htm?id=12456
      - cell "-$78.55"
      - cell "$0.00"
    - row "12567 $1.00 $1.00":
      - cell "12567":
        - link "12567":
          - /url: activity.htm?id=12567
      - cell "$1.00"
      - cell "$1.00"
    - row "12678 -$199.00 $0.00":
      - cell "12678":
        - link "12678":
          - /url: activity.htm?id=12678
      - cell "-$199.00"
      - cell "$0.00"
    - row "12789 $1.00 $1.00":
      - cell "12789":
        - link "12789":
          - /url: activity.htm?id=12789
      - cell "$1.00"
      - cell "$1.00"
    - row "12900 -$100.00 $0.00":
      - cell "12900":
        - link "12900":
          - /url: activity.htm?id=12900
      - cell "-$100.00"
      - cell "$0.00"
    - row "13011 $1.00 $1.00":
      - cell "13011":
        - link "13011":
          - /url: activity.htm?id=13011
      - cell "$1.00"
      - cell "$1.00"
    - row "13122 $1001.00 $1001.00":
      - cell "13122":
        - link "13122":
          - /url: activity.htm?id=13122
      - cell "$1001.00"
      - cell "$1001.00"
    - row "13233 $100.00 $100.00":
      - cell "13233":
        - link "13233":
          - /url: activity.htm?id=13233
      - cell "$100.00"
      - cell "$100.00"
    - row "13344 $1231.10 $1231.10":
      - cell "13344":
        - link "13344":
          - /url: activity.htm?id=13344
      - cell "$1231.10"
      - cell "$1231.10"
    - row "13899 $100.00 $100.00":
      - cell "13899":
        - link "13899":
          - /url: activity.htm?id=13899
      - cell "$100.00"
      - cell "$100.00"
    - row "54321 $1351.12 $1351.12":
      - cell "54321":
        - link "54321":
          - /url: activity.htm?id=54321
      - cell "$1351.12"
      - cell "$1351.12"
    - row "Total $1098.67":
      - cell "Total"
      - cell "$1098.67"
      - cell
  - rowgroup:
    - row "*Balance includes deposits that may be subject to holds":
      - cell "*Balance includes deposits that may be subject to holds"
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
  1  | import {test, expect} from '@fixtures/authFixture';
  2  | import { LoginPage } from '@pages/LoginPage';
  3  | import { loginCases } from '@test-data/users';
  4  | 
  5  | 
  6  | test('Valid login', async({page}) =>{
  7  |     const loginPage = new LoginPage(page);
  8  |     const username = process.env.TEST_USERNAME!;
  9  |     const password = process.env.TEST_PASSWORD!;
  10 | 
  11 |     await loginPage.navigate()
  12 |     await loginPage.fillLoginCredentials(username, password);
  13 |     await loginPage.clickLoginBtn();
  14 | 
  15 |     await expect(loginPage.overviewHeading).toHaveText('Accounts Overview')
  16 | 
  17 | });
  18 | 
  19 | test('Verify dashboardafter login', async({loginPage}) =>{
  20 |     await expect(loginPage.greetingsText).toBeVisible();
  21 | 
  22 | });
  23 | 
  24 | for (const data of loginCases){
  25 |     test(`Login: ${data.name}`, async({page}) =>{
  26 |     const loginPage = new LoginPage(page);
  27 | 
  28 | 
  29 |     await loginPage.navigate();
  30 |     await loginPage.fillLoginCredentials(data.username, data.password);
  31 |     await loginPage.clickLoginBtn();
  32 |     
> 33 |     await expect(loginPage.loginErrorMessage).toContainText(data.errorMessage);
     |                                               ^ Error: expect(locator).toContainText(expected) failed
  34 | 
  35 | 
  36 |     });
  37 | }
  38 | 
  39 | test('Logout workflow', async({loginPage}) =>{
  40 |     await loginPage.clickLogoutBtn();
  41 |     
  42 |     await expect(loginPage.page).toHaveURL(loginPage.loginUrl);
  43 | 
  44 | });
  45 | 
  46 | 
  47 | 
```