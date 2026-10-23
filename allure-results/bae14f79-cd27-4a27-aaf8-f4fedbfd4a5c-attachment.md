# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: ui\profile.spec.ts >> Duplicate username registration
- Location: tests\ui\profile.spec.ts:63:5

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: page.waitForURL: Test timeout of 30000ms exceeded.
=========================== logs ===========================
waiting for navigation to "**/register.htm" until "load"
============================================================
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
        - heading "Signing up is easy!" [level=1] [ref=f1e45]
        - paragraph [ref=f1e46]: If you have an account with us you can sign-up for free instant online access. You will have to provide some personal information.
        - table [ref=f1e48]:
          - rowgroup [ref=f1e49]:
            - row [ref=f1e50]:
              - cell "First Name:" [ref=f1e51]
              - cell [ref=f1e52]:
                - textbox [ref=f1e53]
              - cell [ref=f1e54]
            - row [ref=f1e55]:
              - cell "Last Name:" [ref=f1e56]
              - cell [ref=f1e57]:
                - textbox [ref=f1e58]
              - cell [ref=f1e59]
            - row [ref=f1e60]:
              - cell "Address:" [ref=f1e61]
              - cell [ref=f1e62]:
                - textbox [ref=f1e63]
              - cell [ref=f1e64]
            - row [ref=f1e65]:
              - cell "City:" [ref=f1e66]
              - cell [ref=f1e67]:
                - textbox [ref=f1e68]
              - cell [ref=f1e69]
            - row [ref=f1e70]:
              - cell "State:" [ref=f1e71]
              - cell [ref=f1e72]:
                - textbox [ref=f1e73]
              - cell [ref=f1e74]
            - row [ref=f1e75]:
              - cell "Zip Code:" [ref=f1e76]
              - cell [ref=f1e77]:
                - textbox [ref=f1e78]
              - cell [ref=f1e79]
            - row [ref=f1e80]:
              - 'cell "Phone #:" [ref=f1e81]'
              - cell [ref=f1e82]:
                - textbox [ref=f1e83]
              - cell [ref=f1e84]
            - row [ref=f1e85]:
              - cell "SSN:" [ref=f1e86]
              - cell [ref=f1e87]:
                - textbox [ref=f1e88]
              - cell [ref=f1e89]
            - row [ref=f1e90]:
              - cell [ref=f1e91]
            - row [ref=f1e92]:
              - cell "Username:" [ref=f1e93]
              - cell [ref=f1e94]:
                - textbox [ref=f1e95]
              - cell [ref=f1e96]
            - row [ref=f1e97]:
              - cell "Password:" [ref=f1e98]
              - cell [ref=f1e99]:
                - textbox [ref=f1e100]
              - cell [ref=f1e101]
            - row [ref=f1e102]:
              - cell "Confirm:" [ref=f1e103]
              - cell [ref=f1e104]:
                - textbox [ref=f1e105]
              - cell [ref=f1e106]
            - row [ref=f1e107]:
              - cell [ref=f1e108]
              - cell [ref=f1e109]:
                - button "Register" [ref=f1e110] [cursor=pointer]
  - generic [ref=f1e112]:
    - list [ref=f1e113]:
      - listitem [ref=f1e114]:
        - link "Home" [ref=f1e115] [cursor=pointer]:
          - /url: index.htm
        - text: "|"
      - listitem [ref=f1e116]:
        - link "About Us" [ref=f1e117] [cursor=pointer]:
          - /url: about.htm
        - text: "|"
      - listitem [ref=f1e118]:
        - link "Services" [ref=f1e119] [cursor=pointer]:
          - /url: services.htm
        - text: "|"
      - listitem [ref=f1e120]:
        - link "Products" [ref=f1e121] [cursor=pointer]:
          - /url: http://www.parasoft.com/jsp/products.jsp
        - text: "|"
      - listitem [ref=f1e122]:
        - link "Locations" [ref=f1e123] [cursor=pointer]:
          - /url: http://www.parasoft.com/jsp/pr/contacts.jsp
        - text: "|"
      - listitem [ref=f1e124]:
        - link "Site Map" [ref=f1e125] [cursor=pointer]:
          - /url: sitemap.htm
        - text: "|"
      - listitem [ref=f1e126]:
        - link "Contact Us" [ref=f1e127] [cursor=pointer]:
          - /url: contact.htm
    - paragraph [ref=f1e128]: © Parasoft. All rights reserved.
    - list [ref=f1e129]:
      - listitem [ref=f1e130]: "Visit us at:"
      - listitem [ref=f1e131]:
        - link "www.parasoft.com" [ref=f1e132] [cursor=pointer]:
          - /url: http://www.parasoft.com/
```

# Test source

```ts
  1  | import { Locator, Page } from '@playwright/test';
  2  | 
  3  | export type RegisterData = {
  4  |     firstname: string;
  5  |     lastname: string;
  6  |     address: string;
  7  |     city: string;
  8  |     state: string;
  9  |     zipCode: string;
  10 |     phone: string;
  11 |     ssn: string;
  12 |     username: string;
  13 |     password: string;
  14 |     confirmPassword: string;
  15 | };
  16 | 
  17 | export class ProfilePage {
  18 |     readonly page: Page;
  19 |     readonly loginUrl = 'index.htm';
  20 |     readonly registerNavLink: Locator;
  21 |     readonly firstname: Locator;
  22 |     readonly lastname: Locator;
  23 |     readonly address: Locator;
  24 |     readonly city: Locator;
  25 |     readonly state: Locator;
  26 |     readonly zipCode: Locator;
  27 |     readonly phone: Locator;
  28 |     readonly ssn: Locator;
  29 |     readonly username: Locator;
  30 |     readonly password: Locator;
  31 |     readonly confirmPassword: Locator;
  32 |     readonly registerBtn: Locator;
  33 |     readonly welcomeMessage: Locator;
  34 |     readonly registerErrorMessages: Locator;
  35 |     readonly accountColumnHeader: Locator;
  36 |     readonly balanceColumnHeader: Locator;
  37 |     readonly availableAmountColumnHeader: Locator;
  38 |     readonly accountsOverviewHeading: Locator;
  39 |     readonly tableTotalAmount: Locator;
  40 | 
  41 |     constructor(page: Page) {
  42 |         this.page = page;
  43 |         this.registerNavLink = page.getByRole('link', { name: 'Register' });
  44 |         this.firstname = page.locator('[id = "customer.firstName"]');
  45 |         this.lastname = page.locator('[id = "customer.lastName"]');
  46 |         this.address = page.locator('[id = "customer.address.street"]');
  47 |         this.city = page.locator('[id = "customer.address.city"]');
  48 |         this.state = page.locator('[id = "customer.address.state"]');
  49 |         this.zipCode = page.locator('[id = "customer.address.zipCode"]');
  50 |         this.phone = page.locator('[id = "customer.phoneNumber"]');
  51 |         this.ssn = page.locator('[id = "customer.ssn"]');
  52 |         this.username = page.locator('[id = "customer.username"]');
  53 |         this.password = page.locator('[id = "customer.password"]');
  54 |         this.confirmPassword = page.locator('#repeatedPassword');
  55 |         this.registerBtn = page.getByRole('button', { name: "Register" });
  56 |         this.welcomeMessage = page.getByText('Your account was created');
  57 |         this.registerErrorMessages = page.locator('#customerForm span.error');
  58 |         this.accountColumnHeader = page.getByRole('columnheader', { name: 'Account' });
  59 |         this.balanceColumnHeader = page.getByRole('columnheader', { name: 'Balance' });
  60 |         this.availableAmountColumnHeader = page.getByRole('columnheader', { name: 'Available Amount' });
  61 |         this.accountsOverviewHeading = page.getByRole('heading', { name: 'Accounts Overview' });
  62 |         this.tableTotalAmount = page.getByRole('cell', { name: 'Total' });
  63 |     }
  64 | 
  65 |     async navigate(): Promise<void> {
  66 |         await this.page.goto(this.loginUrl);
  67 |     }
  68 | 
  69 |     async clickRegisterLink(): Promise<void> {
  70 |         await this.registerNavLink.click();
> 71 |         await this.page.waitForURL('**/register.htm');
     |                         ^ Error: page.waitForURL: Test timeout of 30000ms exceeded.
  72 |         await this.firstname.waitFor({ state: 'visible' });
  73 |     }
  74 | 
  75 |     async fillRegisterCredentials(data: RegisterData): Promise<void> {
  76 |         await this.firstname.fill(data.firstname);
  77 |         await this.lastname.fill(data.lastname);
  78 |         await this.address.fill(data.address);
  79 |         await this.city.fill(data.city);
  80 |         await this.state.fill(data.state);
  81 |         await this.zipCode.fill(data.zipCode);
  82 |         await this.phone.fill(data.phone);
  83 |         await this.ssn.fill(data.ssn);
  84 |         await this.username.fill(data.username);
  85 |         await this.password.fill(data.password);
  86 |         await this.confirmPassword.fill(data.confirmPassword);
  87 |     }
  88 | 
  89 |     async clickRegisterBtn(): Promise<void> {
  90 |         await this.registerBtn.click();
  91 |     }
  92 | 
  93 |     getErrorMessage(message?: string): Locator {
  94 |         return message
  95 |             ? this.registerErrorMessages.filter({ hasText: message })
  96 |             : this.registerErrorMessages;
  97 |     }
  98 | }
  99 | 
```