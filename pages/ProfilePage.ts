import { Locator, Page, expect } from '@playwright/test';

export type RegisterData = {
    firstname: string;
    lastname: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    phone: string;
    ssn: string;
    username: string;
    password: string;
    confirmPassword: string;
};

export class ProfilePage {
    readonly page: Page;
    readonly loginUrl = 'index.htm';
    readonly registerNavLink: Locator;
    readonly updateContactInfoLink: Locator;
    readonly firstname: Locator;
    readonly lastname: Locator;
    readonly address: Locator;
    readonly city: Locator;
    readonly state: Locator;
    readonly zipCode: Locator;
    readonly phone: Locator;
    readonly ssn: Locator;
    readonly username: Locator;
    readonly password: Locator;
    readonly confirmPassword: Locator;
    readonly registerBtn: Locator;
    readonly updateProfileBtn: Locator;
    readonly welcomeMessage: Locator;
    readonly profileUpdatedHeading: Locator;
    readonly registerErrorMessages: Locator;

    constructor(page: Page) {
        this.page = page;
        this.registerNavLink = page.getByRole('link', { name: 'Register' });
        this.updateContactInfoLink = page.getByRole('link', { name: 'Update Contact Info' });
        this.firstname = page.locator('[id="customer.firstName"]');
        this.lastname = page.locator('[id="customer.lastName"]');
        this.address = page.locator('[id="customer.address.street"]');
        this.city = page.locator('[id="customer.address.city"]');
        this.state = page.locator('[id="customer.address.state"]');
        this.zipCode = page.locator('[id="customer.address.zipCode"]');
        this.phone = page.locator('[id="customer.phoneNumber"]');
        this.ssn = page.locator('[id="customer.ssn"]');
        this.username = page.locator('[id="customer.username"]');
        this.password = page.locator('[id="customer.password"]');
        this.confirmPassword = page.locator('#repeatedPassword');
        this.registerBtn = page.getByRole('button', { name: 'Register' });
        this.updateProfileBtn = page.getByRole('button', { name: 'Update Profile' });
        this.welcomeMessage = page.getByText('Your account was created');
        this.profileUpdatedHeading = page.getByRole('heading', { name: 'Profile Updated' });
        this.registerErrorMessages = page.locator('#customerForm span.error, #updateProfileForm span.error, #rightPanel span.error');
    }

    async navigate(): Promise<void> {
        await this.page.goto(this.loginUrl);
    }

    async clickRegisterLink(): Promise<void> {
        await this.registerNavLink.click();
        await this.page.waitForLoadState('load');
        await this.firstname.waitFor({ state: 'visible' });
    }

    async clickUpdateContactInfoLink(): Promise<void> {
        await this.updateContactInfoLink.click();
        await this.page.waitForURL('**/updateprofile.htm');
        await this.firstname.waitFor({ state: 'visible' });
        // Wait for AJAX call to populate the profile fields
        await expect(this.firstname).not.toHaveValue('');
    }

    async fillRegisterCredentials(data: RegisterData): Promise<void> {
        await this.firstname.waitFor({ state: 'visible' });
        await this.firstname.fill(data.firstname);
        await this.lastname.fill(data.lastname);
        await this.address.fill(data.address);
        await this.city.fill(data.city);
        await this.state.fill(data.state);
        await this.zipCode.fill(data.zipCode);
        await this.phone.fill(data.phone);
        await this.ssn.fill(data.ssn);
        await this.username.fill(data.username);
        await this.password.fill(data.password);
        await this.confirmPassword.fill(data.confirmPassword);
    }

    async clickRegisterBtn(): Promise<void> {
        await this.registerBtn.click();
    }

    async clickUpdateProfileBtn(): Promise<void> {
        await this.updateProfileBtn.click();
    }

    getErrorMessage(message?: string): Locator {
        return message
            ? this.registerErrorMessages.filter({ hasText: message })
            : this.registerErrorMessages;
    }
}
