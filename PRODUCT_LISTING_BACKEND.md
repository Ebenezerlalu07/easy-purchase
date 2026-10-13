# Easy Purchase — Customer Product Listing

## What changed

- The customer product listing now loads from MongoDB through `GET /api/store/products`.
- The endpoint is public and returns only products with `status: "Active"` (records without a status are treated as Active for compatibility with older catalogue records).
- Draft and Inactive products remain hidden from customers; the existing admin product API remains authenticated and unchanged.
- Search, sorting, pagination, category/brand filters, and the existing visual design are retained. Category and brand options are derived from the active catalogue rather than hard-coded sample data.
- Loading and API error states are shown when needed.
- Out-of-stock items are labelled and cannot be added to the cart; the In Stock filter includes all products with positive stock.

## API response

`GET /api/store/products` returns `{ products: [...], count: number }` and disables caching so catalogue changes can appear without a stale response.

## Requirements

Configure `MONGODB_URI` and optionally `MONGODB_DB` in `.env.local` as described in `MONGODB_ATLAS_SETUP.md`. The endpoint reads the existing `products` collection; it does not seed mock records or change the database schema.
