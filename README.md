# ParaBank API, UI, and Hybrid Test Automation Framework

An enterprise test automation framework built with **Playwright** and **TypeScript** for the ParaBank banking application. It implements a three-tier testing strategy combining **REST/Form API contract testing**, **UI functional and network-resilience testing**, and **Hybrid API + UI end-to-end workflows**.

---

## Project Overview

This repository demonstrates how modern QA engineering balances speed, reliability, and end-to-end confidence across `165` automated test cases in `15` specification files:

- **API Test Suite (`75` tests across `5` files):** Fast validation of authentication, account provisioning, fund transfers, transaction queries, bill payments, user profile updates, negative boundary inputs, and security controls (SQL injection, IDOR, HTTP method restrictions).
- **UI & Network Resilience Suite (`70` tests across `6` files):** Browser-driven verification of user journeys, form validation, dynamic tables, XSS input sanitization, and network fault injection using `page.route()` (`400`, `401`, `403`, `404`, `500`, network timeouts, empty bodies, and malformed JSON).
- **Hybrid End-to-End Suite (`20` tests across `4` files):** Combines HTTP state seeding (`page.request` cookie-shared session setup), browser actions via Page Objects, and backend database verification via API clients.

Full test case specifications, priorities, and requirement traceability are documented in [docs/TEST_CASES.md](docs/TEST_CASES.md), with a printable specification in [docs/ParaBank_Test_Cases_Specification.pdf](docs/ParaBank_Test_Cases_Specification.pdf) and sample defect documentation in [docs/DEFECT_AUTH_001.md](docs/DEFECT_AUTH_001.md).

---

## Architecture and Design Principles

- **Page Object Model (`pages/`):** Encapsulates DOM locators (`readonly` properties) and page interactions inside dedicated screen classes. Test files contain zero raw CSS or XPath selectors.
- **Service-Layer API Clients (`api/`):** Wraps Playwright's `APIRequestContext` with typed request/response interfaces (`Account`, `Transaction`, `Customer`, `PayeePayload`, `BillPayResponse`) and endpoint methods.
- **Custom Playwright Fixtures (`fixtures/`):**
  - `authFixture.ts`: Provides an authenticated `loginPage` fixture for standard UI suites.
  - `bankingFixture.ts`: Binds API clients to `page.request` so HTTP registration shares the `JSESSIONID` session cookie directly with the browser context, provisioning an isolated `authenticatedUser`, `sourceAccount`, `destinationAccount`, and `testAccount` per test.
- **Data-Driven Testing (`test-data/` and `utils/`):** Separates static test datasets and dynamic user generation (`generateRandomUser`) from test orchestration.
- **Financial Precision & Defect Traceability:** Uses integer-cent arithmetic (`toCents`) to prevent IEEE 754 floating-point drift in balance assertions, and documents known application-under-test bugs via Playwright `@known-defect` annotations without masking regressions.

---

## Repository Structure

```text
ParaBank_api_ui_playwright/
├── api/                            # Typed REST & Form API clients
│   ├── AccountApi.ts
│   ├── AuthApi.ts
│   ├── TransactionApi.ts
│   ├── TransferApi.ts
│   └── UserApi.ts
├── docs/                           # Test specifications & defect reports
│   ├── DEFECT_AUTH_001.md
│   ├── ParaBank_Test_Cases_Specification.pdf
│   └── TEST_CASES.md
├── fixtures/                       # Custom Playwright test fixtures
│   ├── apiFixture.ts
│   ├── authFixture.ts
│   ├── bankingFixture.ts
│   └── baseFixture.ts
├── pages/                          # Page Object Model (POM) classes
│   ├── AccountsPage.ts
│   ├── BillPaymentPage.ts
│   ├── DashboardPage.ts
│   ├── LoginPage.ts
│   ├── ProfilePage.ts
│   ├── TransactionsPage.ts
│   └── TransferPage.ts
├── test-data/                      # Parameterized & static test inputs
│   ├── accounts.ts
│   ├── payments.ts
│   ├── transfers.ts
│   └── users.ts
├── tests/
│   ├── api/                        # Pure API test specifications (75 tests)
│   │   ├── accounts.api.spec.ts
│   │   ├── auth.api.spec.ts
│   │   ├── transactions.api.spec.ts
│   │   ├── transfer.api.spec.ts
│   │   └── users.api.spec.ts
│   ├── hybrid/                     # Hybrid API + UI E2E workflows (20 tests)
│   │   ├── account.e2e.spec.ts
│   │   ├── payment.e2e.spec.ts
│   │   ├── transaction.e2e.spec.ts
│   │   └── transfer.e2e.spec.ts
│   └── ui/                         # UI functional & mocked resilience specs (70 tests)
│       ├── accounts.spec.ts
│       ├── billPayment.spec.ts
│       ├── login.spec.ts
│       ├── profile.spec.ts
│       ├── transactions.spec.ts
│       └── transfer.spec.ts
├── utils/                          # Generators & assertion helpers
│   ├── apiHelpers.ts
│   ├── assertions.ts
│   └── testDataGenerator.ts
├── .env.example                    # Environment variable template
├── package.json                    # Scripts & dependencies
├── playwright.config.ts            # Project & reporter configuration
└── tsconfig.json                   # TypeScript compiler & path aliases
```

---

## Test Suite Breakdown by Module

| Layer | Spec File | Coverage Summary |
| :--- | :--- | :--- |
| **API** | `tests/api/auth.api.spec.ts` | Valid/invalid authentication, JSON schema, XML content negotiation, SLA latency, SQLi, HTTP `405`. |
| **API** | `tests/api/accounts.api.spec.ts` | Account retrieval, schema validation, checking/savings creation, `$100` minimum deposit math, loan processing. |
| **API** | `tests/api/transfer.api.spec.ts` | Fund transfers (balance conservation, fractional cents, double-entry ledger, negative/overdraft defects) and Bill Pay API (`POST /billpay`). |
| **API** | `tests/api/transactions.api.spec.ts` | Account transaction lists, lookup by ID, amount, exact date (`MM-DD-YYYY`), and date range. |
| **API** | `tests/api/users.api.spec.ts` | Session-bootstrapped form registration, profile retrieval/update persistence, duplicate prevention, `DELETE` restriction, IDOR check. |
| **UI + Mock** | `tests/ui/login.spec.ts` | Login validation, empty/invalid credential permutations, session logout, unauthenticated access redirection. |
| **UI + Mock** | `tests/ui/profile.spec.ts` | UI user registration, password mismatch, duplicate username handling, contact profile updates across sessions. |
| **UI + Mock** | `tests/ui/accounts.spec.ts` | Overview balance sum verification, currency formatting, account creation, activity filtering, loan requests, plus mocked `500`/empty/stubbed responses. |
| **UI + Mock** | `tests/ui/transfer.spec.ts` | UI fund transfers, dropdown population, input validation, plus `page.route()` resilience tests (`200`, `400`, `401`, `403`, `404`, `500`, timeout, empty/malformed JSON). |
| **UI + Mock** | `tests/ui/billPayment.spec.ts` | Bill payment submission, required field validation, account mismatch, XSS payload safety, plus mocked `500` server error handling. |
| **UI + Mock** | `tests/ui/transactions.spec.ts` | Activity table inspection, transaction details navigation, search by ID/date/range/amount, plus mocked `500` search error resilience. |
| **Hybrid** | `tests/hybrid/transfer.e2e.spec.ts` | API account setup -> UI transfer execution -> API balance & double-entry ledger verification; API transfer -> UI overview synchronization. |
| **Hybrid** | `tests/hybrid/payment.e2e.spec.ts` | API account seeding -> UI bill payment -> API balance debit and transaction description verification. |
| **Hybrid** | `tests/hybrid/account.e2e.spec.ts` | Bidirectional user registration, profile update persistence, `SAVINGS`/`CHECKING` creation, and API-to-UI total balance reconciliation. |
| **Hybrid** | `tests/hybrid/transaction.e2e.spec.ts` | API transfer/bill pay -> UI search by amount/date and activity table verification -> `GET /transactions/{id}` cross-check. |

---

## Getting Started

### 1. Prerequisites
- **Node.js** `v18+` (tested with Node `v24`)
- **npm**

### 2. Installation
```bash
npm install
npx playwright install --with-deps
```

### 3. Environment Configuration
Create a `.env` file from `.env.example`:
```bash
cp .env.example .env
```

Default configuration in `.env.example`:
```ini
BASE_URL=https://parabank.parasoft.com/parabank
API_BASE_URL=https://parabank.parasoft.com/parabank/services/bank
TEST_USERNAME=john
TEST_PASSWORD=demo
```

---

## Running the Tests

```bash
# Run all configured projects
npm test

# Run individual test layers
npm run test:api       # Runs API suite serially (--workers=1) to respect public server rate limits
npm run test:ui        # Runs UI and network-mocking resilience suite
npm run test:hybrid    # Runs Hybrid API + UI E2E suite

# Run only API mocking resilience tests
npx playwright test --project=ui-tests --grep "MCK"

# Run in headed browser or interactive UI mode
npm run test:headed
npm run test:ui-mode

# Type-check the TypeScript codebase
npx tsc --noEmit

# Open the Playwright HTML test report
npm run report
```
