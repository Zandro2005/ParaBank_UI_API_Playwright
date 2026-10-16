# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: ui\login.spec.ts >> Valid login
- Location: tests\ui\login.spec.ts:5:5

# Error details

```
Error: expect(locator).toHaveText(expected) failed

Locator: getByRole('heading', { name: 'Accounts Overview' })
Expected: "Accounts Overview"
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toHaveText" getByRole('heading', { name: 'Accounts Overview' }) with timeout 5000ms
  - waiting for getByRole('heading', { name: 'Accounts Overview' })

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
- heading "Error!" [level=1]
- paragraph: The username and password could not be verified.
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
  3  | import { log } from 'console';
  4  | 
  5  | test('Valid login', async({page}) =>{
  6  |     const loginPage = new LoginPage(page);
  7  |     const username = process.env.TEST_USERNAME!;
  8  |     const password = process.env.TEST_PASSWORD!;
  9  | 
  10 |     await loginPage.navigate()
  11 |     await loginPage.fillLoginCredentials(username, password);
  12 |     await loginPage.clickLoginBtn();
  13 | 
> 14 |     await expect(loginPage.overviewHeading).toHaveText('Accounts Overview')
     |                                             ^ Error: expect(locator).toHaveText(expected) failed
  15 | 
  16 | });
  17 | 
  18 | test('Verify dashboardafter login', async({loginPage}) =>{
  19 |     await expect(loginPage.greetingsText).toBeVisible();
  20 | 
  21 | });
  22 | 
  23 | test('Login with invalid username', async({page}) =>{
  24 |     const loginPage = new LoginPage(page);
  25 |     const username = 'Unknown';
  26 |     const password = process.env.TEST_PASSWORD!;
  27 | 
  28 |     await loginPage.navigate();
  29 |     await loginPage.fillLoginCredentials(username, password);
  30 |     await loginPage.clickLoginBtn();
  31 |     
  32 |     await expect(loginPage.getErrorMessage('The username and password could not be verified.')).toBeVisible();
  33 | 
  34 | 
  35 | });
```