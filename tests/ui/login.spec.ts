import {test, expect} from '@fixtures/authFixture';
import { LoginPage } from '@pages/LoginPage';
import { loginCases } from '@test-data/users';


test('Valid login', async({page}) =>{
    const loginPage = new LoginPage(page);
    const username = process.env.TEST_USERNAME!;
    const password = process.env.TEST_PASSWORD!;

    await loginPage.navigate()
    await loginPage.fillLoginCredentials(username, password);
    await loginPage.clickLoginBtn();

    await expect(loginPage.overviewHeading).toHaveText('Accounts Overview')

});

test('Verify dashboardafter login', async({loginPage}) =>{
    await expect(loginPage.greetingsText).toBeVisible();

});

for (const data of loginCases){
    test(`Login: ${data.name}`, async({page}) =>{
    test.fail(
        data.expectedToFail ?? false,
        data.failureReason
    );

    const loginPage = new LoginPage(page);


    await loginPage.navigate();
    await loginPage.fillLoginCredentials(data.username, data.password);
    await loginPage.clickLoginBtn();
    
    await expect(loginPage.loginErrorMessage).toContainText(data.errorMessage);


    });
}

test('Logout workflow', async({loginPage}) =>{
    await loginPage.clickLogoutBtn();
    
        await expect(loginPage.page).toHaveURL((url) => {
            return url.pathname === '/parabank/index.htm';
        });

});

test('Protected page access after logout', async ({ loginPage }) => {
    // Precondition: Logged out
    await loginPage.clickLogoutBtn();
    await expect(loginPage.page).toHaveURL((url) => {
        return url.pathname === '/parabank/index.htm';
    });
    await expect(loginPage.loginBtn).toBeVisible();

    // 1) Directly navigate to overview.htm
    await loginPage.navigateToOverview();

    // Verification: Session revoked. Login form or error page displayed; account data not shown.
    await expect(loginPage.loginBtn).toBeVisible();
    await expect(loginPage.errorHeading).toHaveText('Error!');
    await expect(loginPage.loginErrorMessage).toHaveText('An internal error has occurred and has been logged.');
    await expect(loginPage.accountTable).not.toBeVisible();
    await expect(loginPage.overviewHeading).not.toBeVisible();

    // 2) Click browser Back button
    await loginPage.page.goBack();

    // Verification: Session revoked. Login form or error page displayed; account data not shown.
    await expect(loginPage.loginBtn).toBeVisible();
    await expect(loginPage.usernameInput).toBeVisible();
    await expect(loginPage.accountTable).not.toBeVisible();
    await expect(loginPage.overviewHeading).not.toBeVisible();
});

test('Password field masking', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.navigate();

    // 1) Inspect password input field
    await expect(loginPage.passwordInput).toBeVisible();
    await expect(loginPage.passwordInput).toHaveAttribute('type', 'password');

    // Verify input characters remain obscured when entered
    await loginPage.passwordInput.fill('SecretPassword123!');
    await expect(loginPage.passwordInput).toHaveAttribute('type', 'password');
});

test('Submit login using Enter key', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const username = process.env.TEST_USERNAME!;
    const password = process.env.TEST_PASSWORD!;

    await loginPage.navigate();

    // 1) Enter username and password
    await loginPage.fillLoginCredentials(username, password);

    // 2) Press Enter key
    await loginPage.passwordInput.press('Enter');

    // Expected: Form submitted successfully; navigated to overview.htm
    await expect(loginPage.page).toHaveURL((url) => {
        return url.pathname === '/parabank/overview.htm';
    });
    await expect(loginPage.overviewHeading).toHaveText('Accounts Overview');
});
