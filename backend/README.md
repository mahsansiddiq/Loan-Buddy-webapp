# LoanBuddy Backend (Express + MySQL)

Node.js + Express + MySQL backend for LoanBuddy. This implementation has no interest-related fields or calculations by request. It supports JWT auth, loans, approvals, agreement acceptance, repayments, and S3 pre-signed uploads for NIC images.

## Quick Start
1. Copy `.env.example` to `.env` and fill values for MySQL and S3.
2. Create the database schema using the SQL in `scripts/sql/001_init.sql`.
3. From `backend/`: `npm install` then `npm run dev`.
4. Health check: `GET /api/health`

## Key Endpoints
Auth:
- POST /api/auth/register
- POST /api/auth/login

Users:
- GET /api/users/me
- PATCH /api/users/me

Loans:
- POST /api/loans
- GET /api/loans?status=PENDING&role=borrower|lender
- GET /api/loans/:id
- POST /api/loans/:id/review { action: approve|reject, schedule?: [{dueDate,amount}] }
- POST /api/loans/:id/accept { party: borrower|lender, agreementS3Key?, agreementS3Url? }
- POST /api/loans/:id/payments { amount, paymentDate, method?, note? }

Uploads:
- POST /api/uploads/presign { folder?, fileName?, contentType } → returns `uploadUrl`, `key`, `fileUrl`

## S3 NIC Storage Paths
NIC images are recommended to be stored under:
- users/{userId}/nic/{uuid}.jpg

The presign endpoint returns:
- key → S3 object key
- uploadUrl → pre-signed PUT URL (valid 5 minutes)
- fileUrl → absolute URL (store this in DB for display)

## Notes
- Set CORS_ORIGIN to your frontend URL.
- For AWS RDS MySQL, set MYSQL_* envs. Use a private subnet and security groups as per your VPC.
- Use IAM roles on EC2 instead of static AWS keys when possible.
- Loan schedule splits principal only; there are no interest fields.
