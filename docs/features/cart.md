## Cart

### Endpoints (protected)
- `GET /api/v1/cart` – get cart with totals
- `POST /api/v1/cart/items` – add item `{ variantId, quantity }`
- `PUT /api/v1/cart/items/:itemId` – update quantity
- `DELETE /api/v1/cart/items/:itemId` – remove item
- `POST /api/v1/cart/coupon/apply` – apply coupon `{ code }`
- `DELETE /api/v1/cart/coupon` – remove coupon
- `DELETE /api/v1/cart` – clear cart

### Example
```
POST /api/v1/cart/items
{
  "variantId": "pv_123",
  "quantity": 2
}
```

Returns subtotal, discount, total.


