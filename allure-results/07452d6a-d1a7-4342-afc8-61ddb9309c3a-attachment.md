# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: api\transfer.api.spec.ts >> 2.3 Fund Transfer API Test Suite >> TC-TRF-API-003 Destination balance credit verification
- Location: tests\api\transfer.api.spec.ts:78:9

# Error details

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: 200
Received: 429
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
  12  |     let sourceAccountId = 13122;
  13  |     let destAccountId = 13344;
  14  | 
  15  |     test.beforeAll(async ({ request }) => {
  16  |         try {
  17  |             const accountApi = new AccountApi(request);
  18  |             const res = await accountApi.getCustomerAccounts(12212);
  19  |             if (res.status() === 200) {
  20  |                 const accounts = await res.json();
  21  |                 if (Array.isArray(accounts)) {
  22  |                     const funded = accounts.filter((acc: any) => acc.balance > 100);
  23  |                     sourceAccountId = funded[0]?.id || 13122;
  24  |                     destAccountId = accounts.find((acc: any) => acc.id !== sourceAccountId && acc.balance >= 0)?.id || 13344;
  25  |                 }
  26  |             }
  27  |         } catch {
  28  |             // Fallback to standard seeded accounts if network error occurs
  29  |             sourceAccountId = 13122;
  30  |             destAccountId = 13344;
  31  |         }
  32  |     });
  33  | 
  34  |     test.afterEach(async () => {
  35  |         // Pacing delay to avoid triggering Cloudflare Error 1015 rate limiting
  36  |         await new Promise(resolve => setTimeout(resolve, 300));
  37  |     });
  38  | 
  39  |     test('TC-TRF-API-001 Valid transfer between own accounts', async ({ request }) => {
  40  |         const transferApi = new TransferApi(request);
  41  |         const amount = transferTestData.validAmount; // $50.00
  42  | 
  43  |         // 1. Send POST request to transfer funds from source to destination account
  44  |         const response = await transferApi.transfer(sourceAccountId, destAccountId, amount);
  45  | 
  46  |         // 2. Verify server responds with HTTP 200 OK
  47  |         expect(response.status()).toBe(200);
  48  | 
  49  |         // 3. Validate success confirmation text returned by ParaBank
  50  |         const responseText = await response.text();
  51  |         expect(responseText).toContain(`Successfully transferred $${amount}`);
  52  |         expect(responseText).toContain(`from account #${sourceAccountId} to account #${destAccountId}`);
  53  |     });
  54  | 
  55  |     test('TC-TRF-API-002 Source balance debit verification', async ({ request }) => {
  56  |         const transferApi = new TransferApi(request);
  57  |         const accountApi = new AccountApi(request);
  58  |         const amount = transferTestData.smallAmount; // $10.00
  59  | 
  60  |         // 1. Query initial source account balance before the transfer
  61  |         const initialRes = await accountApi.getAccount(sourceAccountId);
  62  |         expect(initialRes.status()).toBe(200);
  63  |         const initialBalance = (await initialRes.json()).balance;
  64  | 
  65  |         // 2. Execute fund transfer
  66  |         const transferRes = await transferApi.transfer(sourceAccountId, destAccountId, amount);
  67  |         expect(transferRes.status()).toBe(200);
  68  | 
  69  |         // 3. Query updated source account balance
  70  |         const updatedRes = await accountApi.getAccount(sourceAccountId);
  71  |         expect(updatedRes.status()).toBe(200);
  72  |         const updatedBalance = (await updatedRes.json()).balance;
  73  | 
  74  |         // 4. Assert source balance is debited by exactly the transfer amount (S - X)
  75  |         expect(updatedBalance).toBeCloseTo(initialBalance - amount, 2);
  76  |     });
  77  | 
  78  |     test('TC-TRF-API-003 Destination balance credit verification', async ({ request }) => {
  79  |         const transferApi = new TransferApi(request);
  80  |         const accountApi = new AccountApi(request);
  81  |         const amount = transferTestData.smallAmount; // $10.00
  82  | 
  83  |         // 1. Query initial destination account balance before the transfer
  84  |         const initialRes = await accountApi.getAccount(destAccountId);
  85  |         expect(initialRes.status()).toBe(200);
  86  |         const initialBalance = (await initialRes.json()).balance;
  87  | 
  88  |         // 2. Execute fund transfer
  89  |         const transferRes = await transferApi.transfer(sourceAccountId, destAccountId, amount);
> 90  |         expect(transferRes.status()).toBe(200);
      |                                      ^ Error: expect(received).toBe(expected) // Object.is equality
  91  | 
  92  |         // 3. Query updated destination account balance
  93  |         const updatedRes = await accountApi.getAccount(destAccountId);
  94  |         expect(updatedRes.status()).toBe(200);
  95  |         const updatedBalance = (await updatedRes.json()).balance;
  96  | 
  97  |         // 4. Assert destination balance is credited by exactly the transfer amount (D + X)
  98  |         expect(updatedBalance).toBeCloseTo(initialBalance + amount, 2);
  99  |     });
  100 | 
  101 |     test('TC-TRF-API-004 Conservation of total balances', async ({ request }) => {
  102 |         const transferApi = new TransferApi(request);
  103 |         const accountApi = new AccountApi(request);
  104 |         const amount = 15.00;
  105 | 
  106 |         // 1. Record initial balances for both accounts and calculate total funds (S + D)
  107 |         const srcInitialRes = await accountApi.getAccount(sourceAccountId);
  108 |         const dstInitialRes = await accountApi.getAccount(destAccountId);
  109 |         const initialSrcBalance = (await srcInitialRes.json()).balance;
  110 |         const initialDstBalance = (await dstInitialRes.json()).balance;
  111 |         const totalBefore = initialSrcBalance + initialDstBalance;
  112 | 
  113 |         // 2. Execute the fund transfer
  114 |         const transferRes = await transferApi.transfer(sourceAccountId, destAccountId, amount);
  115 |         expect(transferRes.status()).toBe(200);
  116 | 
  117 |         // 3. Record post-transfer balances and calculate new total funds (S' + D')
  118 |         const srcUpdatedRes = await accountApi.getAccount(sourceAccountId);
  119 |         const dstUpdatedRes = await accountApi.getAccount(destAccountId);
  120 |         const updatedSrcBalance = (await srcUpdatedRes.json()).balance;
  121 |         const updatedDstBalance = (await dstUpdatedRes.json()).balance;
  122 |         const totalAfter = updatedSrcBalance + updatedDstBalance;
  123 | 
  124 |         // 4. Verify conservation of funds: total money before transfer must equal total after
  125 |         expect(totalAfter).toBeCloseTo(totalBefore, 2);
  126 |     });
  127 | 
  128 |     test('TC-TRF-API-005 Transfer with fractional cents amount', async ({ request }) => {
  129 |         const transferApi = new TransferApi(request);
  130 |         const accountApi = new AccountApi(request);
  131 |         const amount = transferTestData.fractionalAmount; // $12.34
  132 | 
  133 |         // 1. Record initial source balance
  134 |         const initialRes = await accountApi.getAccount(sourceAccountId);
  135 |         const initialBalance = (await initialRes.json()).balance;
  136 | 
  137 |         // 2. Transfer fractional amount ($12.34)
  138 |         const response = await transferApi.transfer(sourceAccountId, destAccountId, amount);
  139 |         expect(response.status()).toBe(200);
  140 | 
  141 |         // 3. Verify balance is deducted cleanly without precision drift
  142 |         const updatedRes = await accountApi.getAccount(sourceAccountId);
  143 |         const updatedBalance = (await updatedRes.json()).balance;
  144 |         expect(updatedBalance).toBeCloseTo(initialBalance - amount, 2);
  145 |     });
  146 | 
  147 |     test('TC-TRF-API-006 Double-entry transaction creation', async ({ request }) => {
  148 |         const transferApi = new TransferApi(request);
  149 |         const transactionApi = new TransactionApi(request);
  150 |         const amount = 25.00;
  151 | 
  152 |         // 1. Execute transfer
  153 |         const transferRes = await transferApi.transfer(sourceAccountId, destAccountId, amount);
  154 |         expect(transferRes.status()).toBe(200);
  155 | 
  156 |         // 2. Fetch transaction history for source account (A)
  157 |         const srcTxRes = await transactionApi.getAccountTransactions(sourceAccountId);
  158 |         expect(srcTxRes.status()).toBe(200);
  159 |         const srcTransactions = await srcTxRes.json();
  160 | 
  161 |         // 3. Fetch transaction history for destination account (B)
  162 |         const dstTxRes = await transactionApi.getAccountTransactions(destAccountId);
  163 |         expect(dstTxRes.status()).toBe(200);
  164 |         const dstTransactions = await dstTxRes.json();
  165 | 
  166 |         // 4. Confirm Account A has a Debit record ("Funds Transfer Sent")
  167 |         const debitEntry = srcTransactions.find(
  168 |             (tx: any) => tx.type === 'Debit' && tx.description === 'Funds Transfer Sent' && tx.amount === amount
  169 |         );
  170 |         expect(debitEntry).toBeDefined();
  171 | 
  172 |         // 5. Confirm Account B has a matching Credit record ("Funds Transfer Received")
  173 |         const creditEntry = dstTransactions.find(
  174 |             (tx: any) => tx.type === 'Credit' && tx.description === 'Funds Transfer Received' && tx.amount === amount
  175 |         );
  176 |         expect(creditEntry).toBeDefined();
  177 |     });
  178 | 
  179 |     test('TC-TRF-API-007 Transfer with zero amount', async ({ request }) => {
  180 |         const transferApi = new TransferApi(request);
  181 | 
  182 |         // 1. Attempt transfer with amount = 0
  183 |         const response = await transferApi.transfer(sourceAccountId, destAccountId, transferTestData.zeroAmount);
  184 | 
  185 |         // 2. Specification: Status 400 Bad Request. Log @known-defect if system accepts zero amount
  186 |         if (response.status() === 200) {
  187 |             test.info().annotations.push({
  188 |                 type: 'known-defect',
  189 |                 description: 'ParaBank accepts transfer with amount=0 instead of returning 400 Bad Request.',
  190 |             });
```