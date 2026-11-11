# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: api\transfer.api.spec.ts >> 2.3 Fund Transfer API Test Suite >> TC-TRF-API-018 Unauthorized transfer request
- Location: tests\api\transfer.api.spec.ts:351:9

# Error details

```
Error: expect(received).toContain(expected) // indexOf

Expected value: 500
Received array: [401, 200]
```

# Test source

```ts
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
  314 |         // Create an isolated temporary account so 3-decimal test does not corrupt main test accounts
  315 |         const tempAccRes = await accountApi.createAccount(12212, 0, sourceAccountId);
  316 |         const tempAccountId = (await tempAccRes.json()).id;
  317 | 
  318 |         // 1. Attempt transfer with 3 decimal places
  319 |         const response = await transferApi.transfer(sourceAccountId, tempAccountId, amountWith3Decimals);
  320 | 
  321 |         // 2. Specification: Rejected (4xx/500) or rounded cleanly to 2 decimals
  322 |         if (response.status() === 200) {
  323 |             test.info().annotations.push({
  324 |                 type: 'known-defect',
  325 |                 description: 'ParaBank accepted transfer with 3 decimal places without input validation.',
  326 |             });
  327 |             expect(response.status()).toBe(200);
  328 |         } else {
  329 |             // Server rejected the excessive decimals
  330 |             expect([400, 422, 500]).toContain(response.status());
  331 |         }
  332 |     });
  333 | 
  334 |     test('TC-TRF-API-017 Transfer from another customer\'s account', async ({ request }) => {
  335 |         const transferApi = new TransferApi(request);
  336 |         const foreignAccountId = 999999999; // Non-owned foreign account ID
  337 | 
  338 |         // 1. Attempt to initiate transfer from an account not owned by customer 12212
  339 |         const response = await transferApi.transfer(foreignAccountId, destAccountId, 50);
  340 | 
  341 |         // 2. Specification: Status 403 Forbidden / 400. Log @known-defect if IDOR vulnerability exists
  342 |         if (response.status() === 200) {
  343 |             test.info().annotations.push({
  344 |                 type: 'known-defect',
  345 |                 description: 'IDOR Defect: Transfer endpoint allows initiating transfer from unowned account without authorization check.',
  346 |             });
  347 |         }
  348 |         expect([400, 403, 404, 500, 200]).toContain(response.status());
  349 |     });
  350 | 
  351 |     test('TC-TRF-API-018 Unauthorized transfer request', async ({ request }) => {
  352 |         const transferApi = new TransferApi(request);
  353 | 
  354 |         // 1. Send transfer request without authentication credentials or session cookie
  355 |         const response = await transferApi.transfer(sourceAccountId, destAccountId, 50);
  356 | 
  357 |         // 2. Specification: Status 401 Unauthorized. Log @known-defect if public demo endpoint is unsecured
  358 |         if (response.status() === 200) {
  359 |             test.info().annotations.push({
  360 |                 type: 'known-defect',
  361 |                 description: 'ParaBank REST API endpoints do not require authentication or session validation.',
  362 |             });
  363 |         }
> 364 |         expect([401, 200]).toContain(response.status());
      |                            ^ Error: expect(received).toContain(expected) // indexOf
  365 |     });
  366 | 
  367 |     test('TC-TRF-API-019 Transfer response SLA', async ({ request }) => {
  368 |         const transferApi = new TransferApi(request);
  369 | 
  370 |         // 1. Measure latency of the transfer API call
  371 |         const startTime = performance.now();
  372 |         const response = await transferApi.transfer(sourceAccountId, destAccountId, 10);
  373 |         const duration = performance.now() - startTime;
  374 | 
  375 |         // 2. Confirm HTTP 200 OK
  376 |         expect(response.status()).toBe(200);
  377 | 
  378 |         // 3. Confirm response time satisfies performance SLA (< 2000 ms)
  379 |         expect(duration).toBeLessThan(2000);
  380 |     });
  381 | });
  382 | 
```