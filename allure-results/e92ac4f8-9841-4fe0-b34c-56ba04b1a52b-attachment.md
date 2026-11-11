# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: api\transfer.api.spec.ts >> 2.3 Fund Transfer API Test Suite >> TC-TRF-API-016 Transfer with excessive decimal places
- Location: tests\api\transfer.api.spec.ts:309:9

# Error details

```
Error: expect(received).toContain(expected) // indexOf

Expected value: 429
Received array: [400, 422, 500]
```

# Test source

```ts
  232 |         expect(response.status()).toBe(400);
  233 | 
  234 |         // 3. Verify descriptive error message is returned
  235 |         const errorText = await response.text();
  236 |         expect(errorText).toContain('Could not find account');
  237 |         expect(errorText).toContain(`${invalidAccountId}`);
  238 |     });
  239 | 
  240 |     test('TC-TRF-API-012 Transfer with invalid destination account', async ({ request }) => {
  241 |         const transferApi = new TransferApi(request);
  242 |         const accountApi = new AccountApi(request);
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
  311 |         const accountApi = new AccountApi(request);
  312 |         const amountWith3Decimals = transferTestData.excessiveDecimalsAmount; // 10.999
  313 | 
  314 |         // Create two isolated throwaway accounts so 3-decimal test does not corrupt main test accounts
  315 |         const temp1Res = await accountApi.createAccount(12212, 0, sourceAccountId);
  316 |         const temp2Res = await accountApi.createAccount(12212, 0, sourceAccountId);
  317 |         const temp1Id = (await temp1Res.json()).id;
  318 |         const temp2Id = (await temp2Res.json()).id;
  319 | 
  320 |         // 1. Attempt transfer with 3 decimal places between throwaway accounts
  321 |         const response = await transferApi.transfer(temp1Id, temp2Id, amountWith3Decimals);
  322 | 
  323 |         // 2. Specification: Rejected (4xx/500) or rounded cleanly to 2 decimals
  324 |         if (response.status() === 200) {
  325 |             test.info().annotations.push({
  326 |                 type: 'known-defect',
  327 |                 description: 'ParaBank accepted transfer with 3 decimal places without input validation.',
  328 |             });
  329 |             expect(response.status()).toBe(200);
  330 |         } else {
  331 |             // Server rejected the excessive decimals
> 332 |             expect([400, 422, 500]).toContain(response.status());
      |                                     ^ Error: expect(received).toContain(expected) // indexOf
  333 |         }
  334 |     });
  335 | 
  336 |     test('TC-TRF-API-017 Transfer from another customer\'s account', async ({ request }) => {
  337 |         const transferApi = new TransferApi(request);
  338 |         const foreignAccountId = 999999999; // Non-owned foreign account ID
  339 | 
  340 |         // 1. Attempt to initiate transfer from an account not owned by customer 12212
  341 |         const response = await transferApi.transfer(foreignAccountId, destAccountId, 50);
  342 | 
  343 |         // 2. Specification: Status 403 Forbidden / 400. Log @known-defect if IDOR vulnerability exists
  344 |         if (response.status() === 200) {
  345 |             test.info().annotations.push({
  346 |                 type: 'known-defect',
  347 |                 description: 'IDOR Defect: Transfer endpoint allows initiating transfer from unowned account without authorization check.',
  348 |             });
  349 |         }
  350 |         expect([400, 403, 404, 500, 200]).toContain(response.status());
  351 |     });
  352 | 
  353 |     test('TC-TRF-API-018 Unauthorized transfer request', async ({ request }) => {
  354 |         const transferApi = new TransferApi(request);
  355 | 
  356 |         // 1. Send transfer request without authentication credentials or session cookie
  357 |         const response = await transferApi.transfer(sourceAccountId, destAccountId, 50);
  358 | 
  359 |         // 2. Specification: Status 401 Unauthorized. Log @known-defect if public demo endpoint is unsecured
  360 |         if (response.status() === 200) {
  361 |             test.info().annotations.push({
  362 |                 type: 'known-defect',
  363 |                 description: 'ParaBank REST API endpoints do not require authentication or session validation.',
  364 |             });
  365 |         }
  366 |         expect([401, 403, 200]).toContain(response.status());
  367 |     });
  368 | 
  369 |     test('TC-TRF-API-019 Transfer response SLA', async ({ request }) => {
  370 |         const transferApi = new TransferApi(request);
  371 | 
  372 |         // 1. Measure latency of the transfer API call
  373 |         const startTime = performance.now();
  374 |         const response = await transferApi.transfer(sourceAccountId, destAccountId, 10);
  375 |         const duration = performance.now() - startTime;
  376 | 
  377 |         // 2. Confirm HTTP 200 OK
  378 |         expect(response.status()).toBe(200);
  379 | 
  380 |         // 3. Confirm response time satisfies performance SLA (< 2000 ms)
  381 |         expect(duration).toBeLessThan(2000);
  382 |     });
  383 | });
  384 | 
```