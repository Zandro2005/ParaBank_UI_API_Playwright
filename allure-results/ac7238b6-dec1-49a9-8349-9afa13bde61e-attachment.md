# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: ui\profile.spec.ts >> Register new user via UI
- Location: tests\ui\profile.spec.ts:5:5

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByText('Your account was created')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" getByText('Your account was created') with timeout 5000ms
  - waiting for getByText('Your account was created')

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
- heading "Signing up is easy!" [level=1]
- paragraph: If you have an account with us you can sign-up for free instant online access. You will have to provide some personal information.
- table:
  - rowgroup:
    - 'row "First Name: First name is required."':
      - cell "First Name:"
      - cell:
        - textbox
      - cell "First name is required."
    - 'row "Last Name: Doe"':
      - cell "Last Name:"
      - cell "Doe":
        - textbox: Doe
      - cell
    - 'row "Address: 123 Main St"':
      - cell "Address:"
      - cell "123 Main St":
        - textbox: 123 Main St
      - cell
    - 'row "City: Beverly Hills"':
      - cell "City:"
      - cell "Beverly Hills":
        - textbox: Beverly Hills
      - cell
    - 'row "State: CA"':
      - cell "State:"
      - cell "CA":
        - textbox: CA
      - cell
    - 'row "Zip Code: 90210"':
      - cell "Zip Code:"
      - cell "90210":
        - textbox: "90210"
      - cell
    - 'row "Phone #: 555-1234"':
      - 'cell "Phone #:"'
      - cell "555-1234":
        - textbox: 555-1234
      - cell
    - 'row "SSN: 123-45-6789"':
      - cell "SSN:"
      - cell "123-45-6789":
        - textbox: 123-45-6789
      - cell
    - row:
      - cell
    - 'row "Username: user_990695"':
      - cell "Username:"
      - cell "user_990695":
        - textbox: user_990695
      - cell
    - row "Password:":
      - cell "Password:"
      - cell:
        - textbox
      - cell
    - row "Confirm:":
      - cell "Confirm:"
      - cell:
        - textbox
      - cell
    - row "Register":
      - cell
      - cell "Register":
        - button "Register"
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
  1   | import { test, expect } from '@fixtures/authFixture';
  2   | import { ProfilePage } from '@pages/ProfilePage';
  3   | import { LoginPage } from '@pages/LoginPage';
  4   | 
  5   | test('Register new user via UI', async ({ page }) => {
  6   |     const profilePage = new ProfilePage(page);
  7   |     const uniqueUsername = `user_${Date.now().toString().slice(-6)}`;
  8   | 
  9   |     await profilePage.navigate();
  10  |     await profilePage.clickRegisterLink();
  11  |     await profilePage.fillRegisterCredentials({
  12  |         firstname: 'John',
  13  |         lastname: 'Doe',
  14  |         address: '123 Main St',
  15  |         city: 'Beverly Hills',
  16  |         state: 'CA',
  17  |         zipCode: '90210',
  18  |         phone: '555-1234',
  19  |         ssn: '123-45-6789',
  20  |         username: uniqueUsername,
  21  |         password: 'Password123!',
  22  |         confirmPassword: 'Password123!'
  23  |     });
  24  | 
  25  |     await profilePage.clickRegisterBtn();
> 26  |     await expect(profilePage.welcomeMessage).toBeVisible();
      |                                              ^ Error: expect(locator).toBeVisible() failed
  27  | });
  28  | 
  29  | test('Register with completely empty form', async ({ page }) => {
  30  |     const profilePage = new ProfilePage(page);
  31  | 
  32  |     await profilePage.navigate();
  33  |     await profilePage.clickRegisterLink();
  34  |     await profilePage.clickRegisterBtn();
  35  | 
  36  |     await expect(profilePage.registerErrorMessages.first()).toBeVisible();
  37  | });
  38  | 
  39  | test('Password confirmation mismatch', async ({ page }) => {
  40  |     const profilePage = new ProfilePage(page);
  41  |     const uniqueUsername = `user_${Date.now().toString().slice(-6)}`;
  42  | 
  43  |     await profilePage.navigate();
  44  |     await profilePage.clickRegisterLink();
  45  |     await profilePage.fillRegisterCredentials({
  46  |         firstname: 'John',
  47  |         lastname: 'Doe',
  48  |         address: '123 Main St',
  49  |         city: 'Beverly Hills',
  50  |         state: 'CA',
  51  |         zipCode: '90210',
  52  |         phone: '555-1234',
  53  |         ssn: '123-45-6789',
  54  |         username: uniqueUsername,
  55  |         password: 'Password123!',
  56  |         confirmPassword: 'Password123456!'
  57  |     });
  58  | 
  59  |     await profilePage.clickRegisterBtn();
  60  |     await expect(profilePage.getErrorMessage('Passwords did not match.')).toBeVisible();
  61  | });
  62  | 
  63  | test('Duplicate username registration', async ({ page }) => {
  64  |     const profilePage = new ProfilePage(page);
  65  |     const duplicateUsername = `user_${Date.now().toString().slice(-6)}`;
  66  |     const userData = {
  67  |         firstname: 'John',
  68  |         lastname: 'Doe',
  69  |         address: '123 Main St',
  70  |         city: 'Beverly Hills',
  71  |         state: 'CA',
  72  |         zipCode: '90210',
  73  |         phone: '555-1234',
  74  |         ssn: '123-45-6789',
  75  |         username: duplicateUsername,
  76  |         password: 'Password123!',
  77  |         confirmPassword: 'Password123!'
  78  |     };
  79  | 
  80  |     // 1. Initial registration
  81  |     await profilePage.navigate();
  82  |     await profilePage.clickRegisterLink();
  83  |     await profilePage.fillRegisterCredentials(userData);
  84  |     await profilePage.clickRegisterBtn();
  85  |     await expect(profilePage.welcomeMessage).toBeVisible();
  86  | 
  87  |     // 2. Log out
  88  |     await page.getByRole('link', { name: 'Log Out' }).click();
  89  | 
  90  |     // 3. Attempt duplicate registration
  91  |     await profilePage.clickRegisterLink();
  92  |     await profilePage.fillRegisterCredentials(userData);
  93  |     await profilePage.clickRegisterBtn();
  94  | 
  95  |     // 4. Assert error
  96  |     await expect(profilePage.getErrorMessage('This username already exists.')).toBeVisible();
  97  | });
  98  | 
  99  | test('Login with freshly registered user', async ({ page }) => {
  100 |     const profilePage = new ProfilePage(page);
  101 |     const uniqueUsername = `user_${Date.now().toString().slice(-6)}`;
  102 |     const password = 'Password123!';
  103 | 
  104 |     // 1. Register new user
  105 |     await profilePage.navigate();
  106 |     await profilePage.clickRegisterLink();
  107 |     await profilePage.fillRegisterCredentials({
  108 |         firstname: 'Zandro',
  109 |         lastname: 'Guinialope',
  110 |         address: '123 Main St',
  111 |         city: 'Beverly Hills',
  112 |         state: 'CA',
  113 |         zipCode: '90210',
  114 |         phone: '555-1234',
  115 |         ssn: '123-45-6789',
  116 |         username: uniqueUsername,
  117 |         password: password,
  118 |         confirmPassword: password
  119 |     });
  120 |     await profilePage.clickRegisterBtn();
  121 |     await expect(profilePage.welcomeMessage).toBeVisible();
  122 | 
  123 |     // 2. Log out
  124 |     await page.getByRole('link', { name: 'Log Out' }).click();
  125 | 
  126 |     // 3. Log back in with freshly registered credentials
```