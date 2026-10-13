# Category and Brand dropdown integration

The Add Product form now loads category and brand names from the authenticated MongoDB APIs (`/api/categories` and `/api/brands`). Only Active records appear in the dropdowns. The product API validates that the submitted category and brand exist and are Active in MongoDB.

The Categories and Brands admin pages now read/write MongoDB and no longer start with demo records. Collections are created automatically by MongoDB on first insert; no seed data is inserted.

Required `.env.local` variables:

```env
MONGODB_URI=your-mongodb-atlas-connection-string
MONGODB_DB=easy_purchase
JWT_SECRET=your-generated-32-character-or-longer-secret
```

Restart the dev server after updating environment variables. Create categories and brands in their admin pages before creating products. Product create/edit/list/delete endpoints remain protected by the existing admin session.
