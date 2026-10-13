This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.


## Admin Authentication

The admin area now uses a server-side JWT session stored in an HttpOnly cookie. Protected `/admin/*` routes are rejected by middleware unless a valid session exists.

1. Copy `.env.example` to `.env.local`.
2. Set a random `JWT_SECRET` with at least 32 characters.
3. Set `ADMIN_EMAIL` and `ADMIN_PASSWORD` to the administrator credentials you want to use.
4. Start the app with `npm run dev`.
5. Open `/admin/login`.

The included development credentials in the prepared local environment are `admin@easypurchase.ae` / `Admin@12345`. Change them before production deployment.

Authentication endpoints:
- `POST /api/admin/auth/login`
- `POST /api/admin/auth/logout`
- `GET /api/admin/auth/me`

The session defaults to 8 hours and is automatically rejected after expiry.


## Automatic quotation email setup

Install dependencies with `npm install` after pulling the updated project. Configure these variables in `.env.local` (never commit real credentials):

- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`: SMTP credentials for the sender mailbox.
- `SMTP_FROM`: verified sender display name/address (optional; defaults to `SMTP_USER`).
- `QUOTATION_ADMIN_EMAIL`: defaults to `aswinptoffical@gmail.com`.
- `QUOTATION_VAT_RATE`: VAT percentage used for the automatic estimate; defaults to `0`. Set the correct rate before production.
- `QUOTATION_PAYMENT_TERMS`, `QUOTATION_DELIVERY_TERMS`, `QUOTATION_VALIDITY`: estimate template terms.

When a customer submits a cart quotation request, the API saves the request to MongoDB, generates a PDF estimate in the Top Range Building Materials style, emails the estimate to the customer, and sends the admin a notification with the same PDF attached. If SMTP delivery fails, the request remains saved and the API returns a warning instead of pretending the emails were sent.

For Gmail SMTP, use an app password with 2-Step Verification enabled; do not use your normal account password.
