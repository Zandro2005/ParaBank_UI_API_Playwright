# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: ui\login.spec.ts >> Submit login using Enter key
- Location: tests\ui\login.spec.ts:95:5

# Error details

```
Error: expect(page).toHaveURL(expected) failed

Expected: predicate to succeed
Received: "https://parabank.parasoft.com/parabank/login.htm;jsessionid=DFDA1E402D923758B02839E7C8DAA32C"
Timeout:  5000ms

```

# Page snapshot

```yaml
- generic [ref=f1e1]:
  - generic [ref=f1e2]:
    - generic [ref=f1e3]:
      - link:
        - /url: admin.htm
        - img [ref=f1e4] [cursor=pointer]
      - link "ParaBank":
        - /url: index.htm
        - img "ParaBank" [ref=f1e5] [cursor=pointer]
      - paragraph [ref=f1e6]: Experience the difference
    - generic [ref=f1e7]:
      - list [ref=f1e8]:
        - listitem [ref=f1e9]: Solutions
        - listitem [ref=f1e10]:
          - link "About Us" [ref=f1e11] [cursor=pointer]:
            - /url: about.htm
        - listitem [ref=f1e12]:
          - link "Services" [ref=f1e13] [cursor=pointer]:
            - /url: services.htm
        - listitem [ref=f1e14]:
          - link "Products" [ref=f1e15] [cursor=pointer]:
            - /url: http://www.parasoft.com/jsp/products.jsp
        - listitem [ref=f1e16]:
          - link "Locations" [ref=f1e17] [cursor=pointer]:
            - /url: http://www.parasoft.com/jsp/pr/contacts.jsp
        - listitem [ref=f1e18]:
          - link "Admin Page" [ref=f1e19] [cursor=pointer]:
            - /url: admin.htm
      - list [ref=f1e20]:
        - listitem [ref=f1e21]:
          - link "home" [ref=f1e22] [cursor=pointer]:
            - /url: index.htm
        - listitem [ref=f1e23]:
          - link "about" [ref=f1e24] [cursor=pointer]:
            - /url: about.htm
        - listitem [ref=f1e25]:
          - link "contact" [ref=f1e26] [cursor=pointer]:
            - /url: contact.htm
    - generic [ref=f1e27]:
      - generic [ref=f1e28]:
        - heading "Customer Login" [level=2] [ref=f1e29]
        - generic [ref=f1e30]:
          - generic [ref=f1e31]:
            - paragraph [ref=f1e32]: Username
            - textbox [active] [ref=f1e34]
            - paragraph [ref=f1e35]: Password
            - textbox [ref=f1e37]
            - button "Log In" [ref=f1e39] [cursor=pointer]
          - paragraph [ref=f1e40]:
            - link "Forgot login info?" [ref=f1e41] [cursor=pointer]:
              - /url: lookup.htm
          - paragraph [ref=f1e42]:
            - link "Register" [ref=f1e43] [cursor=pointer]:
              - /url: register.htm
      - generic [ref=f1e44]:
        - heading "Error!" [level=1] [ref=f1e45]
        - paragraph [ref=f1e46]: The username and password could not be verified.
  - generic [ref=f1e48]:
    - list [ref=f1e49]:
      - listitem [ref=f1e50]:
        - link "Home" [ref=f1e51] [cursor=pointer]:
          - /url: index.htm
        - text: "|"
      - listitem [ref=f1e52]:
        - link "About Us" [ref=f1e53] [cursor=pointer]:
          - /url: about.htm
        - text: "|"
      - listitem [ref=f1e54]:
        - link "Services" [ref=f1e55] [cursor=pointer]:
          - /url: services.htm
        - text: "|"
      - listitem [ref=f1e56]:
        - link "Products" [ref=f1e57] [cursor=pointer]:
          - /url: http://www.parasoft.com/jsp/products.jsp
        - text: "|"
      - listitem [ref=f1e58]:
        - link "Locations" [ref=f1e59] [cursor=pointer]:
          - /url: http://www.parasoft.com/jsp/pr/contacts.jsp
        - text: "|"
      - listitem [ref=f1e60]:
        - link "Site Map" [ref=f1e61] [cursor=pointer]:
          - /url: sitemap.htm
        - text: "|"
      - listitem [ref=f1e62]:
        - link "Contact Us" [ref=f1e63] [cursor=pointer]:
          - /url: contact.htm
    - paragraph [ref=f1e64]: © Parasoft. All rights reserved.
    - list [ref=f1e65]:
      - listitem [ref=f1e66]: "Visit us at:"
      - listitem [ref=f1e67]:
        - link "www.parasoft.com" [ref=f1e68] [cursor=pointer]:
          - /url: http://www.parasoft.com/
```

# Test source

```ts
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
  20  |     await expect(loginPage.greetingsText).toBeVisible();
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
> 109 |     await expect(loginPage.page).toHaveURL((url) => {
      |                                  ^ Error: expect(page).toHaveURL(expected) failed
  110 |         return url.pathname === '/parabank/overview.htm';
  111 |     });
  112 |     await expect(loginPage.overviewHeading).toHaveText('Accounts Overview');
  113 | });
  114 | 
```