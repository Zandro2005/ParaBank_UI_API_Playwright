# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: ui\profile.spec.ts >> Login with freshly registered user
- Location: tests\ui\profile.spec.ts:96:5

# Error details

```
Error: expect(locator).toHaveText(expected) failed

Locator:  getByText('Your account was created')
Expected: "Your account was created"
Received: "Your account was created successfully. You are now logged in."
Timeout:  5000ms

Call log:
  - Expect "toHaveText" getByText('Your account was created') with timeout 5000ms
  - waiting for getByText('Your account was created')
    14 × locator resolved to <p>Your account was created successfully. You are no…</p>
       - unexpected value "Your account was created successfully. You are now logged in."

```

```yaml
- paragraph: Your account was created successfully. You are now logged in.
```

# Test source

```ts
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
  38  |     await expect(profilePage.registerErrorMessages.first()).toBeVisible();
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
  63  |     await profilePage.clickRegisterBtn();
  64  | 
  65  |     await expect(profilePage.registerErrorMessages).toHaveText('Passwords did not match.');
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
  90  |     await profilePage.clickRegisterBtn();
  91  |   
  92  |     await expect(profilePage.registerErrorMessages).toHaveText('This username already exists.');
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
  120 |     await profilePage.clickRegisterBtn();
  121 | 
> 122 |     await expect(profilePage.welcomeMessage).toHaveText('Your account was created');
      |                                              ^ Error: expect(locator).toHaveText(expected) failed
  123 | 
  124 | });
  125 | 
  126 | 
```