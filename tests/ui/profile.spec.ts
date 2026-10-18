import {test, expect} from '@playwright/test'
import { ProfilePage } from '@pages/ProfilePage'

test('Register new user via UI', async({page}) =>{
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
    await expect(profilePage.welcomeMessage).toHaveText('Your account was created successfully. You are now logged in.')

})