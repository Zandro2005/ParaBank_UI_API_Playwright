

export const loginCases = [
    {
        name: 'Login with invalid username',
        username: 'Invalid',
        password:  process.env.TEST_PASSWORD!,
        errorMessage: 'The username and password could not be verified'

    },

    {
        name: 'Login with invalid password',
        username: process.env.TEST_USERNAME!,
        password: 'Invalid',
        errorMessage: 'The username and password could not be verified.'
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