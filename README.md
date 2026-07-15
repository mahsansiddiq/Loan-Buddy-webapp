# LoanBuddy

## 📌 Overview

LoanBuddy is a role-based loan management platform that connects borrowers, lenders, and admins in one place. Borrowers can apply for loans and track repayments, lenders can review and fund applications, and admins can oversee the entire platform — all from dedicated dashboards built for each role.

The current build is a fully-designed frontend prototype: every flow — application, verification, approval, repayment, notifications — runs on mock data, so the entire user experience can be explored and demoed without a live backend.

## 🚀 Features

- **Role-Based Access**: Separate experiences and dashboards for Borrowers, Lenders, and Admins.
- **Loan Applications**: Borrowers submit loan requests with amount, purpose, term, income, and employment details.
- **Identity Verification**: Applicants upload primary and secondary ID documents for KYC-style verification.
- **Loan Approval Workflow**: Lenders and admins can approve, reject, or flag loan applications.
- **Loan Agreements**: Auto-generated agreement view once a loan is approved.
- **Repayments**: Borrowers log repayments and track outstanding balances against a due schedule.
- **Role-Specific Dashboards**: Borrower, lender, and admin dashboards each surface the metrics that matter to that role, with charts for loan activity and portfolio performance.
- **Admin Controls**: Manage all loans and users from a dedicated admin panel.
- **Notifications**: In-app notification center and dropdown for approvals, rejections, and payment reminders.
- **Profile & Settings**: Editable user profiles and notification preferences.
- **Light/Dark Mode**: Theme toggle across the entire app.

## 🛠 Tech Stack

[![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/) [![React](https://img.shields.io/badge/React-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)](https://react.dev/) [![TypeScript](https://img.shields.io/badge/TypeScript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/) [![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/) [![Radix UI](https://img.shields.io/badge/Radix%20UI-161618.svg?style=for-the-badge&logo=radixui&logoColor=white)](https://www.radix-ui.com/) [![React Hook Form](https://img.shields.io/badge/React%20Hook%20Form-EC5990?style=for-the-badge&logo=reacthookform&logoColor=white)](https://react-hook-form.com/) [![Zod](https://img.shields.io/badge/Zod-3E67B1?style=for-the-badge&logo=zod&logoColor=white)](https://zod.dev/) [![Recharts](https://img.shields.io/badge/Recharts-22B5BF?style=for-the-badge)](https://recharts.org/) [![Vercel](https://img.shields.io/badge/Vercel-%23000000.svg?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com/)

- **Framework**: Next.js 14 (App Router) + React 18
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4 with `shadcn/ui` components (Radix UI primitives)
- **Forms & Validation**: React Hook Form + Zod
- **Charts**: Recharts
- **Theming**: next-themes (light/dark mode)
- **Analytics**: Vercel Analytics
- **Data Layer**: Mock data and mock authentication (see [Demo Accounts](#-demo-accounts) below) — ready to be swapped for a real API and database.

## 🔧 Installation

1. Clone the repository:

```
git clone https://github.com/mahsansiddiq/Loan-Buddy-webapp
cd Loan-Buddy-webapp
```

2. Install dependencies:

```
pnpm install
```

3. Run the development server:

```
pnpm dev
```

The app will be running at `http://localhost:3000`

No environment variables or database setup are required — the app runs entirely on the mock data in `lib/mock-data.ts` and `lib/auth.ts`.

## 🔑 Demo Accounts

LoanBuddy currently ships with mock authentication so reviewers can try every role without signing up. Log in with any of the accounts below using the password `password`:

| Role     | Email               |
|----------|----------------------|
| Borrower | john@example.com     |
| Lender   | sarah@example.com    |
| Admin    | admin@example.com    |

New borrower and lender accounts can also be created from the registration page.

## 🚀 What's Next?

- Add cloud file storage for ID verification documents.
- Deploy a live demo on Vercel.

## 🤝 Contributors

- **Muhammad Ahsan** – UI Designer
- **Farah Ali** – Front-end Developer
- **Rubesha Ali** - Back-end Developer

## Acknowledgments

We would like to thank **Dr. Rabeea Jaffri** for their guidance, project supervision, and continuous mentorship throughout this project.

## 🎯 Support Us

If you like this project, consider giving it a ⭐ on GitHub!
