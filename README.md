# 🏦 ParaBank API + UI Playwright Hybrid Test Automation Framework

An enterprise-ready test automation framework demonstrating a modern hybrid testing strategy: **API Testing**, **UI Testing**, and **Hybrid E2E Workflows** using **Playwright** and **TypeScript**.

---

## 🎯 Project Overview & Strategy

This project models real-world banking test automation on **ParaBank**. It demonstrates how to intelligently balance UI and API testing to maximize test speed, stability, and coverage.

Detailed industry-standard test cases, classifications, and requirement traceability are documented in [docs/TEST_CASES.md](file:///c:/Users/ADMIN/Documents/ParaBank_api_ui_playwright/docs/TEST_CASES.md) and exported as a printable PDF at [docs/ParaBank_Test_Cases_Specification.pdf](file:///c:/Users/ADMIN/Documents/ParaBank_api_ui_playwright/docs/ParaBank_Test_Cases_Specification.pdf).

### Test Distribution (Test Pyramid Strategy)

```
Banking Tests
│
├── API       40% (Fast, reliable data-layer validations, edge cases, contracts)
├── UI        30% (Critical user journeys, forms, DOM state, accessibility)
└── Hybrid    30% (Speed optimized: API setup → UI user action → API assertion)
```

- **API (40%)**: Fast feedback for auth, account creation, edge/negative tests (zero/negative transfer amounts, invalid IDs, HTTP status codes, headers, response schemas).
- **UI (30%)**: True user perspective testing for forms, navigation, dynamic tables, error states, and UX verification.
- **Hybrid (30%)**: The sweet spot for end-to-end banking workflows. Uses API for fast state preparation (seeding users, capturing pre-transfer balances), UI for critical user actions, and API for backend verification.

---

## 🏗️ Architecture & Project Structure

```
banking-playwright/
│
├── tests/
│   ├── ui/                         # Pure UI spec files
│   │   ├── login.spec.ts
│   │   ├── accounts.spec.ts
│   │   ├── transfer.spec.ts
│   │   ├── transactions.spec.ts
│   │   ├── billPayment.spec.ts
│   │   └── profile.spec.ts
│   │
│   ├── api/                        # Pure API spec files
│   │   ├── auth.api.spec.ts
│   │   ├── accounts.api.spec.ts
│   │   ├── transfer.api.spec.ts
│   │   ├── transactions.api.spec.ts
│   │   └── users.api.spec.ts
│   │
│   └── hybrid/                     # Hybrid API + UI E2E workflows
│       ├── transfer.e2e.spec.ts
│       ├── payment.e2e.spec.ts
│       ├── account.e2e.spec.ts
│       └── transaction.e2e.spec.ts
│
├── pages/                          # Page Object Model (POM)
│   ├── LoginPage.ts
│   ├── DashboardPage.ts
│   ├── AccountsPage.ts
│   ├── TransferPage.ts
│   ├── TransactionsPage.ts
│   ├── BillPaymentPage.ts
│   └── ProfilePage.ts
│
├── api/                            # API Service Client Layer
│   ├── AuthApi.ts
│   ├── AccountApi.ts
│   ├── TransferApi.ts
│   ├── TransactionApi.ts
│   └── UserApi.ts
│
├── fixtures/                       # Custom Playwright Fixtures
│   ├── baseFixture.ts
│   ├── apiFixture.ts
│   ├── authFixture.ts
│   └── bankingFixture.ts
│
├── test-data/                      # Static and schema test fixtures
│   ├── users.json
│   ├── accounts.json
│   ├── transfers.json
│   └── payments.json
│
├── utils/                          # Helper functions, data generators, assertions
│   ├── testDataGenerator.ts
│   ├── apiHelpers.ts
│   └── assertions.ts
│
├── auth/                           # Storage state / session caching
│   └── auth.json
│
├── playwright.config.ts            # Global Playwright configuration
├── package.json                    # Project dependencies and test scripts
├── tsconfig.json                   # TypeScript path aliases and configuration
└── README.md
```

---

## 🚀 Key Hybrid Workflow Example: Fund Transfer

```
API  ───> Authenticate & Fetch Source / Destination Accounts
API  ───> Snapshot initial balances
UI   ───> Log in & navigate to Transfer Funds page
UI   ───> Perform transfer submission
UI   ───> Assert transfer confirmation UI message
API  ───> Re-query account balances & assert mathematical accuracy
API  ───> Validate backend transaction log entry
```

---

## 🛠️ Getting Started

### 1. Install Dependencies
```bash
npm install
npx playwright install --with-deps
```

### 2. Configure Environment
Copy `.env.example` to `.env` and adjust credentials or endpoints if needed:
```bash
cp .env.example .env
```

### 3. Run Tests
```bash
# Run all tests
npm test

# Run specific test suites
npm run test:ui
npm run test:api
npm run test:hybrid

# Run in headed mode
npm run test:headed

# Interactive UI Mode
npm run test:ui-mode

# View HTML Report
npm run report
```
