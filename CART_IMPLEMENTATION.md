# Customer Cart

The customer cart uses the existing `toprange_cart` browser storage key so the product listing, navbar, and `/cart` page share the same cart.

## Included behavior
- Add active, in-stock products from `/products`.
- Increase/decrease quantities and remove items on `/cart`.
- Prevent quantities from exceeding the latest known stock.
- Persist cart changes in localStorage and dispatch `toprange-cart-updated` for navbar count refreshes.
- On cart load, refresh each saved item against `GET /api/store/products`; current product names, prices, and stock are used, and unavailable/out-of-stock products are removed.
- Existing cart design and quotation-request UI are preserved.

No checkout, payment, customer account, or order-management flow is added.
