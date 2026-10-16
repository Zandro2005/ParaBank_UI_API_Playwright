# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: ui\login.spec.ts >> Logout workflow
- Location: tests\ui\login.spec.ts:39:5

# Error details

```
Error: expect(page).toHaveURL(expected) failed

Expected: "https://parabank.parasoft.com/parabank/index.htm"
Received: "https://parabank.parasoft.com/parabank/index.htm?ConnType=JDBC"
Timeout:  5000ms

Call log:
  - Expect "toHaveURL" with timeout 5000ms
    13 × locator resolved to <html>…</html>
       - unexpected value "https://parabank.parasoft.com/parabank/index.htm?ConnType=JDBC"

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
- heading "Customer Login" [level=2]
- paragraph: Username
- textbox
- paragraph: Password
- textbox
- button "Log In"
- paragraph:
  - link "Forgot login info?":
    - /url: lookup.htm
- paragraph:
  - link "Register":
    - /url: register.htm
- list:
  - listitem: ATM Services
  - listitem:
    - link "Withdraw Funds":
      - /url: services/ParaBank?wsdl
  - listitem:
    - link "Transfer Funds":
      - /url: services/ParaBank?wsdl
  - listitem:
    - link "Check Balances":
      - /url: services/ParaBank?wsdl
  - listitem:
    - link "Make Deposits":
      - /url: services/ParaBank?wsdl
- list:
  - listitem: Online Services
  - listitem:
    - link "Bill Pay":
      - /url: services/bank?_wadl&_type=xml
  - listitem:
    - link "Account History":
      - /url: services/bank?_wadl&_type=xml
  - listitem:
    - link "Transfer Funds":
      - /url: services/bank?_wadl&_type=xml
- paragraph:
  - link "Read More":
    - /url: services.htm
- heading "Latest News" [level=4]
- list:
  - listitem: 10/16/2026
  - listitem:
    - link "ParaBank Is Now Re-Opened":
      - /url: news.htm#6
  - listitem:
    - link "New! Online Bill Pay":
      - /url: news.htm#5
  - listitem:
    - link "New! Online Account Transfers":
      - /url: news.htm#4
- paragraph:
  - link "Read More":
    - /url: news.htm
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
  33 |     await expect(loginPage.loginErrorMessage).toContainText(data.errorMessage);
  34 | 
  35 | 
  36 |     });
  37 | }
  38 | 
  39 | test('Logout workflow', async({loginPage}) =>{
  40 |     await loginPage.clickLogoutBtn();
  41 |     
> 42 |     await expect(loginPage.page).toHaveURL(loginPage.loginUrl);
     |                                  ^ Error: expect(page).toHaveURL(expected) failed
  43 | 
  44 | });
  45 | 
  46 | 
  47 | 
```