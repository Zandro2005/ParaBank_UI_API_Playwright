

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
        name: 'Login with invalid username',
        username: 'Invalid',
        password:  process.env.TEST_PASSWORD!,
        errorMessage: 'The username and password could not be verified',
        expectedToFail: false,
        failureReason: 'ParaBank returns an internal error for invalid passwords'

    },

    {
        name: 'Login with invalid password',
        username: process.env.TEST_USERNAME!,
        password: 'Invalid',
        errorMessage: 'The username and password could not be verified.',
        expectedToFail: false,
        failureReason: 'ParaBank returns an internal error for invalid passwords'
    },

    {
        name: 'Login with empty credentials',
        username: '',
        password: '',
        errorMessage: 'Please enter a username and password.'

    },

    {
        name: 'Login with empty password only',
        username: process.env.TEST_USERNAME!,
        password: '',
        errorMessage: 'Please enter a username and password.'
    },

    {
        name: 'Login with empty username only',
        username: '',
        password: process.env.TEST_PASSWORD!,
        errorMessage: 'Please enter a username and password.'

    },


];