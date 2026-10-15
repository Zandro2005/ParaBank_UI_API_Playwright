# DEFECT_AUTH_001: Invalid credentials accepted during login

## Summary

The ParaBank login flow accepts an unregistered username with an incorrect password and opens an authenticated dashboard instead of rejecting the login.

## Classification

| Field | Value |
|---|---|
| Test case | TC-AUTH-UI-003 |
| Area | Authentication / Login |
| Type | Functional negative / Security |
| Severity | Critical if protected account data or actions are accessible |
| Environment | ParaBank public demo application |
| Browser | Chromium |
| Automation | Playwright with TypeScript |

## Preconditions

None. Use a fresh browser context and test-only credentials.

## Steps to Reproduce

1. Open the ParaBank login page.
2. Enter an unregistered username, for example `UnknownUser_123`.
3. Enter an incorrect password, for example `WrongPassword_123`.
4. Select **Log In**.

## Expected Result

The login request is rejected. The user remains logged out and the application displays:

> The username and password could not be verified.

The Accounts Overview page and account data must not be accessible.

## Actual Result

The application opens the authenticated dashboard and displays content such as:

- `Welcome John Smith`
- `Accounts Overview`
- Account balances and account links
- `Log Out`

The expected authentication error message is not displayed.

## Impact

Invalid or unregistered credentials may provide access to protected banking functionality and account information. This should be treated as a critical authentication issue if the behavior is reproducible outside the demo environment.

## Automation Evidence

The automated check is located in:

- `tests/ui/login.spec.ts`
- Page object: `pages/LoginPage.ts`
- Test case specification: `docs/TEST_CASES.md` under `TC-AUTH-UI-003`

The test should assert both the error message and that the dashboard is not visible:

```ts
await expect(
  loginPage.getErrorMessage(
    'The username and password could not be verified.'
  )
).toBeVisible();

await expect(loginPage.overviewHeading).not.toBeVisible();
```

## Report Generation

Run the focused Chromium test:

```powershell
npx playwright test tests/ui/login.spec.ts -g "Login with invalid username" --project=chromium
```

The Playwright HTML report is generated in `playwright-report/`.

If Allure is configured, generate its report with:

```powershell
npx allure generate allure-results --clean -o allure-report
npx allure open allure-report
```

Attach the HTML or Allure report and the failure screenshot to the defect record. Do not include real credentials, cookies, or authentication state files.

## Suggested Resolution

Reject authentication unless both the username and password match a registered account. Return a generic authentication error for unknown usernames and incorrect passwords, and ensure protected pages cannot be accessed without a valid authenticated session.
