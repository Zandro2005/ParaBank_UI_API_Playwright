# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: api\accounts.api.spec.ts >> Validate account schema & data types
- Location: tests\api\accounts.api.spec.ts:12:6

# Error details

```
Error: expect(received).toBeDefined()

Received: undefined
```

# Test source

```ts
  1  | import {test, expect} from '@playwright/test'
  2  | import { AccountApi } from '@api/AccountApi'
  3  | 
  4  | test('Fetch accountsfor customer', async({request}) =>{
  5  |     const accountApi = new AccountApi(request);
  6  |     const response = await accountApi.getCustomerAccounts(12212);
  7  |     
  8  |     expect(response.status()).toBe(200);
  9  |     
  10 | });
  11 | 
  12 | test.only('Validate account schema & data types', async({request}) =>{
  13 |     const accountApi = new AccountApi(request);
  14 |     const response = await accountApi.getCustomerAccounts(12212);
  15 |     const responsebody = await response.json();
  16 | 
  17 |     console.log(responsebody);
> 18 |     expect(responsebody.id).toBeDefined();
     |                             ^ Error: expect(received).toBeDefined()
  19 |     expect(responsebody.customerId).toBeDefined();
  20 |     expect(responsebody.type).toBeDefined();
  21 |     expect(responsebody.balance).toBeDefined();
  22 |     
  23 | 
  24 | });
```