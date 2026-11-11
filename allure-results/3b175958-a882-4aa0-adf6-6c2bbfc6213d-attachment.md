# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: api\accounts.api.spec.ts >> Verify customer account ownership
- Location: tests\api\accounts.api.spec.ts:37:5

# Error details

```
Error: expect(received).toEqual(expected) // deep equality

Expected: undefined
Received: 12212
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
  29 |     const requestId = responsebody.id;
  30 | 
  31 |     expect(response.status()).toBe(200);
  32 |     expect(responsebody.id).toEqual(requestId);
  33 |     
  34 | 
  35 | });
  36 | 
  37 | test('Verify customer account ownership', async({request}) =>{
  38 |     const accountApi = new AccountApi(request)
  39 |     const customerID = 12212; 
  40 |     const response = await accountApi.getCustomerAccounts(customerID);
  41 |     const responsebody = await response.json();
  42 | 
  43 |     expect(response.status()).toBe(200);
> 44 |     expect(customerID).toEqual(responsebody.customerId);
     |                        ^ Error: expect(received).toEqual(expected) // deep equality
  45 | 
  46 | });
```