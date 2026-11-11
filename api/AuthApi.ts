// api/AuthApi.ts
import { APIRequestContext, APIResponse } from '@playwright/test';

export class AuthApi {
    constructor(private request: APIRequestContext) {}

    async login(
        username: string, 
        password: string, 
        acceptHeader: string = 'application/json' // <--- Allow passing a custom header
    ): Promise<APIResponse> {
        return await this.request.get(`https://parabank.parasoft.com/parabank/services/bank/login/${username}/${password}`, {
            headers: {
                'Accept': acceptHeader
            }
        });
    }
}