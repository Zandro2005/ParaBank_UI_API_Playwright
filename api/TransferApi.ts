import { APIRequestContext, APIResponse } from '@playwright/test';

export interface PayeePayload {
    name: string;
    address: {
        street: string;
        city: string;
        state: string;
        zipCode: string;
    };
    phoneNumber: string;
    accountNumber: number | string;
}

export interface BillPayResponse {
    payeeName: string;
    amount: number;
    accountId: number;
}

export class TransferApi {
    readonly baseUrl = 'https://parabank.parasoft.com/parabank/services/bank';

    constructor(private request: APIRequestContext) {}

    /**
     * POST /transfer?fromAccountId={from}&toAccountId={to}&amount={amount}
     * Executes a fund transfer between accounts.
     */
    async transfer(
        fromAccountId?: number | string,
        toAccountId?: number | string,
        amount?: number | string,
        headers?: Record<string, string>
    ): Promise<APIResponse> {
        const params: Record<string, any> = {};
        if (fromAccountId !== undefined) params.fromAccountId = fromAccountId;
        if (toAccountId !== undefined) params.toAccountId = toAccountId;
        if (amount !== undefined) params.amount = amount;

        return await this.request.post(`${this.baseUrl}/transfer`, {
            params,
            headers: {
                'Accept': 'application/json',
                ...headers,
            },
        });
    }

    /**
     * POST /billpay?accountId={accountId}&amount={amount}
     * Sends an electronic bill payment to an external payee using a JSON payload.
     */
    async billPay(
        accountId?: number | string,
        amount?: number | string,
        payee?: PayeePayload,
        headers?: Record<string, string>
    ): Promise<APIResponse> {
        const params: Record<string, any> = {};
        if (accountId !== undefined) params.accountId = accountId;
        if (amount !== undefined) params.amount = amount;

        const options: {
            params: Record<string, any>;
            data?: PayeePayload;
            headers: Record<string, string>;
        } = {
            params,
            headers: {
                'Accept': 'application/json',
                ...headers,
            },
        };

        if (payee !== undefined) {
            options.data = payee;
        }

        return await this.request.post(`${this.baseUrl}/billpay`, options);
    }
}
