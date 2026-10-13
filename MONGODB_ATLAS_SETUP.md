# MongoDB Atlas setup — Easy Purchase

The Products and Quotations API now use MongoDB Atlas instead of JSON-file persistence. No mock products or quotations are inserted. Existing admin UI markup/styles are unchanged.

## 1. Configure the connection

1. Create a MongoDB Atlas cluster.
2. Create a database user and allow your development IP in Network Access.
3. Copy the Node.js driver connection string from **Connect → Drivers**.
4. In the project root, create `.env.local` and set:

```env
MONGODB_URI=mongodb+srv://YOUR_USER:YOUR_PASSWORD@YOUR_CLUSTER.mongodb.net/easy_purchase?retryWrites=true&w=majority
MONGODB_DB=easy_purchase
JWT_SECRET=replace-with-a-random-secret-at-least-32-characters-long
ADMIN_EMAIL=admin@easypurchase.ae
ADMIN_PASSWORD=replace-with-a-strong-password
ADMIN_NAME=Global Admin
ADMIN_ROLE=Super Administrator
ADMIN_SESSION_TTL=28800
```

URL-encode special characters in the database username/password if required. Do not commit `.env.local` or share its values.

## 2. Install and run

```bash
npm install
npm run dev
```

Restart Next.js after changing environment variables.

## 3. Data

MongoDB database: `easy_purchase` (or `MONGODB_DB`). Collections used by this integration:

- `products` — actual product records
- `quotations` — real customer quotation submissions
- `counters` — atomically generates quotation reference numbers

No records are seeded. Empty collections result in empty UI states until real data is submitted/created. The `data/products.json` and `data/quotations.json` files are left empty for clarity and are no longer used by the API.

## 4. Notes

- Admin authentication remains configured through environment variables and the existing JWT session cookie; this patch does not move admin credentials into MongoDB.
- This patch migrates the existing Products and Quotations persistence layer. Other admin sections should be migrated to MongoDB when their backend APIs are implemented.
- For production deployment, set the same environment variables in the hosting provider and restrict Atlas Network Access to the required trusted sources.
