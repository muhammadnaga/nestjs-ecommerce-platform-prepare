## API Endpoints

OpenAPI docs: http://localhost:3000/api/docs

### Auth
- POST /api/v1/auth/register
- POST /api/v1/auth/login
- POST /api/v1/auth/refresh
- POST /api/v1/auth/verify-email (protected)
- GET  /api/v1/auth/profile (protected)

### Users (protected)
- GET /api/v1/users/profile
- PUT /api/v1/users/profile
- GET /api/v1/users/addresses
- POST /api/v1/users/addresses
- PUT /api/v1/users/addresses/:id
- DELETE /api/v1/users/addresses/:id

### Sellers
- POST /api/v1/sellers/register (protected)
- GET  /api/v1/sellers/profile (protected)
- PUT  /api/v1/sellers/profile (protected)
- GET  /api/v1/sellers/dashboard (protected)
- GET  /api/v1/sellers (admin)
- PUT  /api/v1/sellers/:sellerId/status (admin)

### Products (public)
- GET /api/v1/products
- GET /api/v1/products/:id
- GET /api/v1/categories
- GET /api/v1/categories/:id

### Cart (protected)
- GET    /api/v1/cart
- POST   /api/v1/cart/items
- PUT    /api/v1/cart/items/:itemId
- DELETE /api/v1/cart/items/:itemId
- POST   /api/v1/cart/coupon/apply
- DELETE /api/v1/cart/coupon
- DELETE /api/v1/cart

### Orders (protected)
- GET /api/v1/orders
- GET /api/v1/orders/:id

### Payments (protected)
- GET /api/v1/payments
- GET /api/v1/payments/:id

### Reviews
- POST   /api/v1/reviews (protected)
- GET    /api/v1/reviews/product/:productId (public)
- GET    /api/v1/reviews/my-reviews (protected)
- PUT    /api/v1/reviews/:reviewId (protected)
- DELETE /api/v1/reviews/:reviewId (protected)
- PUT    /api/v1/reviews/:reviewId/helpful (protected)

### Wishlists (protected)
- POST   /api/v1/wishlists
- GET    /api/v1/wishlists
- DELETE /api/v1/wishlists/:itemId
- POST   /api/v1/wishlists/:itemId/move-to-cart
- DELETE /api/v1/wishlists

### Notifications (protected)
- GET /api/v1/notifications
- PUT /api/v1/notifications/:id/read
- PUT /api/v1/notifications/read-all

### Files (protected)
- POST   /api/v1/files/upload
- DELETE /api/v1/files/:filename


