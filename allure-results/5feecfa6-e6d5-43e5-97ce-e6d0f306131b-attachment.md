# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: api\accounts.api.spec.ts >> Validate login JSON response schema
- Location: tests\api\accounts.api.spec.ts:21:5

# Error details

```
TypeError: responseBody.status is not a function
```

# Test source

```ts
  1  | import {test, expect} from '@playwright/test';
  2  | 
  3  | test('Authenticate with valid credentials', async({request}) =>{
  4  |     const response = await request.get('https://parabank.parasoft.com/parabank/services/bank/login/john/demo', {
  5  |         headers: {
  6  |             'Accept': 'application/json'
  7  |         }  
  8  | 
  9  |     });
  10 | 
  11 |     const responseBody = await response.json();
  12 |     console.log(responseBody)
  13 | 
  14 |     await expect(response.status()).toBe(200);
  15 |     await expect(responseBody.id).toEqual(12212);
  16 |     await expect(responseBody.firstName).toBe('John');
  17 |     await expect(responseBody.address.state).toBe('CA');
  18 | 
  19 | });
  20 | 
  21 | test('Validate login JSON response schema', async({request}) =>{
  22 |     const response = await request.get('https://parabank.parasoft.com/parabank/services/bank/login/john/demo', {
  23 |         headers: {
  24 |             'Accept': 'application/json'
  25 | 
  26 |         }
  27 | 
  28 |     });
  29 | 
  30 |     const responseBody = await response.json();
  31 |     
> 32 |     await expect(responseBody.status()).toBe(200);
     |                               ^ TypeError: responseBody.status is not a function
  33 |     await expect(responseBody.id).toBeDefined();
  34 |     await expect(responseBody.firstName).toBeDefined();
  35 |     await expect(responseBody.lastName).toBeDefined();
  36 |     await expect(responseBody.address).toBeDefined();
  37 |     await expect(responseBody.phoneNumber).toBeDefined();
  38 |     await expect(responseBody.ssn).toBeDefined();
  39 | 
  40 | });
```