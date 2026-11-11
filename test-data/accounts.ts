export const invalidLoginCases = [
    { 
        name: 'TC-AUTH-API-006 Unknown username', 
        username: 'fake_user_999', 
        password: 'demo', 
        expectedStatus: 400 
    },
    { 
        name: 'TC-AUTH-API-007 Incorrect password', 
        username: 'john', 
        password: 'WrongPassword!', 
        expectedStatus: 400 
    },
    { 
        name: 'TC-AUTH-API-008 Missing credentials', 
        username: '', 
        password: '', 
        expectedStatus: 404 
    }
];
