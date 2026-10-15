import {test, expect} from '@fixtures/authFixture';
import { LoginPage } from '@pages/LoginPage';
import { log } from 'console';

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

test('Login with invalid username', async({page}) =>{
    const loginPage = new LoginPage(page);
    const username = 'Unknown';
    const password = process.env.TEST_PASSWORD!;

    await loginPage.navigate();
    await loginPage.fillLoginCredentials(username, password);
    await loginPage.clickLoginBtn();
    
    await expect(loginPage.getErrorMessage('The username and password could not be verified.')).toBeVisible();


});