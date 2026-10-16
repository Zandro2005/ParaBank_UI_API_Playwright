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
    const loginPage = new LoginPage(page);


    await loginPage.navigate();
    await loginPage.fillLoginCredentials(data.username, data.password);
    await loginPage.clickLoginBtn();
    
    await expect(loginPage.loginErrorMessage).toContainText(data.errorMessage);


    });
}
