## Enterprise E-Commerce Platform – Knowledge Base

This documentation is the single source of truth for understanding, running, and extending the Enterprise E‑Commerce Platform built with NestJS, Prisma, PostgreSQL, and Redis.

### Quick Links
- Overview
  - [Architecture](./overview/architecture.md)
  - [Project Structure](./overview/project-structure.md)
- Setup
  - [Installation](./setup/installation.md)
  - [Environment Variables](./setup/environment.md)
- Features (How-to Guides)
  - [Authentication](./features/auth.md)
  - [Users](./features/users.md)
  - [Sellers](./features/sellers.md)
  - [Products](./features/products.md)
  - [Cart](./features/cart.md)
  - [Orders](./features/orders.md)
  - [Payments](./features/payments.md)
  - [Reviews](./features/reviews.md)
  - [Wishlists](./features/wishlists.md)
  - [Notifications](./features/notifications.md)
  - [Files](./features/files.md)
  - [Analytics](./features/analytics.md)
- API Reference
  - [Endpoints and Usage](./api/endpoints.md)
- Development
  - [Workflow](./development/workflow.md)
  - [Contributing](./development/contributing.md)
- Support
  - [Troubleshooting](./troubleshooting/faq.md)
  - [Common Errors](./troubleshooting/common-errors.md)

### Fast Start
1) Copy envs: `cp .env.example .env`
2) Start infra (Postgres/Redis) or adjust envs
3) Prisma: `pnpm prisma:generate && pnpm prisma:push && pnpm prisma:seed`
4) Run API: `pnpm start:dev`
5) Docs: http://localhost:3000/api/docs


