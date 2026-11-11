# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: api\accounts.api.spec.ts >> Get account details by ID
- Location: tests\api\accounts.api.spec.ts:25:5

# Error details

```
TypeError: Cannot read properties of undefined (reading 'id')
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
  12 | test('Validate account schema & data types', async({request}) =>{
  13 |     const accountApi = new AccountApi(request);
  14 |     const response = await accountApi.getCustomerAccounts(12212);
  15 |     const responsebody = await response.json();
  16 | 
  17 |     expect(response.status()).toBe(200);
  18 |     expect(responsebody[0].id).toBeDefined();
  19 |     expect(responsebody[0].customerId).toBeDefined();
  20 |     expect(responsebody[0].type).toBeDefined();
  21 |     expect(responsebody[0].balance).toBeDefined();
  22 | 
  23 | });
  24 | 
  25 | test('Get account details by ID', async({request}) =>{
  26 |     const accountApi = new AccountApi(request);
  27 |     const response = await accountApi.getAccount(13344);
  28 |     const responsebody = await response.json()
> 29 |     const requestId = responsebody[0].id;
     |                                       ^ TypeError: Cannot read properties of undefined (reading 'id')
  30 | 
  31 |     expect(response.status()).toBe(200);
  32 |     expect(responsebody.id).toEqual(requestId);
  33 |     
  34 | 
  35 | });
```