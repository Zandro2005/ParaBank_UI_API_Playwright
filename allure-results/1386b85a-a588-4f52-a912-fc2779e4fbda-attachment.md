# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: ui\profile.spec.ts >> Duplicate username registration
- Location: tests\ui\profile.spec.ts:69:5

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('#customerForm span.error')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" locator('#customerForm span.error') with timeout 5000ms
  - waiting for locator('#customerForm span.error')

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
    - 'row "First Name: John"':
      - cell "First Name:"
      - cell "John":
        - textbox: John
      - cell
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
    - 'row "Username: John"':
      - cell "Username:"
      - cell "John":
        - textbox: John
      - cell
    - 'row "Password: Password123!"':
      - cell "Password:"
      - cell "Password123!":
        - textbox: Password123!
      - cell
    - 'row "Confirm: Password123!"':
      - cell "Confirm:"
      - cell "Password123!":
        - textbox: Password123!
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
  1   | import {test, expect} from '@playwright/test'
  2   | import { ProfilePage } from '@pages/ProfilePage'
  3   | import { profile } from 'console';
  4   | 
  5   | 
  6   | test('Register new user via UI', async({page}) =>{
  7   |     const profilePage = new ProfilePage(page);
  8   |     const uniqueUsername = `user_${Date.now().toString().slice(-6)}`;
  9   | 
  10  |     await profilePage.navigate();
  11  |     await profilePage.clickRegisterLink();
  12  |     await profilePage.fillRegisterCredentials({
  13  |         firstname: 'John',
  14  |         lastname: 'Doe',
  15  |         address: '123 Main St',
  16  |         city: 'Beverly Hills',
  17  |         state: 'CA',
  18  |         zipCode: '90210',
  19  |         phone: '555-1234',
  20  |         ssn: '123-45-6789',
  21  |         username: uniqueUsername,
  22  |         password: 'Password123!',
  23  |         confirmPassword: 'Password123!'
  24  |     });
  25  | 
  26  |     await profilePage.clickRegisterBtn();
  27  |     await expect(profilePage.welcomeMessage).toHaveText('Your account was created successfully. You are now logged in.')
  28  | 
  29  | });
  30  | 
  31  | test('Register with completely empty form', async({page}) =>{
  32  |     const profilePage = new ProfilePage(page);
  33  | 
  34  |     await profilePage.navigate();
  35  |     await profilePage.clickRegisterLink();
  36  |     await profilePage.clickRegisterBtn();
  37  | 
  38  |     await expect(profilePage.registerErrorMessages).toBeVisible();
  39  | 
  40  | });
  41  | 
  42  | test('Password confirmation mismatch', async({page}) =>{
  43  |     const profilePage = new ProfilePage(page);
  44  |     const uniqueUsername = `user_${Date.now().toString().slice(-6)}`;
  45  | 
  46  |     await profilePage.navigate();
  47  |     await profilePage.clickRegisterLink();
  48  |     await profilePage.fillRegisterCredentials({
  49  |         firstname: 'John',
  50  |         lastname: 'Doe',
  51  |         address: '123 Main St',
  52  |         city: 'Beverly Hills',
  53  |         state: 'CA',
  54  |         zipCode: '90210',
  55  |         phone: '555-1234',
  56  |         ssn: '123-45-6789',
  57  |         username: uniqueUsername,
  58  |         password: 'Password123!',
  59  |         confirmPassword: 'Password123456!'
  60  | 
  61  |     });
  62  | 
  63  |     await expect(profilePage.registerErrorMessages).toBeVisible();
  64  |     await expect(profilePage.registerErrorMessages).toHaveText('Passwords did not match.');
  65  | 
  66  | 
  67  | });
  68  | 
  69  | test('Duplicate username registration', async({page}) =>{
  70  |     const profilePage = new ProfilePage(page);
  71  | 
  72  |     await profilePage.navigate();
  73  |     await profilePage.clickRegisterLink();
  74  |     await profilePage.fillRegisterCredentials({
  75  |     
  76  |         firstname: 'John',
  77  |         lastname: 'Doe',
  78  |         address: '123 Main St',
  79  |         city: 'Beverly Hills',
  80  |         state: 'CA',
  81  |         zipCode: '90210',
  82  |         phone: '555-1234',
  83  |         ssn: '123-45-6789',
  84  |         username: 'John',
  85  |         password: 'Password123!',
  86  |         confirmPassword: 'Password123!'
  87  | 
  88  |     });
  89  | 
> 90  |     await expect(profilePage.registerErrorMessages).toBeVisible();
      |                                                     ^ Error: expect(locator).toBeVisible() failed
  91  |     await expect(profilePage.registerErrorMessages).toHaveText('This username already exists.');
  92  | 
  93  | 
  94  | });
  95  | 
  96  | test('Login with freshly registered user', async({page}) =>{
  97  |     const profilePage = new ProfilePage(page);
  98  | 
  99  |     await profilePage.navigate();
  100 |     await profilePage.clickRegisterLink();
  101 |     await profilePage.fillRegisterCredentials({
  102 | 
  103 |     
  104 |         firstname: 'Zandro',
  105 |         lastname: 'Guinialope',
  106 |         address: '123 Main St',
  107 |         city: 'Beverly Hills',
  108 |         state: 'CA',
  109 |         zipCode: '90210',
  110 |         phone: '555-1234',
  111 |         ssn: '123-45-6789',
  112 |         username: 'Zandro',
  113 |         password: 'Password123!',
  114 |         confirmPassword: 'Password123!'
  115 | 
  116 | 
  117 | 
  118 |     });
  119 | 
  120 |     await expect(profilePage.welcomeMessage).toBeVisible();
  121 | 
  122 | });
  123 | 
  124 | 
```