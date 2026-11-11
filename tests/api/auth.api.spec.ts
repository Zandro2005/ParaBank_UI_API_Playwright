import { test, expect } from '@playwright/test';
import { AuthApi } from '@api/AuthApi';
import { invalidLoginCases } from '@test-data/accounts';

test('TC-AUTH-API-001 Authenticate with valid credentials', async ({ request }) => {
    const authApi = new AuthApi(request);
    const response = await authApi.login(process.env.TEST_USERNAME!, process.env.TEST_PASSWORD!);

    expect(response.status()).toBe(200);

    const responseBody = await response.json();
    expect(responseBody.id).toBe(12212);
    expect(responseBody.firstName).toBe('John');
    expect(responseBody.address.state).toBe('CA');
});

test('TC-AUTH-API-002 Validate login JSON response schema', async ({ request }) => {
    const authApi = new AuthApi(request);
    const response = await authApi.login(process.env.TEST_USERNAME!, process.env.TEST_PASSWORD!);
    const responseBody = await response.json();

    expect(response.status()).toBe(200);
    expect(responseBody.id).toBeDefined();
    expect(responseBody.firstName).toBeDefined();
    expect(responseBody.lastName).toBeDefined();
    expect(responseBody.address).toBeDefined();
    expect(responseBody.phoneNumber).toBeDefined();
    expect(responseBody.ssn).toBeDefined();
});

test('TC-AUTH-API-003 Validate response headers', async ({ request }) => {
    const authApi = new AuthApi(request);
    const response = await authApi.login(process.env.TEST_USERNAME!, process.env.TEST_PASSWORD!);

    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('application/json');
});

test('TC-AUTH-API-004 Content negotiation for XML', async ({ request }) => {
    const authApi = new AuthApi(request);
    const response = await authApi.login('john', 'demo', 'application/xml');

    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('xml');

    const xmlBody = await response.text();
    expect(xmlBody).toContain('<customer>');
    expect(xmlBody).toContain('</customer>');
});

test('TC-AUTH-API-005 Login response latency SLA', async ({ request }) => {
    const authApi = new AuthApi(request);

    const startTime = performance.now();
    const response = await authApi.login('john', 'demo');
    const duration = performance.now() - startTime;

    expect(response.status()).toBe(200);
    expect(duration).toBeLessThan(2000);
});

for (const data of invalidLoginCases) {
    test(data.name, async ({ request }) => {
        const authApi = new AuthApi(request);
        const response = await authApi.login(data.username, data.password);

        expect(response.status()).toBe(data.expectedStatus);
    });
}

test('TC-AUTH-API-009 SQL injection payload in login', async ({ request }) => {
    const authApi = new AuthApi(request);
    const sqlPayload = encodeURIComponent("' OR '1'='1");

    const response = await authApi.login(sqlPayload, 'demo');

    expect([400, 403]).toContain(response.status());

    const responseText = await response.text();
    expect(responseText).not.toContain('SQL');
    expect(responseText).not.toContain('Exception');
});

test('TC-AUTH-API-010 Method Not Allowed validation', async ({ request }) => {
    const response = await request.post('https://parabank.parasoft.com/parabank/services/bank/login/john/demo');

    expect([405, 404]).toContain(response.status());
    expect(response.status()).not.toBe(200);
});
