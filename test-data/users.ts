type LoginCase = {
    name: string;
    username: string;
    password: string;
    errorMessage: string;
    expectedToFail?: boolean;
    failureReason?: string;
};

export const loginCases: LoginCase[] = [
    {
        name: 'TC-AUTH-UI-003 Login with invalid username',
        username: 'Invalid',
        password: process.env.TEST_PASSWORD!,
        errorMessage: 'The username and password could not be verified',
        expectedToFail: false,
        failureReason: 'ParaBank returns an internal error for invalid passwords'
    },
    {
        name: 'TC-AUTH-UI-004 Login with invalid password',
        username: process.env.TEST_USERNAME!,
        password: 'Invalid',
        errorMessage: 'The username and password could not be verified.',
        expectedToFail: false,
        failureReason: 'ParaBank returns an internal error for invalid passwords'
    },
    {
        name: 'TC-AUTH-UI-005 Login with empty credentials',
        username: '',
        password: '',
        errorMessage: 'Please enter a username and password.'
    },
    {
        name: 'TC-AUTH-UI-006 Login with empty password only',
        username: process.env.TEST_USERNAME!,
        password: '',
        errorMessage: 'Please enter a username and password.'
    },
    {
        name: 'TC-AUTH-UI-007 Login with empty username only',
        username: '',
        password: process.env.TEST_PASSWORD!,
        errorMessage: 'Please enter a username and password.'
    }
];

export const userProfileTestData = {
    updatedCity: 'NewCity',
    updatedPhoneNumber: '555-9999',
    nonExistentCustomerId: 999999999,
    nonNumericCustomerId: 'invalid_user',
    peerCustomerId: 12212,
    duplicateUsernameMessage: 'This username already exists.',
};
