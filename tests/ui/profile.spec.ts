import { test, expect } from '@fixtures/authFixture';
import { ProfilePage } from '@pages/ProfilePage';
import { LoginPage } from '@pages/LoginPage';

test('TC-REG-UI-001 Register new user via UI', async ({ page }) => {
    const profilePage = new ProfilePage(page);
    const uniqueUsername = `user_${Date.now().toString().slice(-6)}`;

    await profilePage.navigate();
    await profilePage.clickRegisterLink();
    await profilePage.fillRegisterCredentials({
        firstname: 'John',
        lastname: 'Doe',
        address: '123 Main St',
        city: 'Beverly Hills',
        state: 'CA',
        zipCode: '90210',
        phone: '555-1234',
        ssn: '123-45-6789',
        username: uniqueUsername,
        password: 'Password123!',
        confirmPassword: 'Password123!'
    });

    await profilePage.clickRegisterBtn();
    await expect(profilePage.welcomeMessage).toBeVisible();
});

test('TC-REG-UI-002 Register with completely empty form', async ({ page }) => {
    const profilePage = new ProfilePage(page);

    await profilePage.navigate();
    await profilePage.clickRegisterLink();
    await profilePage.clickRegisterBtn();

    await expect(profilePage.registerErrorMessages.first()).toBeVisible();
});

test('TC-REG-UI-003 Password confirmation mismatch', async ({ page }) => {
    const profilePage = new ProfilePage(page);
    const uniqueUsername = `user_${Date.now().toString().slice(-6)}`;

    await profilePage.navigate();
    await profilePage.clickRegisterLink();
    await profilePage.fillRegisterCredentials({
        firstname: 'John',
        lastname: 'Doe',
        address: '123 Main St',
        city: 'Beverly Hills',
        state: 'CA',
        zipCode: '90210',
        phone: '555-1234',
        ssn: '123-45-6789',
        username: uniqueUsername,
        password: 'Password123!',
        confirmPassword: 'Password123456!'
    });

    await profilePage.clickRegisterBtn();
    await expect(profilePage.getErrorMessage('Passwords did not match.')).toBeVisible();
});

test('TC-REG-UI-004 Duplicate username registration', async ({ page }) => {
    const profilePage = new ProfilePage(page);
    const duplicateUsername = `user_${Date.now().toString().slice(-6)}`;
    const userData = {
        firstname: 'John',
        lastname: 'Doe',
        address: '123 Main St',
        city: 'Beverly Hills',
        state: 'CA',
        zipCode: '90210',
        phone: '555-1234',
        ssn: '123-45-6789',
        username: duplicateUsername,
        password: 'Password123!',
        confirmPassword: 'Password123!'
    };

    // 1. Initial registration
    await profilePage.navigate();
    await profilePage.clickRegisterLink();
    await profilePage.fillRegisterCredentials(userData);
    await profilePage.clickRegisterBtn();
    await expect(profilePage.welcomeMessage).toBeVisible();

    // 2. Log out
    await page.getByRole('link', { name: 'Log Out' }).click();

    // 3. Attempt duplicate registration
    await profilePage.clickRegisterLink();
    await profilePage.fillRegisterCredentials(userData);
    await profilePage.clickRegisterBtn();

    // 4. Assert error
    await expect(profilePage.getErrorMessage('This username already exists.')).toBeVisible();
});

test('TC-REG-UI-005 Login with freshly registered user', async ({ page }) => {
    const profilePage = new ProfilePage(page);
    const uniqueUsername = `user_${Date.now().toString().slice(-6)}`;
    const password = 'Password123!';

    // 1. Register new user
    await profilePage.navigate();
    await profilePage.clickRegisterLink();
    await profilePage.fillRegisterCredentials({
        firstname: 'Zandro',
        lastname: 'Guinialope',
        address: '123 Main St',
        city: 'Beverly Hills',
        state: 'CA',
        zipCode: '90210',
        phone: '555-1234',
        ssn: '123-45-6789',
        username: uniqueUsername,
        password: password,
        confirmPassword: password
    });
    await profilePage.clickRegisterBtn();
    await expect(profilePage.welcomeMessage).toBeVisible();

    // 2. Log out
    await page.getByRole('link', { name: 'Log Out' }).click();

    // 3. Log back in with freshly registered credentials
    const loginPage = new LoginPage(page);
    await loginPage.fillLoginCredentials(uniqueUsername, password);
    await loginPage.clickLoginBtn();

    // 4. Verify login successful
    await expect(loginPage.overviewHeading).toHaveText('Accounts Overview');
});

test('TC-USR-UI-001 Update Profile form pre-filled', async ({ loginPage, page }) => {
    const profilePage = new ProfilePage(page);

    await profilePage.clickUpdateContactInfoLink();

    await expect(profilePage.firstname).not.toHaveValue('');
    await expect(profilePage.lastname).not.toHaveValue('');
    await expect(profilePage.address).not.toHaveValue('');
    await expect(profilePage.city).not.toHaveValue('');
    await expect(profilePage.state).not.toHaveValue('');
    await expect(profilePage.zipCode).not.toHaveValue('');
});

test('TC-USR-UI-002 Update profile details', async ({ loginPage, page }) => {
    const profilePage = new ProfilePage(page);

    await profilePage.clickUpdateContactInfoLink();
    await profilePage.address.fill('742 Evergreen Terrace');
    await profilePage.phone.fill('555-0199');
    await profilePage.clickUpdateProfileBtn();

    await expect(profilePage.profileUpdatedHeading).toBeVisible();
});

test('TC-USR-UI-003 Update profile with missing required field', async ({ loginPage, page }) => {
    const profilePage = new ProfilePage(page);

    await profilePage.clickUpdateContactInfoLink();
    await profilePage.firstname.clear();
    await profilePage.clickUpdateProfileBtn();

    await expect(profilePage.getErrorMessage('First name is required.')).toBeVisible();
});

test('TC-USR-UI-004 Profile updates persist across sessions', async ({ loginPage, page }) => {
    const profilePage = new ProfilePage(page);
    const updatedAddress = '999 Persistence Blvd';
    const updatedPhone = '555-777-8888';

    // 1. Update profile details
    await profilePage.clickUpdateContactInfoLink();
    await profilePage.address.fill(updatedAddress);
    await profilePage.phone.fill(updatedPhone);
    await profilePage.clickUpdateProfileBtn();
    await expect(profilePage.profileUpdatedHeading).toBeVisible();

    // 2. Log out and log back in
    await loginPage.clickLogoutBtn();
    await loginPage.fillLoginCredentials(
        process.env.TEST_USERNAME || 'john',
        process.env.TEST_PASSWORD || 'demo'
    );
    await loginPage.clickLoginBtn();
    await expect(loginPage.overviewHeading).toBeVisible();

    // 3. Verify updated contact info persisted
    await profilePage.clickUpdateContactInfoLink();
    await expect(profilePage.address).toHaveValue(updatedAddress);
    await expect(profilePage.phone).toHaveValue(updatedPhone);
});
