# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: api\accounts.api.spec.ts >> TC-AUTH-API-009 SQL injection payload in login
- Location: tests\api\accounts.api.spec.ts:106:5

# Error details

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: 400
Received: 403
```

# Test source

```ts
  13  |     expect(responseBody.firstName).toBe('John');
  14  |     expect(responseBody.address.state).toBe('CA');
  15  | 
  16  | });
  17  | 
  18  | test('Validate login JSON response schema', async({request}) =>{
  19  |     const authApi = new AuthApi(request);
  20  |     const response = await authApi.login(process.env.TEST_USERNAME!, process.env.TEST_PASSWORD!);
  21  |     const responseBody = await response.json();
  22  |     
  23  |     expect(response.status()).toBe(200);
  24  |     expect(responseBody.id).toBeDefined();
  25  |     expect(responseBody.firstName).toBeDefined();
  26  |     expect(responseBody.lastName).toBeDefined();
  27  |     expect(responseBody.address).toBeDefined();
  28  |     expect(responseBody.phoneNumber).toBeDefined();
  29  |     expect(responseBody.ssn).toBeDefined();
  30  | 
  31  | });
  32  | 
  33  | test('Validate response headers', async({request}) =>{
  34  |     const authApi = new AuthApi(request);
  35  |     const response = await authApi.login(process.env.TEST_USERNAME!, process.env.TEST_PASSWORD!);
  36  | 
  37  |     const headers = response.headers();
  38  | 
  39  |     expect(headers['content-type']).toContain('application/json')
  40  | 
  41  | });
  42  | 
  43  | test('Content negotiation for XML', async({request}) =>{
  44  |     const authApi = new AuthApi(request);
  45  |     const response = await authApi.login('john', 'demo', 'application/xml');
  46  | 
  47  |     expect(response.status()).toBe(200);
  48  | 
  49  |     const responseHeader = await response.headers()['content-type'];
  50  |     
  51  |     expect(responseHeader).toContain('xml');
  52  | 
  53  |     const xmlBody = await response.text();
  54  | 
  55  |     expect(xmlBody).toContain('<customer>');
  56  |     expect(xmlBody).toContain('</customer>');
  57  |     expect(xmlBody).toContain('<id>12212</id>');
  58  | 
  59  | });
  60  | 
  61  | test('Login response latency SLA', async({request}) =>{
  62  |     const authApi = new AuthApi(request);
  63  |     const startTime = performance.now();
  64  |     const response = await authApi.login('john', 'demo');
  65  | 
  66  |     expect(response.status()).toBe(200);
  67  |     
  68  |     const duration = performance.now() - startTime
  69  | 
  70  |     expect(duration).toBeLessThan(2000);
  71  | 
  72  | });
  73  | 
  74  | test('Login with unknown username', async({request}) =>{
  75  |     const authApi = new AuthApi(request);
  76  |     const response = await authApi.login('fake_user_999', 'demo');
  77  | 
  78  |     expect(response.status()).toBe(400);
  79  | 
  80  |     const errorText = await response.text();
  81  |     
  82  |     expect(errorText).toContain('Invalid username and/or password');
  83  | 
  84  | });
  85  | 
  86  | test('Login with incorrect password', async({request}) =>{
  87  |     const authApi = new AuthApi(request);
  88  |     const response = await authApi.login('john', 'WrongPassword!');
  89  | 
  90  |     expect(response.status()).toBe(400);
  91  | 
  92  |     const errorText = await response.text();
  93  | 
  94  |     expect(errorText).toContain('Invalid username and/or password');
  95  | 
  96  | });
  97  | 
  98  | test('Login with missing credentials', async({request}) => {
  99  |     const authApi = new AuthApi(request);
  100 |     const response = await authApi.login('','');
  101 | 
  102 |     expect(response.status()).toBe(404);
  103 | 
  104 | });
  105 | 
  106 | test('TC-AUTH-API-009 SQL injection payload in login', async ({ request }) => {
  107 |     const authApi = new AuthApi(request);
  108 | 
  109 |     const sqlPayload = encodeURIComponent("' OR '1'='1");
  110 | 
  111 |     const response = await authApi.login(sqlPayload, 'demo');
  112 | 
> 113 |     expect(response.status()).toBe(400);
      |                               ^ Error: expect(received).toBe(expected) // Object.is equality
  114 | 
  115 |     const responseText = await response.text();
  116 | 
  117 |     expect(responseText).not.toContain('SQL');
  118 |     expect(responseText).not.toContain('SQLException');
  119 |     expect(responseText).not.toContain('Exception');
  120 |     expect(responseText).not.toContain('syntax error');
  121 | });
  122 | 
  123 | test('Method Not Allowed validation', async({request}) =>{
  124 |     const authApi = new AuthApi(request);
  125 |     const response = await request.post('https://parabank.parasoft.com/parabank/services/bank/john/demo')
  126 | 
  127 |     expect(response.status()).toBe(405);
  128 |     expect(response.status()).not.toBe(200);
  129 | 
  130 | });
  131 | 
```