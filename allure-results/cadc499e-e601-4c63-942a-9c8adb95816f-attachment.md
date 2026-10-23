# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: ui\profile.spec.ts >> Duplicate username registration
- Location: tests\ui\profile.spec.ts:69:5

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.click: Test timeout of 30000ms exceeded.
Call log:
  - waiting for getByRole('link', { name: 'Register' })

```

# Page snapshot

```yaml
- generic [active] [ref=f2e1]:
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
        - paragraph [ref=f2e29]: Welcome John Doe
        - heading "Account Services" [level=2] [ref=f2e30]
        - list [ref=f2e31]:
          - listitem [ref=f2e32]:
            - link "Open New Account" [ref=f2e33] [cursor=pointer]:
              - /url: openaccount.htm
          - listitem [ref=f2e34]:
            - link "Accounts Overview" [ref=f2e35] [cursor=pointer]:
              - /url: overview.htm
          - listitem [ref=f2e36]:
            - link "Transfer Funds" [ref=f2e37] [cursor=pointer]:
              - /url: transfer.htm
          - listitem [ref=f2e38]:
            - link "Bill Pay" [ref=f2e39] [cursor=pointer]:
              - /url: billpay.htm
          - listitem [ref=f2e40]:
            - link "Find Transactions" [ref=f2e41] [cursor=pointer]:
              - /url: findtrans.htm
          - listitem [ref=f2e42]:
            - link "Update Contact Info" [ref=f2e43] [cursor=pointer]:
              - /url: updateprofile.htm
          - listitem [ref=f2e44]:
            - link "Request Loan" [ref=f2e45] [cursor=pointer]:
              - /url: requestloan.htm
          - listitem [ref=f2e46]:
            - link "Log Out" [ref=f2e47] [cursor=pointer]:
              - /url: logout.htm
      - generic [ref=f2e48]:
        - heading "Welcome user_690360" [level=1] [ref=f2e49]
        - paragraph [ref=f2e50]: Your account was created successfully. You are now logged in.
  - generic [ref=f2e52]:
    - list [ref=f2e53]:
      - listitem [ref=f2e54]:
        - link "Home" [ref=f2e55] [cursor=pointer]:
          - /url: index.htm
        - text: "|"
      - listitem [ref=f2e56]:
        - link "About Us" [ref=f2e57] [cursor=pointer]:
          - /url: about.htm
        - text: "|"
      - listitem [ref=f2e58]:
        - link "Services" [ref=f2e59] [cursor=pointer]:
          - /url: services.htm
        - text: "|"
      - listitem [ref=f2e60]:
        - link "Products" [ref=f2e61] [cursor=pointer]:
          - /url: http://www.parasoft.com/jsp/products.jsp
        - text: "|"
      - listitem [ref=f2e62]:
        - link "Locations" [ref=f2e63] [cursor=pointer]:
          - /url: http://www.parasoft.com/jsp/pr/contacts.jsp
        - text: "|"
      - listitem [ref=f2e64]:
        - link "Site Map" [ref=f2e65] [cursor=pointer]:
          - /url: sitemap.htm
        - text: "|"
      - listitem [ref=f2e66]:
        - link "Contact Us" [ref=f2e67] [cursor=pointer]:
          - /url: contact.htm
    - paragraph [ref=f2e68]: © Parasoft. All rights reserved.
    - list [ref=f2e69]:
      - listitem [ref=f2e70]: "Visit us at:"
      - listitem [ref=f2e71]:
        - link "www.parasoft.com" [ref=f2e72] [cursor=pointer]:
          - /url: http://www.parasoft.com/
```

# Test source

```ts
  1  | import {Locator, Page} from '@playwright/test';
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
  35 | 
  36 |     constructor(page: Page){
  37 |         this.page = page;
  38 |         this.registerNavLink = page.getByRole('link', {name: 'Register'});
  39 |         this.firstname = page.locator('[id = "customer.firstName"]');
  40 |         this.lastname = page.locator('[id = "customer.lastName"]');
  41 |         this.address = page.locator('[id = "customer.address.street"]');
  42 |         this.city = page.locator('[id = "customer.address.city"]');
  43 |         this.state = page.locator('[id = "customer.address.state"]');
  44 |         this.zipCode = page.locator('[id = "customer.address.zipCode"]');
  45 |         this.phone = page.locator('[id = "customer.phoneNumber"]');
  46 |         this.ssn = page.locator('[id = "customer.ssn"]');
  47 |         this.username = page.locator('[id = "customer.username"]');
  48 |         this.password = page.locator('[id = "customer.password"]');
  49 |         this.confirmPassword = page.locator('#repeatedPassword');
  50 |         this.registerBtn = page.getByRole('button', {name: "Register"});
  51 |         this.welcomeMessage = page.getByText('Your account was created');
  52 |         this.registerErrorMessages = page.locator('#customerForm span.error');
  53 | 
  54 |     }
  55 | 
  56 |     async navigate(): Promise<void>{
  57 |         await this.page.goto(this.loginUrl);
  58 | 
  59 |     }
  60 | 
  61 |     async clickRegisterLink(): Promise<void>{
> 62 |         await this.registerNavLink.click();
     |                                    ^ Error: locator.click: Test timeout of 30000ms exceeded.
  63 | 
  64 |     }
  65 | 
  66 |     async fillRegisterCredentials(data: RegisterData): Promise<void>{
  67 |         await this.firstname.fill(data.firstname);
  68 |         await this.lastname.fill(data.lastname);
  69 |         await this.address.fill(data.address);
  70 |         await this.city.fill(data.city);
  71 |         await this.state.fill(data.state);
  72 |         await this.zipCode.fill(data.zipCode);
  73 |         await this.phone.fill(data.phone);
  74 |         await this.ssn.fill(data.ssn);
  75 |         await this.username.fill(data.username);
  76 |         await this.password.fill(data.password);
  77 |         await this.confirmPassword.fill(data.confirmPassword);
  78 | 
  79 |     }
  80 | 
  81 |     async clickRegisterBtn(): Promise<void>{
  82 |         await this.registerBtn.click();
  83 | 
  84 |     }
  85 | 
  86 | }
```