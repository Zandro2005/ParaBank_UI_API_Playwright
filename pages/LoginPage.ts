import { Locator, Page } from '@playwright/test';

export class LoginPage {
    readonly page: Page;
    readonly loginUrl = 'index.htm';
    readonly usernameInput: Locator;
    readonly passwordInput: Locator;
    readonly loginBtn: Locator;
    readonly overviewHeading: Locator;
    readonly greetingsText: Locator;
    readonly loginErrorMessage: Locator

    constructor(page: Page) {
        this.page = page;
        this.usernameInput = page.getByRole('textbox').first();
        this.passwordInput = page.locator('input[name="password"]');
        this.loginBtn = page.getByRole('button', { name: 'Log in' });
        this.overviewHeading = page.getByRole('heading', { name: 'Accounts Overview' });
        this.greetingsText = page.getByText('Welcome');
        this.loginErrorMessage = page.locator('#rightPanel p.error');
    }

    async navigate(): Promise<void>{
        await this.page.goto(this.loginUrl);

    }

    async fillLoginCredentials(username: string, password: string): Promise<void>{
        await this.usernameInput.fill(username);
        await this.passwordInput.fill(password);

    }

    async clickLoginBtn(): Promise<void>{
        await this.loginBtn.click();

    }

     getErrorMessage(message?: string): Locator {
        return message
            ? this.loginErrorMessage.filter({ hasText: message })
            : this.loginErrorMessage;
    }


}