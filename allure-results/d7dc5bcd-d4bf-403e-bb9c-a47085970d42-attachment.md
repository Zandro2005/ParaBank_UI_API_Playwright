# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: ui\profile.spec.ts >> View Accounts Overview table
- Location: tests\ui\profile.spec.ts:129:6

# Error details

```
Error: expect(received).toBeUndefined()

Received: {"_apiName": "Locator", "_frame": {"_guid": "frame@8f741878eebcb4a28ab462c2bd5858d3", "_type": "Frame"}, "_selector": "internal:role=cell[name=\"Total\"i]", Symbol(nodejs.util.inspect.custom): [Function anonymous]}
```

# Page snapshot

```yaml
- generic [active] [ref=f1e1]:
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
        - paragraph [ref=f1e29]: Welcome John Smith
        - heading "Account Services" [level=2] [ref=f1e30]
        - list [ref=f1e31]:
          - listitem [ref=f1e32]:
            - link "Open New Account" [ref=f1e33] [cursor=pointer]:
              - /url: openaccount.htm
          - listitem [ref=f1e34]:
            - link "Accounts Overview" [ref=f1e35] [cursor=pointer]:
              - /url: overview.htm
          - listitem [ref=f1e36]:
            - link "Transfer Funds" [ref=f1e37] [cursor=pointer]:
              - /url: transfer.htm
          - listitem [ref=f1e38]:
            - link "Bill Pay" [ref=f1e39] [cursor=pointer]:
              - /url: billpay.htm
          - listitem [ref=f1e40]:
            - link "Find Transactions" [ref=f1e41] [cursor=pointer]:
              - /url: findtrans.htm
          - listitem [ref=f1e42]:
            - link "Update Contact Info" [ref=f1e43] [cursor=pointer]:
              - /url: updateprofile.htm
          - listitem [ref=f1e44]:
            - link "Request Loan" [ref=f1e45] [cursor=pointer]:
              - /url: requestloan.htm
          - listitem [ref=f1e46]:
            - link "Log Out" [ref=f1e47] [cursor=pointer]:
              - /url: logout.htm
      - generic [ref=f1e50]:
        - heading "Accounts Overview" [level=1] [ref=f1e51]
        - table [ref=f1e52]:
          - rowgroup [ref=f1e53]:
            - row [ref=f1e54]:
              - columnheader "Account" [ref=f1e55]
              - columnheader "Balance*" [ref=f1e56]
              - columnheader "Available Amount" [ref=f1e57]
          - rowgroup [ref=f1e58]:
            - row [ref=f1e59]:
              - cell [ref=f1e60]:
                - link "13344" [ref=f1e61] [cursor=pointer]:
                  - /url: activity.htm?id=13344
              - cell "$5022.93" [ref=f1e62]
              - cell "$5022.93" [ref=f1e63]
            - row [ref=f1e64]:
              - cell "Total" [ref=f1e65]
              - cell "$5022.93" [ref=f1e66]
              - cell [ref=f1e67]
          - rowgroup [ref=f1e68]:
            - row [ref=f1e69]:
              - cell "*Balance includes deposits that may be subject to holds" [ref=f1e70]
  - generic [ref=f1e72]:
    - list [ref=f1e73]:
      - listitem [ref=f1e74]:
        - link "Home" [ref=f1e75] [cursor=pointer]:
          - /url: index.htm
        - text: "|"
      - listitem [ref=f1e76]:
        - link "About Us" [ref=f1e77] [cursor=pointer]:
          - /url: about.htm
        - text: "|"
      - listitem [ref=f1e78]:
        - link "Services" [ref=f1e79] [cursor=pointer]:
          - /url: services.htm
        - text: "|"
      - listitem [ref=f1e80]:
        - link "Products" [ref=f1e81] [cursor=pointer]:
          - /url: http://www.parasoft.com/jsp/products.jsp
        - text: "|"
      - listitem [ref=f1e82]:
        - link "Locations" [ref=f1e83] [cursor=pointer]:
          - /url: http://www.parasoft.com/jsp/pr/contacts.jsp
        - text: "|"
      - listitem [ref=f1e84]:
        - link "Site Map" [ref=f1e85] [cursor=pointer]:
          - /url: sitemap.htm
        - text: "|"
      - listitem [ref=f1e86]:
        - link "Contact Us" [ref=f1e87] [cursor=pointer]:
          - /url: contact.htm
    - paragraph [ref=f1e88]: © Parasoft. All rights reserved.
    - list [ref=f1e89]:
      - listitem [ref=f1e90]: "Visit us at:"
      - listitem [ref=f1e91]:
        - link "www.parasoft.com" [ref=f1e92] [cursor=pointer]:
          - /url: http://www.parasoft.com/
```

# Test source

```ts
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
  66  |     await expect(profilePage.registerErrorMessages).toHaveText('Passwords did not match.');
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
  129 | test.only('View Accounts Overview table', async({loginPage, page}) =>{
  130 |     const profilePage = new ProfilePage(page);
  131 |     await expect(profilePage.accountColumnHeader).toBeVisible();
  132 |     await expect(profilePage.balanceColumnHeader).toBeVisible();
  133 |     await expect(profilePage.availableAmountColumnHeader).toBeVisible();
> 134 |     await expect(profilePage.tableTotalAmount).toBeUndefined();
      |                                                ^ Error: expect(received).toBeUndefined()
  135 | 
  136 | });
  137 | 
  138 | 
```