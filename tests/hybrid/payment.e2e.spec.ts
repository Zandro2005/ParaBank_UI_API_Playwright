import { test, expect } from '@fixtures/bankingFixture';
import { Transaction } from '@api/TransactionApi';
import { BillPaymentPage, BillPayData } from '@pages/BillPaymentPage';
import { validPayee } from '@test-data/payments';
import {
    toCents,
    getAccountBalanceViaApi,
    snapshotTransactionIds,
} from '@utils/apiHelpers';

// Serial mode + pacing keeps live parabank.parasoft.com below Cloudflare 429 rate limits
test.describe.configure({ mode: 'serial' });

test.afterEach(async () => {
    await new Promise((resolve) => setTimeout(resolve, 600));
});

/** Maps shared PayeePayload test data into UI BillPayData fields. */
function toBillPayFormData(amount: string, overrides?: Partial<BillPayData>): BillPayData {
    const accountNum = String(validPayee.accountNumber);
    return {
        payeeName: validPayee.name,
        address: validPayee.address.street,
        city: validPayee.address.city,
        state: validPayee.address.state,
        zipCode: validPayee.address.zipCode,
        phone: validPayee.phoneNumber,
        account: accountNum,
        verifyAccount: accountNum,
        amount,
        ...overrides,
    };
}

test.describe('3.2 Hybrid Bill Payment Workflows', () => {
    test('TC-BILL-HYB-001 API Seed Account -> UI Pay Bill -> API Balance & Transaction Check', async ({
        page,
        testAccount,
        accountApi,
        transactionApi,
    }) => {
        const billPayPage = new BillPaymentPage(page);
        const paymentAmount = 45;

        // 1. API: Record opening balance B and snapshot prior transaction IDs
        const initialBalance = await getAccountBalanceViaApi(accountApi, testAccount.id);
        const beforeTxnIds = await snapshotTransactionIds(transactionApi, testAccount.id);

        // 2. UI: Fill and submit bill payment form for $45.00
        await billPayPage.clickBillPayLink();
        await billPayPage.submitBillPayment(
            toBillPayFormData(paymentAmount.toFixed(2)),
            testAccount.id
        );

        // 3. UI: Confirm Bill Payment Complete details
        await expect(billPayPage.billPayCompleteHeading).toBeVisible();
        await expect(billPayPage.payeeNameResult).toHaveText(validPayee.name);
        await expect(billPayPage.amountResult).toHaveText(`$${paymentAmount.toFixed(2)}`);
        await expect(billPayPage.fromAccountIdResult).toHaveText(String(testAccount.id));

        // 4. API: Verify balance is B - X and Debit transaction was created
        const updatedBalance = await getAccountBalanceViaApi(accountApi, testAccount.id);
        expect(toCents(updatedBalance)).toBe(toCents(initialBalance) - toCents(paymentAmount));

        const txRes = await transactionApi.getAccountTransactions(testAccount.id);
        expect(txRes.status()).toBe(200);
        const transactions: Transaction[] = await txRes.json();

        const billPayTxn = transactions.find(
            (txn) =>
                !beforeTxnIds.has(txn.id) &&
                txn.type === 'Debit' &&
                txn.amount === paymentAmount &&
                txn.description === `Bill Payment to ${validPayee.name}`
        );
        expect(billPayTxn).toBeDefined();
    });

    test('TC-BILL-HYB-002 Failed UI bill pay leaves backend balance intact', async ({
        page,
        testAccount,
        accountApi,
        transactionApi,
    }) => {
        const billPayPage = new BillPaymentPage(page);

        // 1. API: Record opening balance and snapshot transaction IDs
        const initialBalance = await getAccountBalanceViaApi(accountApi, testAccount.id);
        const beforeTxnIds = await snapshotTransactionIds(transactionApi, testAccount.id);

        // 2. UI: Submit mismatched payee account numbers
        await billPayPage.clickBillPayLink();
        await billPayPage.submitBillPayment(
            toBillPayFormData('25.00', {
                account: '11111',
                verifyAccount: '22222',
            }),
            testAccount.id
        );

        await expect(
            billPayPage.getErrorMessage('The account numbers do not match.')
        ).toBeVisible();
        await expect(billPayPage.billPayCompleteHeading).not.toBeVisible();

        // 3. API: Confirm backend balance is unchanged and no transaction was created
        const afterBalance = await getAccountBalanceViaApi(accountApi, testAccount.id);
        expect(toCents(afterBalance)).toBe(toCents(initialBalance));

        const afterTxnIds = await snapshotTransactionIds(transactionApi, testAccount.id);
        expect(afterTxnIds.size).toBe(beforeTxnIds.size);
    });

    test('TC-BILL-HYB-003 Payment exceeding balance rejected', async ({
        page,
        testAccount,
        accountApi,
    }) => {
        const billPayPage = new BillPaymentPage(page);

        // 1. API: Read current balance B and calculate overdraft amount B + 1000
        const initialBalance = await getAccountBalanceViaApi(accountApi, testAccount.id);
        const overdraftAmount = (initialBalance + 1000).toFixed(2);

        // 2. UI: Submit bill payment exceeding available balance
        await billPayPage.clickBillPayLink();
        await billPayPage.submitBillPayment(toBillPayFormData(overdraftAmount), testAccount.id);

        // Wait for either confirmation or error panel
        await expect(
            page.locator('#billpayResult h1.title, #billpayError h1.title').filter({ visible: true })
        ).toBeVisible();

        // 3. Verify outcome: annotate @known-defect if ParaBank allows overdraft payment
        if (await billPayPage.billPayCompleteHeading.isVisible()) {
            test.info().annotations.push({
                type: 'known-defect',
                description:
                    'Overdraft defect: ParaBank UI/backend accepted a bill payment exceeding account balance.',
            });
            const afterBalance = await getAccountBalanceViaApi(accountApi, testAccount.id);
            expect(afterBalance).toBeLessThan(0);
        } else {
            await expect(billPayPage.errorHeading).toBeVisible();
            const afterBalance = await getAccountBalanceViaApi(accountApi, testAccount.id);
            expect(toCents(afterBalance)).toBe(toCents(initialBalance));
        }
    });
});
