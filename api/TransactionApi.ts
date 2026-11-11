import { APIRequestContext, APIResponse } from '@playwright/test';

export interface Transaction {
    id: number;
    accountId: number;
    type: 'Credit' | 'Debit';
    date: number;
    amount: number;
    description: string;
}

export class TransactionApi {
    readonly baseUrl = 'https://parabank.parasoft.com/parabank/services/bank';

    constructor(private request: APIRequestContext) {}

    /**
     * GET /accounts/{accountId}/transactions
     * Retrieves all transactions associated with a specific account.
     */
    async getAccountTransactions(accountId: number | string): Promise<APIResponse> {
        return await this.request.get(`${this.baseUrl}/accounts/${accountId}/transactions`, {
            headers: { 'Accept': 'application/json' },
        });
    }

    /**
     * GET /transactions/{transactionId}
     * Retrieves details for a single transaction by its unique ID.
     */
    async getTransaction(transactionId: number | string): Promise<APIResponse> {
        return await this.request.get(`${this.baseUrl}/transactions/${transactionId}`, {
            headers: { 'Accept': 'application/json' },
        });
    }

    /**
     * GET /accounts/{accountId}/transactions/amount/{amount}
     * Queries transactions for an account matching an exact dollar amount.
     */
    async getTransactionsByAmount(
        accountId: number | string,
        amount: number | string
    ): Promise<APIResponse> {
        return await this.request.get(
            `${this.baseUrl}/accounts/${accountId}/transactions/amount/${amount}`,
            { headers: { 'Accept': 'application/json' } }
        );
    }

    /**
     * GET /accounts/{accountId}/transactions/onDate/{onDate}
     * Queries transactions recorded on a specific date (format: MM-DD-YYYY).
     */
    async getTransactionsOnDate(
        accountId: number | string,
        onDate: string
    ): Promise<APIResponse> {
        return await this.request.get(
            `${this.baseUrl}/accounts/${accountId}/transactions/onDate/${onDate}`,
            { headers: { 'Accept': 'application/json' } }
        );
    }

    /**
     * GET /accounts/{accountId}/transactions/fromDate/{fromDate}/toDate/{toDate}
     * Queries transactions falling within an inclusive date range (format: MM-DD-YYYY).
     */
    async getTransactionsByDateRange(
        accountId: number | string,
        fromDate: string,
        toDate: string
    ): Promise<APIResponse> {
        return await this.request.get(
            `${this.baseUrl}/accounts/${accountId}/transactions/fromDate/${fromDate}/toDate/${toDate}`,
            { headers: { 'Accept': 'application/json' } }
        );
    }
}
