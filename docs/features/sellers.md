## Sellers

Multi-vendor seller accounts with approval workflow.

### Endpoints
- `POST /api/v1/sellers/register` (protected)
- `GET /api/v1/sellers/profile` (protected)
- `PUT /api/v1/sellers/profile` (protected)
- `GET /api/v1/sellers/dashboard` (protected)
- `GET /api/v1/sellers` (admin)
- `PUT /api/v1/sellers/:sellerId/status` (admin)

### Register
```
POST /api/v1/sellers/register
{
  "businessName": "Tech Store Inc.",
  "taxId": "TAX123456789",
  "documents": {"license": "..."},
  "bankDetails": {"account": "..."}
}
```

Status transitions: PENDING → APPROVED/REJECTED/SUSPENDED


