# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: ui\profile.spec.ts >> Password confirmation mismatch
- Location: tests\ui\profile.spec.ts:43:5

# Error details

```
Error: expect(locator).toHaveText(expected) failed

Locator: locator('#customerForm span.error')
Expected: "Passwords did not match."
Error: strict mode violation: locator('#customerForm span.error') resolved to 2 elements:
    1) <span class="error" id="customer.address.street.errors">Address is required.</span> aka getByText('Address is required.')
    2) <span class="error" id="repeatedPassword.errors">Passwords did not match.</span> aka getByText('Passwords did not match.')

Call log:
  - Expect "toHaveText" locator('#customerForm span.error') with timeout 5000ms
  - waiting for locator('#customerForm span.error')

```

# Page snapshot

```yaml
- generic [ref=f2e1]:
  - generic [ref=f2e2]:
    - generic [ref=f2e3]:
      - link:
        - /url: admin.htm
        - img [ref=f2e4] [cursor=pointer]
      - link "ParaBank":
        - /url: index.htm
        - img "ParaBank" [ref=f2e5] [cursor=pointer]
      - paragraph [ref=f2e6]: Experience the difference
    - generic [ref=f2e7]:
      - list [ref=f2e8]:
        - listitem [ref=f2e9]: Solutions
        - listitem [ref=f2e10]:
          - link "About Us" [ref=f2e11] [cursor=pointer]:
            - /url: about.htm
        - listitem [ref=f2e12]:
          - link "Services" [ref=f2e13] [cursor=pointer]:
            - /url: services.htm
        - listitem [ref=f2e14]:
          - link "Products" [ref=f2e15] [cursor=pointer]:
            - /url: http://www.parasoft.com/jsp/products.jsp
        - listitem [ref=f2e16]:
          - link "Locations" [ref=f2e17] [cursor=pointer]:
            - /url: http://www.parasoft.com/jsp/pr/contacts.jsp
        - listitem [ref=f2e18]:
          - link "Admin Page" [ref=f2e19] [cursor=pointer]:
            - /url: admin.htm
      - list [ref=f2e20]:
        - listitem [ref=f2e21]:
          - link "home" [ref=f2e22] [cursor=pointer]:
            - /url: index.htm
        - listitem [ref=f2e23]:
          - link "about" [ref=f2e24] [cursor=pointer]:
            - /url: about.htm
        - listitem [ref=f2e25]:
          - link "contact" [ref=f2e26] [cursor=pointer]:
            - /url: contact.htm
    - generic [ref=f2e27]:
      - generic [ref=f2e28]:
        - heading "Customer Login" [level=2] [ref=f2e29]
        - generic [ref=f2e30]:
          - generic [ref=f2e31]:
            - paragraph [ref=f2e32]: Username
            - textbox [active] [ref=f2e34]
            - paragraph [ref=f2e35]: Password
            - textbox [ref=f2e37]
            - button "Log In" [ref=f2e39] [cursor=pointer]
          - paragraph [ref=f2e40]:
            - link "Forgot login info?" [ref=f2e41] [cursor=pointer]:
              - /url: lookup.htm
          - paragraph [ref=f2e42]:
            - link "Register" [ref=f2e43] [cursor=pointer]:
              - /url: register.htm
      - generic [ref=f2e44]:
        - heading "Signing up is easy!" [level=1] [ref=f2e45]
        - paragraph [ref=f2e46]: If you have an account with us you can sign-up for free instant online access. You will have to provide some personal information.
        - table [ref=f2e48]:
          - rowgroup [ref=f2e49]:
            - row [ref=f2e50]:
              - cell "First Name:" [ref=f2e51]
              - cell [ref=f2e52]:
                - textbox [ref=f2e53]: John
              - cell [ref=f2e54]
            - row [ref=f2e55]:
              - cell "Last Name:" [ref=f2e56]
              - cell [ref=f2e57]:
                - textbox [ref=f2e58]: Doe
              - cell [ref=f2e59]
            - row [ref=f2e60]:
              - cell "Address:" [ref=f2e61]
              - cell [ref=f2e62]:
                - textbox [ref=f2e63]
              - cell "Address is required." [ref=f2e64]
            - row [ref=f2e65]:
              - cell "City:" [ref=f2e66]
              - cell [ref=f2e67]:
                - textbox [ref=f2e68]: Beverly Hills
              - cell [ref=f2e69]
            - row [ref=f2e70]:
              - cell "State:" [ref=f2e71]
              - cell [ref=f2e72]:
                - textbox [ref=f2e73]: CA
              - cell [ref=f2e74]
            - row [ref=f2e75]:
              - cell "Zip Code:" [ref=f2e76]
              - cell [ref=f2e77]:
                - textbox [ref=f2e78]: "90210"
              - cell [ref=f2e79]
            - row [ref=f2e80]:
              - 'cell "Phone #:" [ref=f2e81]'
              - cell [ref=f2e82]:
                - textbox [ref=f2e83]: 555-1234
              - cell [ref=f2e84]
            - row [ref=f2e85]:
              - cell "SSN:" [ref=f2e86]
              - cell [ref=f2e87]:
                - textbox [ref=f2e88]: 123-45-6789
              - cell [ref=f2e89]
            - row [ref=f2e90]:
              - cell [ref=f2e91]
            - row [ref=f2e92]:
              - cell "Username:" [ref=f2e93]
              - cell [ref=f2e94]:
                - textbox [ref=f2e95]: user_621189
              - cell [ref=f2e96]
            - row [ref=f2e97]:
              - cell "Password:" [ref=f2e98]
              - cell [ref=f2e99]:
                - textbox [ref=f2e100]
              - cell [ref=f2e101]
            - row [ref=f2e102]:
              - cell "Confirm:" [ref=f2e103]
              - cell [ref=f2e104]:
                - textbox [ref=f2e105]
              - cell "Passwords did not match." [ref=f2e106]
            - row [ref=f2e107]:
              - cell [ref=f2e108]
              - cell [ref=f2e109]:
                - button "Register" [ref=f2e110] [cursor=pointer]
  - generic [ref=f2e112]:
    - list [ref=f2e113]:
      - listitem [ref=f2e114]:
        - link "Home" [ref=f2e115] [cursor=pointer]:
          - /url: index.htm
        - text: "|"
      - listitem [ref=f2e116]:
        - link "About Us" [ref=f2e117] [cursor=pointer]:
          - /url: about.htm
        - text: "|"
      - listitem [ref=f2e118]:
        - link "Services" [ref=f2e119] [cursor=pointer]:
          - /url: services.htm
        - text: "|"
      - listitem [ref=f2e120]:
        - link "Products" [ref=f2e121] [cursor=pointer]:
          - /url: http://www.parasoft.com/jsp/products.jsp
        - text: "|"
      - listitem [ref=f2e122]:
        - link "Locations" [ref=f2e123] [cursor=pointer]:
          - /url: http://www.parasoft.com/jsp/pr/contacts.jsp
        - text: "|"
      - listitem [ref=f2e124]:
        - link "Site Map" [ref=f2e125] [cursor=pointer]:
          - /url: sitemap.htm
        - text: "|"
      - listitem [ref=f2e126]:
        - link "Contact Us" [ref=f2e127] [cursor=pointer]:
          - /url: contact.htm
    - paragraph [ref=f2e128]: © Parasoft. All rights reserved.
    - list [ref=f2e129]:
      - listitem [ref=f2e130]: "Visit us at:"
      - listitem [ref=f2e131]:
        - link "www.parasoft.com" [ref=f2e132] [cursor=pointer]:
          - /url: http://www.parasoft.com/
```

# Test source

```ts
  1   | import {test, expect} from '@fixtures/authFixture';
  2   | import { ProfilePage } from '@pages/ProfilePage'
  3   | import { profile } from 'console';
  4   | 
  5   | 
  6   | 
  7   | test('Register new user via UI', async({page}) =>{
  8   |     const profilePage = new ProfilePage(page);
  9   |     const uniqueUsername = `user_${Date.now().toString().slice(-6)}`;
  10  | 
  11  |     await profilePage.navigate();
  12  |     await profilePage.clickRegisterLink();
  13  |     await profilePage.fillRegisterCredentials({
  14  |         firstname: 'John',
  15  |         lastname: 'Doe',
  16  |         address: '123 Main St',
  17  |         city: 'Beverly Hills',
  18  |         state: 'CA',
  19  |         zipCode: '90210',
  20  |         phone: '555-1234',
  21  |         ssn: '123-45-6789',
  22  |         username: uniqueUsername,
  23  |         password: 'Password123!',
  24  |         confirmPassword: 'Password123!'
  25  |     });
  26  | 
  27  |     await profilePage.clickRegisterBtn();
  28  |     await expect(profilePage.welcomeMessage).toHaveText('Your account was created successfully. You are now logged in.')
  29  | 
  30  | });
  31  | 
  32  | test('Register with completely empty form', async({page}) =>{
  33  |     const profilePage = new ProfilePage(page);
  34  | 
  35  |     await profilePage.navigate();
  36  |     await profilePage.clickRegisterLink();
  37  |     await profilePage.clickRegisterBtn();
  38  | 
  39  |     await expect(profilePage.registerErrorMessages.first()).toBeVisible();
  40  | 
  41  | });
  42  | 
  43  | test('Password confirmation mismatch', async({page}) =>{
  44  |     const profilePage = new ProfilePage(page);
  45  |     const uniqueUsername = `user_${Date.now().toString().slice(-6)}`;
  46  | 
  47  |     await profilePage.navigate();
  48  |     await profilePage.clickRegisterLink();
  49  |     await profilePage.fillRegisterCredentials({
  50  |         firstname: 'John',
  51  |         lastname: 'Doe',
  52  |         address: '123MainSt',
  53  |         city: 'Beverly Hills',
  54  |         state: 'CA',
  55  |         zipCode: '90210',
  56  |         phone: '555-1234',
  57  |         ssn: '123-45-6789',
  58  |         username: uniqueUsername,
  59  |         password: 'Password123!',
  60  |         confirmPassword: 'Password123456!'
  61  | 
  62  |     });
  63  | 
  64  |     await profilePage.clickRegisterBtn();
  65  | 
> 66  |     await expect(profilePage.registerErrorMessages).toHaveText('Passwords did not match.');
      |                                                     ^ Error: expect(locator).toHaveText(expected) failed
  67  | 
  68  | });
  69  | 
  70  | test('Duplicate username registration', async({page}) =>{
  71  |     const profilePage = new ProfilePage(page);
  72  | 
  73  |     await profilePage.navigate();
  74  |     await profilePage.clickRegisterLink();
  75  |     await profilePage.fillRegisterCredentials({
  76  |     
  77  |         firstname: 'John',
  78  |         lastname: 'Doe',
  79  |         address: '123 Main St',
  80  |         city: 'Beverly Hills',
  81  |         state: 'CA',
  82  |         zipCode: '90210',
  83  |         phone: '555-1234',
  84  |         ssn: '123-45-6789',
  85  |         username: 'John',
  86  |         password: 'Password123!',
  87  |         confirmPassword: 'Password123!'
  88  | 
  89  |     });
  90  | 
  91  |     await profilePage.clickRegisterBtn();
  92  |   
  93  |     await expect(profilePage.registerErrorMessages).toHaveText('This username already exists.');
  94  | 
  95  | });
  96  | 
  97  | test('Login with freshly registered user', async({page}) =>{
  98  |     const profilePage = new ProfilePage(page);
  99  |     const duplicateUsername = `user_${Date.now().toString().slice(-6)}`;
  100 | 
  101 |     
  102 |     await profilePage.navigate();
  103 |     await profilePage.clickRegisterLink();
  104 |     await profilePage.fillRegisterCredentials({
  105 | 
  106 |     
  107 |         firstname: 'Zandro',
  108 |         lastname: 'Guinialope',
  109 |         address: '123 Main St',
  110 |         city: 'Beverly Hills',
  111 |         state: 'CA',
  112 |         zipCode: '90210',
  113 |         phone: '555-1234',
  114 |         ssn: '123-45-6789',
  115 |         username: duplicateUsername,
  116 |         password: 'Password123!',
  117 |         confirmPassword: 'Password123!'
  118 | 
  119 | 
  120 | 
  121 |     });
  122 | 
  123 |     await profilePage.clickRegisterBtn();
  124 | 
  125 |     await expect(profilePage.welcomeMessage).toHaveText('Your account was created successfully. You are now logged in.');
  126 | 
  127 | });
  128 | 
  129 | test('View Accounts Overview table', async({loginPage, page}) =>{
  130 |     const profilePage = new ProfilePage(page);
  131 |     await expect(profilePage.accountColumnHeader).toBeVisible();
  132 |     await expect(profilePage.balanceColumnHeader).toBeVisible();
  133 |     await expect(profilePage.availableAmountColumnHeader).toBeVisible();
  134 |     await expect(profilePage.tableTotalAmount).toBeVisible();
  135 | 
  136 | });
  137 | 
  138 | 
```