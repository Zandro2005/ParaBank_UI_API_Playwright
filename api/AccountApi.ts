import { APIRequestContext, APIResponse } from '@playwright/test';

export interface Account {
    id: number;
    customerId: number;
    type: 'CHECKING' | 'SAVINGS' | 'LOAN';
    balance: number;
}

export interface LoanResponse {
    responseDate: number;
    loanProviderName: string;
    approved: boolean;
    accountId?: number;
    message?: string;
}

export class AccountApi {
    readonly baseUrl = 'https://parabank.parasoft.com/parabank/services/bank';

    constructor(private request: APIRequestContext) {}

    /**
     * GET /customers/{customerId}/accounts
     * Retrieves all accounts for a customer
     */
    async getCustomerAccounts(customerId: number | string): Promise<APIResponse> {
        return await this.request.get(`${this.baseUrl}/customers/${customerId}/accounts`, {
            headers: { 'Accept': 'application/json' }
        });
    }

    /**
     * GET /accounts/{accountId}
     * Retrieves details for a specific account
     */
    async getAccount(accountId: number | string): Promise<APIResponse> {
        return await this.request.get(`${this.baseUrl}/accounts/${accountId}`, {
            headers: { 'Accept': 'application/json' }
        });
    }

    /**
     * POST /createAccount?customerId={cId}&newAccountType={type}&fromAccountId={aId}
     * Creates a new account (0 = CHECKING, 1 = SAVINGS)
     */
    async createAccount(
        customerId?: number | string,
        newAccountType?: number | string,
        fromAccountId?: number | string
    ): Promise<APIResponse> {
        const params: Record<string, any> = {};
        if (customerId !== undefined) params.customerId = customerId;
        if (newAccountType !== undefined) params.newAccountType = newAccountType;
        if (fromAccountId !== undefined) params.fromAccountId = fromAccountId;

        return await this.request.post(`${this.baseUrl}/createAccount`, {
            params,
            headers: { 'Accept': 'application/json' }
        });
    }

    /**
     * POST /requestLoan?customerId={cId}&amount={amount}&downPayment={downPayment}&fromAccountId={aId}
     * Applies for a loan
     */
    async requestLoan(
        customerId?: number | string,
        amount?: number | string,
        downPayment?: number | string,
        fromAccountId?: number | string
    ): Promise<APIResponse> {
        const params: Record<string, any> = {};
        if (customerId !== undefined) params.customerId = customerId;
        if (amount !== undefined) params.amount = amount;
        if (downPayment !== undefined) params.downPayment = downPayment;
        if (fromAccountId !== undefined) params.fromAccountId = fromAccountId;

        return await this.request.post(`${this.baseUrl}/requestLoan`, {
            params,
            headers: { 'Accept': 'application/json' }
        });
    }
}

