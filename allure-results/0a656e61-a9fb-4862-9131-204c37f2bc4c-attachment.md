# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: api\transfer.api.spec.ts >> 2.3 Fund Transfer API Test Suite >> TC-TRF-API-001 Valid transfer between own accounts
- Location: tests\api\transfer.api.spec.ts:32:9

# Error details

```
TypeError: accounts.filter is not a function
```

# Test source

```ts
  1   | import { test, expect } from '@playwright/test';
  2   | import { TransferApi } from '@api/TransferApi';
  3   | import { AccountApi } from '@api/AccountApi';
  4   | import { TransactionApi } from '@api/TransactionApi';
  5   | import { transferTestData } from '@test-data/transfers';
  6   | 
  7   | // Run tests serially to prevent race conditions on account balances
  8   | test.describe.configure({ mode: 'serial' });
  9   | 
  10  | test.describe('2.3 Fund Transfer API Test Suite', () => {
  11  |     // Dynamically resolved test accounts belonging to customer 12212
  12  |     let sourceAccountId: number;
  13  |     let destAccountId: number;
  14  | 
  15  |     test.beforeAll(async ({ request }) => {
  16  |         // Reset ParaBank database to clean, seeded state
  17  |         await request.post('https://parabank.parasoft.com/parabank/services/bank/initializeDB');
  18  | 
  19  |         const accountApi = new AccountApi(request);
  20  |         const res = await accountApi.getCustomerAccounts(12212);
  21  |         const accounts = await res.json();
> 22  |         const funded = accounts.filter((acc: any) => acc.balance > 100);
      |                                 ^ TypeError: accounts.filter is not a function
  23  |         sourceAccountId = funded[0]?.id || 13122;
  24  |         destAccountId = accounts.find((acc: any) => acc.id !== sourceAccountId && acc.balance >= 0)?.id || 13344;
  25  |     });
  26  | 
  27  |     test.afterAll(async ({ request }) => {
  28  |         // Clean up database state after test suite execution
  29  |         await request.post('https://parabank.parasoft.com/parabank/services/bank/initializeDB');
  30  |     });
  31  | 
  32  |     test('TC-TRF-API-001 Valid transfer between own accounts', async ({ request }) => {
  33  |         const transferApi = new TransferApi(request);
  34  |         const amount = transferTestData.validAmount; // $50.00
  35  | 
  36  |         // 1. Send POST request to transfer funds from source to destination account
  37  |         const response = await transferApi.transfer(sourceAccountId, destAccountId, amount);
  38  | 
  39  |         // 2. Verify server responds with HTTP 200 OK
  40  |         expect(response.status()).toBe(200);
  41  | 
  42  |         // 3. Validate success confirmation text returned by ParaBank
  43  |         const responseText = await response.text();
  44  |         expect(responseText).toContain(`Successfully transferred $${amount}`);
  45  |         expect(responseText).toContain(`from account #${sourceAccountId} to account #${destAccountId}`);
  46  |     });
  47  | 
  48  |     test('TC-TRF-API-002 Source balance debit verification', async ({ request }) => {
  49  |         const transferApi = new TransferApi(request);
  50  |         const accountApi = new AccountApi(request);
  51  |         const amount = transferTestData.smallAmount; // $10.00
  52  | 
  53  |         // 1. Query initial source account balance before the transfer
  54  |         const initialRes = await accountApi.getAccount(sourceAccountId);
  55  |         expect(initialRes.status()).toBe(200);
  56  |         const initialBalance = (await initialRes.json()).balance;
  57  | 
  58  |         // 2. Execute fund transfer
  59  |         const transferRes = await transferApi.transfer(sourceAccountId, destAccountId, amount);
  60  |         expect(transferRes.status()).toBe(200);
  61  | 
  62  |         // 3. Query updated source account balance
  63  |         const updatedRes = await accountApi.getAccount(sourceAccountId);
  64  |         expect(updatedRes.status()).toBe(200);
  65  |         const updatedBalance = (await updatedRes.json()).balance;
  66  | 
  67  |         // 4. Assert source balance is debited by exactly the transfer amount (S - X)
  68  |         expect(updatedBalance).toBeCloseTo(initialBalance - amount, 2);
  69  |     });
  70  | 
  71  |     test('TC-TRF-API-003 Destination balance credit verification', async ({ request }) => {
  72  |         const transferApi = new TransferApi(request);
  73  |         const accountApi = new AccountApi(request);
  74  |         const amount = transferTestData.smallAmount; // $10.00
  75  | 
  76  |         // 1. Query initial destination account balance before the transfer
  77  |         const initialRes = await accountApi.getAccount(destAccountId);
  78  |         expect(initialRes.status()).toBe(200);
  79  |         const initialBalance = (await initialRes.json()).balance;
  80  | 
  81  |         // 2. Execute fund transfer
  82  |         const transferRes = await transferApi.transfer(sourceAccountId, destAccountId, amount);
  83  |         expect(transferRes.status()).toBe(200);
  84  | 
  85  |         // 3. Query updated destination account balance
  86  |         const updatedRes = await accountApi.getAccount(destAccountId);
  87  |         expect(updatedRes.status()).toBe(200);
  88  |         const updatedBalance = (await updatedRes.json()).balance;
  89  | 
  90  |         // 4. Assert destination balance is credited by exactly the transfer amount (D + X)
  91  |         expect(updatedBalance).toBeCloseTo(initialBalance + amount, 2);
  92  |     });
  93  | 
  94  |     test('TC-TRF-API-004 Conservation of total balances', async ({ request }) => {
  95  |         const transferApi = new TransferApi(request);
  96  |         const accountApi = new AccountApi(request);
  97  |         const amount = 15.00;
  98  | 
  99  |         // 1. Record initial balances for both accounts and calculate total funds (S + D)
  100 |         const srcInitialRes = await accountApi.getAccount(sourceAccountId);
  101 |         const dstInitialRes = await accountApi.getAccount(destAccountId);
  102 |         const initialSrcBalance = (await srcInitialRes.json()).balance;
  103 |         const initialDstBalance = (await dstInitialRes.json()).balance;
  104 |         const totalBefore = initialSrcBalance + initialDstBalance;
  105 | 
  106 |         // 2. Execute the fund transfer
  107 |         const transferRes = await transferApi.transfer(sourceAccountId, destAccountId, amount);
  108 |         expect(transferRes.status()).toBe(200);
  109 | 
  110 |         // 3. Record post-transfer balances and calculate new total funds (S' + D')
  111 |         const srcUpdatedRes = await accountApi.getAccount(sourceAccountId);
  112 |         const dstUpdatedRes = await accountApi.getAccount(destAccountId);
  113 |         const updatedSrcBalance = (await srcUpdatedRes.json()).balance;
  114 |         const updatedDstBalance = (await dstUpdatedRes.json()).balance;
  115 |         const totalAfter = updatedSrcBalance + updatedDstBalance;
  116 | 
  117 |         // 4. Verify conservation of funds: total money before transfer must equal total after
  118 |         expect(totalAfter).toBeCloseTo(totalBefore, 2);
  119 |     });
  120 | 
  121 |     test('TC-TRF-API-005 Transfer with fractional cents amount', async ({ request }) => {
  122 |         const transferApi = new TransferApi(request);
```