export interface CustomerRegistrationData {
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

/**
 * Generates unique customer registration data so API and UI runs stay isolated.
 */
export function generateRandomUser(prefix = 'qauser'): CustomerRegistrationData {
    const suffix = `${Date.now().toString().slice(-6)}${Math.floor(Math.random() * 100)
        .toString()
        .padStart(2, '0')}`;

    return {
        firstName: 'Alex',
        lastName: 'Mercer',
        street: '742 Evergreen Ter',
        city: 'Springfield',
        state: 'IL',
        zipCode: '62701',
        phoneNumber: '555-0100',
        ssn: '123-45-6789',
        username: `${prefix}_${suffix}`,
        password: 'Password123!',
    };
}
