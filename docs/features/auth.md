## Authentication

JWT-based authentication with refresh tokens and RBAC.

### Endpoints
- `POST /api/v1/auth/register`: Register (email, password, phone?)
- `POST /api/v1/auth/login`: Login (email, password)
- `POST /api/v1/auth/refresh`: Refresh access token
- `POST /api/v1/auth/verify-email`: Verify email (protected)
- `GET /api/v1/auth/profile`: Current user (protected)

### Usage
```
POST /api/v1/auth/login
{
  "email": "user@example.com",
  "password": "password123"
}
```

Response:
```
{
  "accessToken": "...",
  "refreshToken": "...",
  "user": { "id": "...", "email": "...", "role": "CUSTOMER" }
}
```

Send `Authorization: Bearer <accessToken>` for protected routes.

### Roles
- CUSTOMER, SELLER, ADMIN, SUPER_ADMIN


