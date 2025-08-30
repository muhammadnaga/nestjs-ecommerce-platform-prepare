## Project Structure

```
src/
  common/               # Shared decorators, guards
  config/               # App config, validation
  modules/
    auth/
    users/
    sellers/
    products/
    orders/             # includes cart/
    payments/
    reviews/
    wishlists/
    notifications/
    files/
    analytics/
  prisma/
    prisma.module.ts
    prisma.service.ts

prisma/
  schema.prisma         # Database schema
  seed.ts               # Seed data

docs/                   # Knowledge base (this)
```

Key conventions:
- DTOs live in `module/dto/`, controllers in `module/*.controller.ts`, services in `module/*.service.ts`
- Endpoints are versioned under `/api/v1`
- Swagger groups endpoints using tags per module


