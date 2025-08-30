## Development Workflow

### Commands
- `pnpm start:dev` – run locally with watch
- `pnpm build` – compile TypeScript
- `pnpm lint` – run ESLint
- `pnpm prisma:generate` – generate Prisma client
- `pnpm prisma:push` – apply schema to DB
- `pnpm prisma:seed` – seed data

### Branching
- `main` – stable
- feature branches – `feat/<module>`

### Code Style
- DTOs validated with `class-validator`
- Services contain business logic; controllers are thin
- Prefer early returns, typed responses, and error handling

### API Docs
- Swagger at `/api/docs`, auto-updated via decorators


