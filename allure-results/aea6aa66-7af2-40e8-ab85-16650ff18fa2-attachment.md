# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: api\accounts.api.spec.ts >> TC-ACC-API-015 Create account using another user's funds
- Location: tests\api\accounts.api.spec.ts:209:5

# Error details

```
Error: expect(received).toContain(expected) // indexOf

Expected value: 429
Received array: [400, 403, 404, 200]
```

# Test source

```ts
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
  210 |     const accountApi = new AccountApi(request);
  211 | 
  212 |     // 1. Customer 12212 attempts to fund an account using a foreign/unowned account (999999999)
  213 |     const response = await accountApi.createAccount(12212, 0, 999999999);
  214 | 
  215 |     // 2. If the demo system accepts this, record a known-defect annotation in test results
  216 |     if (response.status() === 200) {
  217 |         test.info().annotations.push({
  218 |             type: 'known-defect',
  219 |             description: 'AUT accepts createAccount using unverified / foreign fromAccountId funds.'
  220 |         });
  221 |     }
  222 | 
  223 |     // 3. Expected status code (production standard is 4xx rejection)
> 224 |     expect([400, 403, 404, 200]).toContain(response.status());
      |                                  ^ Error: expect(received).toContain(expected) // indexOf
  225 | });
  226 | 
  227 | test('TC-ACC-API-016 Unauthorized accounts request', async ({ request }) => {
  228 |     const accountApi = new AccountApi(request);
  229 | 
  230 |     // 1. Send GET request without session cookies or authorization tokens
  231 |     const response = await accountApi.getCustomerAccounts(12212);
  232 | 
  233 |     // 2. Document as known defect if public demo leaves endpoints unprotected
  234 |     if (response.status() === 200) {
  235 |         test.info().annotations.push({
  236 |             type: 'known-defect',
  237 |             description: 'ParaBank REST API does not enforce session or authentication token verification.'
  238 |         });
  239 |     }
  240 | 
  241 |     // 3. Assert status code (401 standard or 200 for public demo)
  242 |     expect([401, 200]).toContain(response.status());
  243 | });
  244 | 
  245 | test('TC-ACC-API-017 Accounts API response headers & SLA', async ({ request }) => {
  246 |     const accountApi = new AccountApi(request);
  247 | 
  248 |     // 1. Measure latency with high-resolution timer
  249 |     const startTime = performance.now();
  250 |     const response = await accountApi.getAccount(13344);
  251 |     const duration = performance.now() - startTime;
  252 | 
  253 |     // 2. Validate HTTP 200 OK
  254 |     expect(response.status()).toBe(200);
  255 | 
  256 |     // 3. Validate header contract: Content-Type must be application/json
  257 |     expect(response.headers()['content-type']).toContain('application/json');
  258 | 
  259 |     // 4. Assert response latency meets SLA (< 2000 ms)
  260 |     expect(duration).toBeLessThan(2000);
  261 | });
  262 | 
  263 | test('TC-LOAN-API-001 Request loan – approved API', async ({ request }) => {
  264 |     const accountApi = new AccountApi(request);
  265 | 
  266 |     // 1. Submit loan request: amount = $500, downPayment = $50 from account 13344
  267 |     const response = await accountApi.requestLoan(12212, 500, 50, 13344);
  268 | 
  269 |     // 2. Assert 200 OK response
  270 |     expect(response.status()).toBe(200);
  271 | 
  272 |     // 3. Verify loan response fields: approved must be true and new LOAN account ID created
  273 |     const loanData = await response.json();
  274 |     expect(loanData.approved).toBe(true);
  275 |     expect(loanData.accountId).toBeDefined();
  276 | });
  277 | 
  278 | test('TC-LOAN-API-002 Request loan – denied API', async ({ request }) => {
  279 |     const accountApi = new AccountApi(request);
  280 | 
  281 |     // 1. Submit loan request with huge down payment exceeding balance ($9,000,000)
  282 |     const response = await accountApi.requestLoan(12212, 10000000, 9000000, 13344);
  283 | 
  284 |     // 2. Assert 200 OK response
  285 |     expect(response.status()).toBe(200);
  286 | 
  287 |     // 3. Verify loan is rejected due to credit risk
  288 |     const loanData = await response.json();
  289 |     expect(loanData.approved).toBe(false);
  290 | });
  291 | 
```