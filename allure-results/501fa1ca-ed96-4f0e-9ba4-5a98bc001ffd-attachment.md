# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: api\accounts.api.spec.ts >> Authenticate with valid credentials
- Location: tests\api\accounts.api.spec.ts:3:5

# Error details

```
Error: expect(received).toEqual(expected) // deep equality

Expected: "12212"
Received: 12212
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
> 15 |     await expect(responseBody.id).toEqual('12212');
     |                                   ^ Error: expect(received).toEqual(expected) // deep equality
  16 |     await expect(responseBody.firstName).toBe('John');
  17 |     await expect(responseBody.address[2].state).toBe('CA');
  18 | 
  19 | });
```