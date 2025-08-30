## Installation & Setup

### Prerequisites
- Node.js 20+
- pnpm (recommended) or npm
- PostgreSQL 16+
- Redis 7+

Optional: Docker/Docker Compose

### Clone & Install
```
git clone <repo-url>
cd nestjs-ecommerce-platform-prepare
pnpm install
```

### Configure Environment
```
cp .env.example .env
```
Edit `.env` values for your environment.

### Database
```
pnpm prisma:generate
pnpm prisma:push
pnpm prisma:seed
```

### Run
```
pnpm start:dev
```

### Services
- API: http://localhost:3000/api/v1
- Swagger: http://localhost:3000/api/docs
- Health: http://localhost:3000/api/v1/health


