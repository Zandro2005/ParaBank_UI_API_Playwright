# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: api\accounts.api.spec.ts >> Minimum opening deposit debit/credit
- Location: tests\api\accounts.api.spec.ts:87:5

# Error details

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: 100
Received: 200
```

# Test source

```ts
  9   |     // 2. Fetch all accounts belonging to customer ID 12212
  10  |     const response = await accountApi.getCustomerAccounts(12212);
  11  | 
  12  |     // 3. Verify server responds with HTTP 200 OK
  13  |     expect(response.status()).toBe(200);
  14  | });
  15  | 
  16  | test('Validate account schema & data types', async ({ request }) => {
  17  |     const accountApi = new AccountApi(request);
  18  |     const response = await accountApi.getCustomerAccounts(12212);
  19  |     const responsebody = await response.json();
  20  | 
  21  |     // 1. Confirm HTTP 200 OK
  22  |     expect(response.status()).toBe(200);
  23  | 
  24  |     // 2. Validate essential contract fields exist on the first account object
  25  |     expect(responsebody[0].id).toBeDefined();
  26  |     expect(responsebody[0].customerId).toBeDefined();
  27  |     expect(responsebody[0].type).toBeDefined();
  28  |     expect(responsebody[0].balance).toBeDefined();
  29  | });
  30  | 
  31  | test('Get account details by ID', async ({ request }) => {
  32  |     const accountApi = new AccountApi(request);
  33  | 
  34  |     // 1. Request details for account 13344
  35  |     const response = await accountApi.getAccount(13344);
  36  |     const responsebody = await response.json();
  37  |     const requestId = responsebody.id;
  38  | 
  39  |     // 2. Assert HTTP 200 OK and that returned ID equals requested account
  40  |     expect(response.status()).toBe(200);
  41  |     expect(responsebody.id).toEqual(requestId);
  42  | });
  43  | 
  44  | test('Verify customer account ownership', async ({ request }) => {
  45  |     const accountApi = new AccountApi(request);
  46  |     const customerID = 12212;
  47  | 
  48  |     // 1. Fetch accounts for customer 12212
  49  |     const response = await accountApi.getCustomerAccounts(customerID);
  50  |     const responsebody = await response.json();
  51  | 
  52  |     // 2. Assert HTTP 200 OK and verify ownership link
  53  |     expect(response.status()).toBe(200);
  54  |     expect(customerID).toEqual(responsebody[0].customerId);
  55  | });
  56  | 
  57  | test('Create CHECKING account via API', async ({ request }) => {
  58  |     const accountApi = new AccountApi(request);
  59  |     const customerId = 12212;
  60  |     const accountType = 0; // 0 = CHECKING
  61  |     const accountId = 13344; // Funding account
  62  | 
  63  |     // 1. Send create account request
  64  |     const response = await accountApi.createAccount(customerId, accountType, accountId);
  65  |     const responsebody = await response.json();
  66  | 
  67  |     // 2. Assert HTTP 200 OK and verify the created type is CHECKING
  68  |     expect(response.status()).toBe(200);
  69  |     expect(responsebody.type).toBe('CHECKING');
  70  | });
  71  | 
  72  | test('Create SAVINGS account via API', async ({ request }) => {
  73  |     const accountApi = new AccountApi(request);
  74  |     const customerId = 12212;
  75  |     const accountType = 1; // 1 = SAVINGS
  76  |     const accountId = 13344; // Funding account
  77  | 
  78  |     // 1. Send create account request
  79  |     const response = await accountApi.createAccount(customerId, accountType, accountId);
  80  |     const responsebody = await response.json();
  81  | 
  82  |     // 2. Assert HTTP 200 OK and verify the created type is SAVINGS
  83  |     expect(response.status()).toBe(200);
  84  |     expect(responsebody.type).toBe('SAVINGS');
  85  | });
  86  | 
  87  | test('Minimum opening deposit debit/credit', async ({ request }) => {
  88  |     const accountApi = new AccountApi(request);
  89  |     const customerId = 12212;
  90  |     const sourceAccountId = 13344;
  91  | 
  92  |     // 1. Record initial source account balance
  93  |     const initialSourceRes = await accountApi.getAccount(sourceAccountId);
  94  |     const initialBalance = (await initialSourceRes.json()).balance;
  95  | 
  96  |     // 2. Create new checking account funded by source account
  97  |     const createRes = await accountApi.createAccount(customerId, 0, sourceAccountId);
  98  |     expect(createRes.status()).toBe(200);
  99  |     const createdAccount = await createRes.json();
  100 |     const newAccountId = createdAccount.id;
  101 | 
  102 |     // 3. Fetch updated source account balance and new account balance
  103 |     const updatedSourceRes = await accountApi.getAccount(sourceAccountId);
  104 |     const updatedSourceBalance = (await updatedSourceRes.json()).balance;
  105 |     const newAccountRes = await accountApi.getAccount(newAccountId);
  106 |     const newAccountBalance = (await newAccountRes.json()).balance;
  107 | 
  108 |     // 4. Assert opening deposit ($100) was deducted from source account
> 109 |     expect(Math.abs(updatedSourceBalance - initialBalance)).toBe(100.00);
      |                                                             ^ Error: expect(received).toBe(expected) // Object.is equality
  110 | 
  111 |     // 5. Assert new account starts with exactly the $100 opening deposit
  112 |     expect(Math.abs(newAccountBalance)).toBe(100.00);
  113 | });
  114 | 
  115 | test('Newly created account in list', async ({ request }) => {
  116 |     const accountApi = new AccountApi(request);
  117 |     const customerId = 12212;
  118 |     const sourceAccountId = 13344;
  119 | 
  120 |     // 1. Create a new account (0 = CHECKING)
  121 |     const createRes = await accountApi.createAccount(customerId, 0, sourceAccountId);
  122 |     expect(createRes.status()).toBe(200);
  123 |     const newAccount = await createRes.json();
  124 |     const newAccountId = newAccount.id;
  125 | 
  126 |     // 2. Fetch all accounts for this customer: GET /customers/{id}/accounts
  127 |     const accountsRes = await accountApi.getCustomerAccounts(customerId);
  128 |     expect(accountsRes.status()).toBe(200);
  129 |     const accounts = await accountsRes.json();
  130 | 
  131 |     // 3. Verify new account ID is present in the customer's account list
  132 |     const isPresent = accounts.some((account: { id: number }) => account.id === newAccountId);
  133 |     expect(isPresent).toBe(true);
  134 | });
  135 | 
  136 | test('TC-ACC-API-009 Balance decimal precision', async ({ request }) => {
  137 |     // 1. Initialize API client for account endpoints
  138 |     const accountApi = new AccountApi(request);
  139 | 
  140 |     // 2. Fetch details for account 13344
  141 |     const response = await accountApi.getAccount(13344);
  142 |     expect(response.status()).toBe(200);
  143 | 
  144 |     // 3. Parse JSON response and ensure balance property exists
  145 |     const account = await response.json();
  146 |     expect(account.balance).toBeDefined();
  147 | 
  148 |     // 4. Extract number of decimal digits after '.' (e.g. 500.25 -> 2 digits)
  149 |     const decimals = account.balance.toString().split('.')[1]?.length || 0;
  150 | 
  151 |     // 5. Assert currency satisfies standard 2-decimal precision
  152 |     expect(decimals).toBeLessThanOrEqual(2);
  153 | });
  154 | 
  155 | test('TC-ACC-API-010 Get non-existent account ID', async ({ request }) => {
  156 |     const accountApi = new AccountApi(request);
  157 | 
  158 |     // 1. Request an account ID that does not exist in the database (999999999)
  159 |     const response = await accountApi.getAccount(999999999);
  160 | 
  161 |     // 2. Assert server returns Client Error (400 Bad Request or 404 Not Found)
  162 |     expect([400, 404]).toContain(response.status());
  163 | 
  164 |     // 3. Verify user-friendly error message is returned in the response body
  165 |     const errorBody = await response.text();
  166 |     expect(errorBody).toContain('Could not find account #999999999');
  167 | });
  168 | 
  169 | test('TC-ACC-API-011 Get account with non-numeric ID', async ({ request }) => {
  170 |     const accountApi = new AccountApi(request);
  171 | 
  172 |     // 1. Pass a string 'invalid_id' instead of a numeric ID
  173 |     const response = await accountApi.getAccount('invalid_id');
  174 | 
  175 |     // 2. Expect 400 Bad Request or 404 Not Found from endpoint routing
  176 |     expect([400, 404]).toContain(response.status());
  177 | });
  178 | 
  179 | test('TC-ACC-API-012 Get accounts for non-existent customer', async ({ request }) => {
  180 |     const accountApi = new AccountApi(request);
  181 | 
  182 |     // 1. Call GET /customers/999999999/accounts with non-existent customer ID
  183 |     const response = await accountApi.getCustomerAccounts(999999999);
  184 | 
  185 |     // 2. Expect 400 or 404 client error
  186 |     expect([400, 404]).toContain(response.status());
  187 | });
  188 | 
  189 | test('TC-ACC-API-013 Create account with invalid type code', async ({ request }) => {
  190 |     const accountApi = new AccountApi(request);
  191 | 
  192 |     // 1. Call POST /createAccount with newAccountType = 99
  193 |     const response = await accountApi.createAccount(12212, 99, 13344);
  194 | 
  195 |     // 2. Server must reject invalid type (400 Bad Request or 500 error)
  196 |     expect([400, 500]).toContain(response.status());
  197 | });
  198 | 
  199 | test('TC-ACC-API-014 Create account missing parameters', async ({ request }) => {
  200 |     const accountApi = new AccountApi(request);
  201 | 
  202 |     // 1. Call endpoint without passing any parameters
  203 |     const response = await accountApi.createAccount();
  204 | 
  205 |     // 2. Expect client/server rejection due to missing required arguments
  206 |     expect([400, 500]).toContain(response.status());
  207 | });
  208 | 
  209 | test('TC-ACC-API-015 Create account using another user\'s funds', async ({ request }) => {
```