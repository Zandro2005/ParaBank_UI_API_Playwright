# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: ui\login.spec.ts >> Verify dashboardafter login
- Location: tests\ui\login.spec.ts:19:5

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByText('Welcome')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" getByText('Welcome') with timeout 5000ms
  - waiting for getByText('Welcome')

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
  1   | import {test, expect} from '@fixtures/authFixture';
  2   | import { LoginPage } from '@pages/LoginPage';
  3   | import { loginCases } from '@test-data/users';
  4   | 
  5   | 
  6   | test('Valid login', async({page}) =>{
  7   |     const loginPage = new LoginPage(page);
  8   |     const username = process.env.TEST_USERNAME!;
  9   |     const password = process.env.TEST_PASSWORD!;
  10  | 
  11  |     await loginPage.navigate()
  12  |     await loginPage.fillLoginCredentials(username, password);
  13  |     await loginPage.clickLoginBtn();
  14  | 
  15  |     await expect(loginPage.overviewHeading).toHaveText('Accounts Overview')
  16  | 
  17  | });
  18  | 
  19  | test('Verify dashboardafter login', async({loginPage}) =>{
> 20  |     await expect(loginPage.greetingsText).toBeVisible();
      |                                           ^ Error: expect(locator).toBeVisible() failed
  21  | 
  22  | });
  23  | 
  24  | for (const data of loginCases){
  25  |     test(`Login: ${data.name}`, async({page}) =>{
  26  |     test.fail(
  27  |         data.expectedToFail ?? false,
  28  |         data.failureReason
  29  |     );
  30  | 
  31  |     const loginPage = new LoginPage(page);
  32  | 
  33  | 
  34  |     await loginPage.navigate();
  35  |     await loginPage.fillLoginCredentials(data.username, data.password);
  36  |     await loginPage.clickLoginBtn();
  37  |     
  38  |     await expect(loginPage.loginErrorMessage).toContainText(data.errorMessage);
  39  | 
  40  | 
  41  |     });
  42  | }
  43  | 
  44  | test('Logout workflow', async({loginPage}) =>{
  45  |     await loginPage.clickLogoutBtn();
  46  |     
  47  |         await expect(loginPage.page).toHaveURL((url) => {
  48  |             return url.pathname === '/parabank/index.htm';
  49  |         });
  50  | 
  51  | });
  52  | 
  53  | test('Protected page access after logout', async ({ loginPage }) => {
  54  |     // Precondition: Logged out
  55  |     await loginPage.clickLogoutBtn();
  56  |     await expect(loginPage.page).toHaveURL((url) => {
  57  |         return url.pathname === '/parabank/index.htm';
  58  |     });
  59  |     await expect(loginPage.loginBtn).toBeVisible();
  60  | 
  61  |     // 1) Directly navigate to overview.htm
  62  |     await loginPage.navigateToOverview();
  63  | 
  64  |     // Verification: Session revoked. Login form or error page displayed; account data not shown.
  65  |     await expect(loginPage.loginBtn).toBeVisible();
  66  |     await expect(loginPage.errorHeading).toHaveText('Error!');
  67  |     await expect(loginPage.loginErrorMessage).toHaveText('An internal error has occurred and has been logged.');
  68  |     await expect(loginPage.accountTable).not.toBeVisible();
  69  |     await expect(loginPage.overviewHeading).not.toBeVisible();
  70  | 
  71  |     // 2) Click browser Back button
  72  |     await loginPage.page.goBack();
  73  | 
  74  |     // Verification: Session revoked. Login form or error page displayed; account data not shown.
  75  |     await expect(loginPage.loginBtn).toBeVisible();
  76  |     await expect(loginPage.usernameInput).toBeVisible();
  77  |     await expect(loginPage.accountTable).not.toBeVisible();
  78  |     await expect(loginPage.overviewHeading).not.toBeVisible();
  79  | });
  80  | 
  81  | test('Password field masking', async ({ page }) => {
  82  |     const loginPage = new LoginPage(page);
  83  | 
  84  |     await loginPage.navigate();
  85  | 
  86  |     // 1) Inspect password input field
  87  |     await expect(loginPage.passwordInput).toBeVisible();
  88  |     await expect(loginPage.passwordInput).toHaveAttribute('type', 'password');
  89  | 
  90  |     // Verify input characters remain obscured when entered
  91  |     await loginPage.passwordInput.fill('SecretPassword123!');
  92  |     await expect(loginPage.passwordInput).toHaveAttribute('type', 'password');
  93  | });
  94  | 
  95  | test('Submit login using Enter key', async ({ page }) => {
  96  |     const loginPage = new LoginPage(page);
  97  |     const username = process.env.TEST_USERNAME!;
  98  |     const password = process.env.TEST_PASSWORD!;
  99  | 
  100 |     await loginPage.navigate();
  101 | 
  102 |     // 1) Enter username and password
  103 |     await loginPage.fillLoginCredentials(username, password);
  104 | 
  105 |     // 2) Press Enter key
  106 |     await loginPage.passwordInput.press('Enter');
  107 | 
  108 |     // Expected: Form submitted successfully; navigated to overview.htm
  109 |     await expect(loginPage.page).toHaveURL((url) => {
  110 |         return url.pathname === '/parabank/overview.htm';
  111 |     });
  112 |     await expect(loginPage.overviewHeading).toHaveText('Accounts Overview');
  113 | });
  114 | 
```