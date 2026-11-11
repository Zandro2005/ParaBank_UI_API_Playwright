import { PayeePayload } from '@api/TransferApi';

export const validPayee: PayeePayload = {
    name: 'Electric Utility Co',
    address: {
        street: '123 Power Grid Blvd',
        city: 'Beverly Hills',
        state: 'CA',
        zipCode: '90210',
    },
    phoneNumber: '555-0199',
    accountNumber: 98765,
};

export const billPayTestData = {
    validAmount: 45,
    debitCheckAmount: 20,
    negativeAmount: -50,
    invalidAccountId: 999999999,
};
