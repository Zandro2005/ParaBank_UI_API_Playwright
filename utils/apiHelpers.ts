import { expect } from '@playwright/test';
import { AccountApi, Account } from '@api/AccountApi';
import { TransactionApi, Transaction } from '@api/TransactionApi';

/** Converts a dollar float to integer cents to avoid IEEE 754 drift in balance assertions. */
export function toCents(amount: number): number {
    return Math.round(amount * 100);
}

/** Formats a Unix epoch timestamp (ms) into MM-DD-YYYY matching ParaBank UI date inputs. */
export function formatUtcMmDdYyyy(epochMs: number): string {
    const dt = new Date(epochMs);
    const mm = String(dt.getUTCMonth() + 1).padStart(2, '0');
    const dd = String(dt.getUTCDate()).padStart(2, '0');
    const yyyy = dt.getUTCFullYear();
    return `${mm}-${dd}-${yyyy}`;
}

/** Fetches the current numeric balance of an account via AccountApi. */
export async function getAccountBalanceViaApi(
    accountApi: AccountApi,
    accountId: number
): Promise<number> {
    const res = await accountApi.getAccount(accountId);
    expect(res.status()).toBe(200);
    const account: Account = await res.json();
    return account.balance;
}

/** Captures the existing set of transaction IDs for an account before a test action runs. */
export async function snapshotTransactionIds(
    transactionApi: TransactionApi,
    accountId: number
): Promise<Set<number>> {
    const res = await transactionApi.getAccountTransactions(accountId);
    expect(res.status()).toBe(200);
    const transactions: Transaction[] = await res.json();
    return new Set(transactions.map((txn) => txn.id));
}
