## Reviews

### Endpoints
- `POST /api/v1/reviews` (protected)
- `GET /api/v1/reviews/product/:productId` (public)
- `GET /api/v1/reviews/my-reviews` (protected)
- `PUT /api/v1/reviews/:reviewId` (protected)
- `DELETE /api/v1/reviews/:reviewId` (protected)
- `PUT /api/v1/reviews/:reviewId/helpful` (protected)

### Create Review
```
POST /api/v1/reviews
{
  "productId": "prod_123",
  "rating": 5,
  "title": "Great!",
  "content": "Loved the quality."
}
```


