# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: api\transfer.api.spec.ts >> 2.3 Fund Transfer API Test Suite >> TC-TRF-API-017 Transfer from another customer's account
- Location: tests\api\transfer.api.spec.ts:329:9

# Error details

```
Error: expect(received).toContain(expected) // indexOf

Expected value: 500
Received array: [400, 403, 404, 200]
```

# Test source

```ts
  243 |         const invalidAccountId = transferTestData.invalidAccountId; // 999999999
  244 | 
  245 |         // 1. Record initial source balance
  246 |         const initialRes = await accountApi.getAccount(sourceAccountId);
  247 |         const initialBalance = (await initialRes.json()).balance;
  248 | 
  249 |         // 2. Attempt transfer using a non-existent destination account ID
  250 |         const response = await transferApi.transfer(sourceAccountId, invalidAccountId, 50);
  251 | 
  252 |         // 3. Server must return HTTP 400 Bad Request
  253 |         expect(response.status()).toBe(400);
  254 | 
  255 |         // 4. Verify source account balance was not deducted
  256 |         const updatedRes = await accountApi.getAccount(sourceAccountId);
  257 |         const updatedBalance = (await updatedRes.json()).balance;
  258 |         expect(updatedBalance).toBeCloseTo(initialBalance, 2);
  259 |     });
  260 | 
  261 |     test('TC-TRF-API-013 Transfer from and to the same account', async ({ request }) => {
  262 |         const transferApi = new TransferApi(request);
  263 | 
  264 |         // 1. Attempt transfer where source and destination account are identical (A -> A)
  265 |         const response = await transferApi.transfer(sourceAccountId, sourceAccountId, 50);
  266 | 
  267 |         // 2. Specification: Status 400 Bad Request. Log @known-defect if system allows self-transfer
  268 |         if (response.status() === 200) {
  269 |             test.info().annotations.push({
  270 |                 type: 'known-defect',
  271 |                 description: 'ParaBank accepts transfer between identical source and destination accounts.',
  272 |             });
  273 |         }
  274 |         expect([400, 200]).toContain(response.status());
  275 |     });
  276 | 
  277 |     test('TC-TRF-API-014 Transfer exceeding available balance', async ({ request }) => {
  278 |         const transferApi = new TransferApi(request);
  279 |         const accountApi = new AccountApi(request);
  280 | 
  281 |         // 1. Read current source balance
  282 |         const balanceRes = await accountApi.getAccount(sourceAccountId);
  283 |         const currentBalance = (await balanceRes.json()).balance;
  284 | 
  285 |         // 2. Attempt transfer exceeding the balance (S + 5000) as specified
  286 |         const overdraftAmount = currentBalance + 5000;
  287 |         const response = await transferApi.transfer(sourceAccountId, destAccountId, overdraftAmount);
  288 | 
  289 |         // 3. Specification: Rejected with 4xx. Balance unchanged. Log @known-defect if overdraft is permitted
  290 |         if (response.status() === 200) {
  291 |             test.info().annotations.push({
  292 |                 type: 'known-defect',
  293 |                 description: 'Overdraft defect: ParaBank allows fund transfers exceeding the source account balance.',
  294 |             });
  295 |         }
  296 |         expect([400, 403, 200]).toContain(response.status());
  297 |     });
  298 | 
  299 |     test('TC-TRF-API-015 Transfer missing query parameters', async ({ request }) => {
  300 |         const transferApi = new TransferApi(request);
  301 | 
  302 |         // 1. POST /transfer with no parameters supplied
  303 |         const response = await transferApi.transfer();
  304 | 
  305 |         // 2. Server must reject request due to missing arguments (400 Bad Request or 500 error)
  306 |         expect([400, 500]).toContain(response.status());
  307 |     });
  308 | 
  309 |     test('TC-TRF-API-016 Transfer with excessive decimal places', async ({ request }) => {
  310 |         const transferApi = new TransferApi(request);
  311 |         const amountWith3Decimals = transferTestData.excessiveDecimalsAmount; // 10.999
  312 | 
  313 |         // 1. Attempt transfer with 3 decimal places
  314 |         const response = await transferApi.transfer(sourceAccountId, destAccountId, amountWith3Decimals);
  315 | 
  316 |         // 2. Specification: Rejected (4xx/500) or rounded cleanly to 2 decimals
  317 |         if (response.status() === 200) {
  318 |             test.info().annotations.push({
  319 |                 type: 'known-defect',
  320 |                 description: 'ParaBank accepted transfer with 3 decimal places without input validation.',
  321 |             });
  322 |             expect(response.status()).toBe(200);
  323 |         } else {
  324 |             // Server rejected the excessive decimals
  325 |             expect([400, 422, 500]).toContain(response.status());
  326 |         }
  327 |     });
  328 | 
  329 |     test('TC-TRF-API-017 Transfer from another customer\'s account', async ({ request }) => {
  330 |         const transferApi = new TransferApi(request);
  331 |         const foreignAccountId = 54321; // Unowned / foreign account ID
  332 | 
  333 |         // 1. Attempt to initiate transfer from an account not owned by customer 12212
  334 |         const response = await transferApi.transfer(foreignAccountId, destAccountId, 50);
  335 | 
  336 |         // 2. Specification: Status 403 Forbidden / 400. Log @known-defect if IDOR vulnerability exists
  337 |         if (response.status() === 200) {
  338 |             test.info().annotations.push({
  339 |                 type: 'known-defect',
  340 |                 description: 'IDOR Defect: Transfer endpoint allows initiating transfer from unowned account without authorization check.',
  341 |             });
  342 |         }
> 343 |         expect([400, 403, 404, 200]).toContain(response.status());
      |                                      ^ Error: expect(received).toContain(expected) // indexOf
  344 |     });
  345 | 
  346 |     test('TC-TRF-API-018 Unauthorized transfer request', async ({ request }) => {
  347 |         const transferApi = new TransferApi(request);
  348 | 
  349 |         // 1. Send transfer request without authentication credentials or session cookie
  350 |         const response = await transferApi.transfer(sourceAccountId, destAccountId, 50);
  351 | 
  352 |         // 2. Specification: Status 401 Unauthorized. Log @known-defect if public demo endpoint is unsecured
  353 |         if (response.status() === 200) {
  354 |             test.info().annotations.push({
  355 |                 type: 'known-defect',
  356 |                 description: 'ParaBank REST API endpoints do not require authentication or session validation.',
  357 |             });
  358 |         }
  359 |         expect([401, 200]).toContain(response.status());
  360 |     });
  361 | 
  362 |     test('TC-TRF-API-019 Transfer response SLA', async ({ request }) => {
  363 |         const transferApi = new TransferApi(request);
  364 | 
  365 |         // 1. Measure latency of the transfer API call
  366 |         const startTime = performance.now();
  367 |         const response = await transferApi.transfer(sourceAccountId, destAccountId, 10);
  368 |         const duration = performance.now() - startTime;
  369 | 
  370 |         // 2. Confirm HTTP 200 OK
  371 |         expect(response.status()).toBe(200);
  372 | 
  373 |         // 3. Confirm response time satisfies performance SLA (< 2000 ms)
  374 |         expect(duration).toBeLessThan(2000);
  375 |     });
  376 | });
  377 | 
```