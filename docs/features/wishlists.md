## Wishlists

### Endpoints (protected)
- `POST /api/v1/wishlists` – add product or variant
- `GET /api/v1/wishlists` – get wishlist
- `DELETE /api/v1/wishlists/:itemId` – remove
- `POST /api/v1/wishlists/:itemId/move-to-cart` – move to cart
- `DELETE /api/v1/wishlists` – clear

### Example
```
POST /api/v1/wishlists
{ "variantId": "pv_123" }
```


