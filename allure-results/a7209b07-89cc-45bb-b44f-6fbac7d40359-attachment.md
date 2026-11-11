# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: api\accounts.api.spec.ts >> TC-ACC-API-015 Create account using another user's funds
- Location: tests\api\accounts.api.spec.ts:212:5

# Error details

```
Error: expect(received).toContain(expected) // indexOf

Expected value: 429
Received array: [400, 403, 404, 200]
```

# Test source

```ts
  127 |     const newAccountId = newAccount.id;
  128 | 
  129 |     // 2. Fetch all accounts for this customer: GET /customers/{id}/accounts
  130 |     const accountsRes = await accountApi.getCustomerAccounts(customerId);
  131 |     expect(accountsRes.status()).toBe(200);
  132 |     const accounts = await accountsRes.json();
  133 | 
  134 |     // 3. Verify new account ID is present in the customer's account list
  135 |     const isPresent = accounts.some((account: { id: number }) => account.id === newAccountId);
  136 |     expect(isPresent).toBe(true);
  137 | });
  138 | 
  139 | test('TC-ACC-API-009 Balance decimal precision', async ({ request }) => {
  140 |     // 1. Initialize API client for account endpoints
  141 |     const accountApi = new AccountApi(request);
  142 | 
  143 |     // 2. Fetch details for account 13344
  144 |     const response = await accountApi.getAccount(13344);
  145 |     expect(response.status()).toBe(200);
  146 | 
  147 |     // 3. Parse JSON response and ensure balance property exists
  148 |     const account = await response.json();
  149 |     expect(account.balance).toBeDefined();
  150 | 
  151 |     // 4. Extract number of decimal digits after '.' (e.g. 500.25 -> 2 digits)
  152 |     const decimals = account.balance.toString().split('.')[1]?.length || 0;
  153 | 
  154 |     // 5. Assert currency satisfies standard 2-decimal precision
  155 |     expect(decimals).toBeLessThanOrEqual(2);
  156 | });
  157 | 
  158 | test('TC-ACC-API-010 Get non-existent account ID', async ({ request }) => {
  159 |     const accountApi = new AccountApi(request);
  160 | 
  161 |     // 1. Request an account ID that does not exist in the database (999999999)
  162 |     const response = await accountApi.getAccount(999999999);
  163 | 
  164 |     // 2. Assert server returns Client Error (400 Bad Request or 404 Not Found)
  165 |     expect([400, 404]).toContain(response.status());
  166 | 
  167 |     // 3. Verify user-friendly error message is returned in the response body
  168 |     const errorBody = await response.text();
  169 |     expect(errorBody).toContain('Could not find account #999999999');
  170 | });
  171 | 
  172 | test('TC-ACC-API-011 Get account with non-numeric ID', async ({ request }) => {
  173 |     const accountApi = new AccountApi(request);
  174 | 
  175 |     // 1. Pass a string 'invalid_id' instead of a numeric ID
  176 |     const response = await accountApi.getAccount('invalid_id');
  177 | 
  178 |     // 2. Expect 400 Bad Request or 404 Not Found from endpoint routing
  179 |     expect([400, 404]).toContain(response.status());
  180 | });
  181 | 
  182 | test('TC-ACC-API-012 Get accounts for non-existent customer', async ({ request }) => {
  183 |     const accountApi = new AccountApi(request);
  184 | 
  185 |     // 1. Call GET /customers/999999999/accounts with non-existent customer ID
  186 |     const response = await accountApi.getCustomerAccounts(999999999);
  187 | 
  188 |     // 2. Expect 400 or 404 client error
  189 |     expect([400, 404]).toContain(response.status());
  190 | });
  191 | 
  192 | test('TC-ACC-API-013 Create account with invalid type code', async ({ request }) => {
  193 |     const accountApi = new AccountApi(request);
  194 | 
  195 |     // 1. Call POST /createAccount with newAccountType = 99
  196 |     const response = await accountApi.createAccount(12212, 99, 13344);
  197 | 
  198 |     // 2. Server must reject invalid type (400 Bad Request or 500 error)
  199 |     expect([400, 500]).toContain(response.status());
  200 | });
  201 | 
  202 | test('TC-ACC-API-014 Create account missing parameters', async ({ request }) => {
  203 |     const accountApi = new AccountApi(request);
  204 | 
  205 |     // 1. Call endpoint without passing any parameters
  206 |     const response = await accountApi.createAccount();
  207 | 
  208 |     // 2. Expect client/server rejection due to missing required arguments
  209 |     expect([400, 500]).toContain(response.status());
  210 | });
  211 | 
  212 | test('TC-ACC-API-015 Create account using another user\'s funds', async ({ request }) => {
  213 |     const accountApi = new AccountApi(request);
  214 | 
  215 |     // 1. Customer 12212 attempts to fund an account using a foreign/unowned account (999999999)
  216 |     const response = await accountApi.createAccount(12212, 0, 999999999);
  217 | 
  218 |     // 2. If the demo system accepts this, record a known-defect annotation in test results
  219 |     if (response.status() === 200) {
  220 |         test.info().annotations.push({
  221 |             type: 'known-defect',
  222 |             description: 'AUT accepts createAccount using unverified / foreign fromAccountId funds.'
  223 |         });
  224 |     }
  225 | 
  226 |     // 3. Expected status code (production standard is 4xx rejection)
> 227 |     expect([400, 403, 404, 200]).toContain(response.status());
      |                                  ^ Error: expect(received).toContain(expected) // indexOf
  228 | });
  229 | 
  230 | test('TC-ACC-API-016 Unauthorized accounts request', async ({ request }) => {
  231 |     const accountApi = new AccountApi(request);
  232 | 
  233 |     // 1. Send GET request without session cookies or authorization tokens
  234 |     const response = await accountApi.getCustomerAccounts(12212);
  235 | 
  236 |     // 2. Document as known defect if public demo leaves endpoints unprotected
  237 |     if (response.status() === 200) {
  238 |         test.info().annotations.push({
  239 |             type: 'known-defect',
  240 |             description: 'ParaBank REST API does not enforce session or authentication token verification.'
  241 |         });
  242 |     }
  243 | 
  244 |     // 3. Assert status code (401 standard or 200 for public demo)
  245 |     expect([401, 200]).toContain(response.status());
  246 | });
  247 | 
  248 | test('TC-ACC-API-017 Accounts API response headers & SLA', async ({ request }) => {
  249 |     const accountApi = new AccountApi(request);
  250 | 
  251 |     // 1. Measure latency with high-resolution timer
  252 |     const startTime = performance.now();
  253 |     const response = await accountApi.getAccount(13344);
  254 |     const duration = performance.now() - startTime;
  255 | 
  256 |     // 2. Validate HTTP 200 OK
  257 |     expect(response.status()).toBe(200);
  258 | 
  259 |     // 3. Validate header contract: Content-Type must be application/json
  260 |     expect(response.headers()['content-type']).toContain('application/json');
  261 | 
  262 |     // 4. Assert response latency meets SLA (< 2000 ms)
  263 |     expect(duration).toBeLessThan(2000);
  264 | });
  265 | 
  266 | test('TC-LOAN-API-001 Request loan – approved API', async ({ request }) => {
  267 |     const accountApi = new AccountApi(request);
  268 | 
  269 |     // 1. Submit loan request: amount = $500, downPayment = $50 from account 13344
  270 |     const response = await accountApi.requestLoan(12212, 500, 50, 13344);
  271 | 
  272 |     // 2. Assert 200 OK response
  273 |     expect(response.status()).toBe(200);
  274 | 
  275 |     // 3. Verify loan response fields: approved must be true and new LOAN account ID created
  276 |     const loanData = await response.json();
  277 |     expect(loanData.approved).toBe(true);
  278 |     expect(loanData.accountId).toBeDefined();
  279 | });
  280 | 
  281 | test('TC-LOAN-API-002 Request loan – denied API', async ({ request }) => {
  282 |     const accountApi = new AccountApi(request);
  283 | 
  284 |     // 1. Submit loan request with huge down payment exceeding balance ($9,000,000)
  285 |     const response = await accountApi.requestLoan(12212, 10000000, 9000000, 13344);
  286 | 
  287 |     // 2. Assert 200 OK response
  288 |     expect(response.status()).toBe(200);
  289 | 
  290 |     // 3. Verify loan is rejected due to credit risk
  291 |     const loanData = await response.json();
  292 |     expect(loanData.approved).toBe(false);
  293 | });
  294 | 
```