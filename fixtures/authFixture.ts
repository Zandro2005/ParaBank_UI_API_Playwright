import {test as base, expect} from '@playwright/test';
import { LoginPage } from '@pages/LoginPage';

export const test = base.extend <{loginPage: LoginPage}>({
    loginPage: async({page}, use) =>{
        const loginPage = new LoginPage(page);
        const username = process.env.TEST_USERNAME!;
        const password = process.env.TEST_PASSWORD!;


        await loginPage.navigate();
        await loginPage.fillLoginCredentials(username, password);
        await loginPage.clickLoginBtn();
        await use(loginPage);

    },


});

export {expect};