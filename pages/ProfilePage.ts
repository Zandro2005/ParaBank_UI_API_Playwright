import {Locator, Page} from '@playwright/test';

export class ProfilePage {
    readonly page: Page;
    readonly loginUrl = 'index.htm';
    readonly registerNavLink: Locator;

    constructor(page: Page){
        this.page = page;
        this.registerNavLink = page.getByRole('link', {name: 'Register'});


    }

    async navigate(): Promise<void>{
        await this.page.goto(this.loginUrl);

    }

    async clickRegisterLink(): Promise<void>{
        await this.registerNavLink.click();

    }

}