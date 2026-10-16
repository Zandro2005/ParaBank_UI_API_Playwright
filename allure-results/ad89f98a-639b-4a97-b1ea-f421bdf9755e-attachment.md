# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: ui\login.spec.ts >> Login: Login with invalid password
- Location: tests\ui\login.spec.ts:25:9

# Error details

```
Error: expect(locator).toContainText(expected) failed

Locator: locator('#rightPanel p.error')
Timeout: 5000ms
- Expected substring  - 1
+ Received string     + 3

- The username and password could not be verified.
+
+ 			An internal error has occurred and has been logged.
+ 		

Call log:
  - Expect "toContainText" locator('#rightPanel p.error') with timeout 5000ms
  - waiting for locator('#rightPanel p.error')
    10 × locator resolved to <p class="error">↵⇆⇆⇆An internal error has occurred and has been l…</p>
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
- paragraph: Welcome GUINIALOPE Zandro
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
    - row "14454 $515.50 $515.50":
      - cell "14454":
        - link "14454":
          - /url: activity.htm?id=14454
      - cell "$515.50"
      - cell "$515.50"
    - row "Total $515.50":
      - cell "Total"
      - cell "$515.50"
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