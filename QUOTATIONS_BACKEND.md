# Quotations backend integration

The existing quotations UI has not been redesigned or restyled.

## Backend
- `POST /api/quotations` accepts public quotation requests.
- `GET /api/quotations` returns quotations and requires the existing admin session cookie.
- `PATCH /api/quotations` updates quotation status/details and requires the existing admin session cookie.
- Data is persisted in `data/quotations.json` for the current local/server filesystem deployment.

## Frontend integration
- The existing customer quotation form now submits to `POST /api/quotations`.
- The existing admin quotations page loads from `GET /api/quotations`.
- The existing `Update Quotation` button advances the quotation through the current workflow: New -> Reviewing -> Quoted -> Approved -> Completed.
- Existing markup, Tailwind classes, layout, and visual styling were left unchanged.

## Important production note
`data/quotations.json` is suitable for local development or a persistent server filesystem. Vercel/serverless deployments should replace `lib/quotations.js` with a real database adapter (Firestore, MongoDB, PostgreSQL, etc.) before production because serverless filesystem writes are not durable.
