## Troubleshooting & FAQ

### Server fails to start: Prisma P1000
Database auth failed. Ensure `DATABASE_URL` is correct and DB is running.

### Redis connection refused
Start Redis or switch to memory cache in development.

### Swagger not available
Check `NODE_ENV` (Swagger disabled in production by default).

### Email validation errors at boot
Ensure `MAIL_*` envs are valid or leave them blank (see config validation).


