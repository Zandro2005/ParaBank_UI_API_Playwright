import { APIRequestContext, APIResponse } from '@playwright/test';
import { CustomerRegistrationData } from '@utils/testDataGenerator';

export interface CustomerAddress {
    street: string;
    city: string;
    state: string;
    zipCode: string;
}

export interface Customer {
    id: number;
    firstName: string;
    lastName: string;
    address: CustomerAddress;
    phoneNumber: string;
    ssn: string;
}

export interface CustomerUpdateParams {
    firstName: string;
    lastName: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    phoneNumber: string;
    ssn: string;
    username: string;
    password: string;
}

export class UserApi {
    readonly webBaseUrl = 'https://parabank.parasoft.com/parabank';
    readonly bankApiBaseUrl = `${this.webBaseUrl}/services/bank`;

    constructor(private request: APIRequestContext) {}

    /**
     * POST /parabank/register.htm (application/x-www-form-urlencoded)
     * Fetches GET /register.htm first so Spring MVC initializes a JSESSIONID and form session.
     */
    async register(user: CustomerRegistrationData, repeatedPassword?: string): Promise<APIResponse> {
        await this.request.get(`${this.webBaseUrl}/register.htm`, {
            headers: { Accept: 'text/html' },
        });

        return await this.request.post(`${this.webBaseUrl}/register.htm`, {
            headers: {
                'Accept': 'text/html',
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            form: {
                'customer.firstName': user.firstName,
                'customer.lastName': user.lastName,
                'customer.address.street': user.street,
                'customer.address.city': user.city,
                'customer.address.state': user.state,
                'customer.address.zipCode': user.zipCode,
                'customer.phoneNumber': user.phoneNumber,
                'customer.ssn': user.ssn,
                'customer.username': user.username,
                'customer.password': user.password,
                'repeatedPassword': repeatedPassword ?? user.password,
            },
        });
    }

    /**
     * GET /customers/{id}
     * Fetches a customer's profile payload by ID.
     */
    async getCustomer(customerId: number | string): Promise<APIResponse> {
        return await this.request.get(`${this.bankApiBaseUrl}/customers/${customerId}`, {
            headers: { Accept: 'application/json' },
        });
    }

    /**
     * POST /customers/update/{id}
     * Updates a customer's profile via query parameters (ParaBank requires full customer fields).
     */
    async updateCustomer(
        customerId: number | string,
        params?: Partial<CustomerUpdateParams>
    ): Promise<APIResponse> {
        const cleanParams: Record<string, string> = {};
        if (params) {
            for (const [key, value] of Object.entries(params)) {
                if (value !== undefined) {
                    cleanParams[key] = value;
                }
            }
        }

        return await this.request.post(`${this.bankApiBaseUrl}/customers/update/${customerId}`, {
            params: cleanParams,
            headers: { Accept: 'application/json' },
        });
    }

    /**
     * DELETE /customers/{id}
     * Probes whether customer deletion is disallowed by the REST contract.
     */
    async deleteCustomer(customerId: number | string): Promise<APIResponse> {
        return await this.request.delete(`${this.bankApiBaseUrl}/customers/${customerId}`, {
            headers: { Accept: 'application/json' },
        });
    }
}
