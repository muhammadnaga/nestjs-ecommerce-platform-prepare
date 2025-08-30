## System Architecture

This platform follows a modular, layered architecture using NestJS.

### High-level Diagram

```mermaid
%% The rendered diagram is available in /api/docs and below
```

Core components:
- API Layer: NestJS controllers expose REST endpoints under `/api/v1`
- Application Layer: Services contain business logic per module
- Data Layer: Prisma ORM + PostgreSQL models and queries
- Cache/Queue: Redis for caching and Bull queues (extensible)
- Observability: Swagger/OpenAPI, health checks, structured logs

Modules:
- Auth, Users, Sellers, Products, Cart, Orders, Payments, Reviews, Wishlists, Notifications, Files, Analytics

External Integrations:
- Stripe (payments), SMTP/SES (mail), S3/CDN (files)

### Request Flow
1. Client calls a REST endpoint (e.g. `POST /api/v1/auth/login`)
2. Controller validates DTO and delegates to Service
3. Service orchestrates repositories via Prisma
4. Caching/queues applied where relevant
5. Response serialized back to client


