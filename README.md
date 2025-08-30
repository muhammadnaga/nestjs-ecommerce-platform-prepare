# 🛒 Enterprise E-Commerce Platform

A comprehensive multi-vendor e-commerce platform built with NestJS, Prisma, PostgreSQL, and Redis.

## ✨ Features

### 🔐 Authentication & Authorization
- JWT-based authentication with refresh tokens
- Role-based access control (Customer, Seller, Admin, Super Admin)
- Email verification system
- Secure password hashing with Argon2

### 👥 User Management
- User profiles with customizable data
- Multiple address management
- Seller registration and verification
- Admin dashboard capabilities

### 🛍️ Product Management
- Hierarchical category system
- Product variants with pricing and inventory
- Multiple product images
- Product attributes and specifications
- Advanced search and filtering

### 🛒 Shopping Experience
- Shopping cart functionality
- Wishlist management
- Order tracking and history
- Review and rating system

### 💳 Payment Processing
- Multiple payment gateway support
- Secure payment handling
- Refund management
- Transaction history

### 🚀 Advanced Features
- Redis caching for performance
- Background job processing with Bull
- File upload with image optimization
- Comprehensive logging with Winston
- Rate limiting and security middleware
- Swagger API documentation

## 🛠️ Tech Stack

- **Framework**: NestJS with TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Cache**: Redis
- **Authentication**: JWT with Passport
- **File Upload**: Multer with Sharp for image processing
- **Validation**: Class Validator & Class Transformer
- **Documentation**: Swagger/OpenAPI
- **Security**: Helmet, CORS, Rate Limiting
- **Background Jobs**: Bull Queue
- **Containerization**: Docker & Docker Compose

## 🚀 Quick Start

### Prerequisites

- Node.js 20+
- Docker and Docker Compose
- pnpm (recommended) or npm

### 1. Clone and Install

```bash
git clone <repository-url>
cd nestjs-ecommerce-platform-prepare
pnpm install
```

### 2. Environment Setup

Copy the environment template:
```bash
cp .env.example .env
```

Update the `.env` file with your configuration:
```env
NODE_ENV=development
PORT=3000
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/ecommerce_dev?schema=public"
REDIS_URL="redis://localhost:6379"
JWT_SECRET="your-super-secret-jwt-key"
JWT_ACCESS_TOKEN_EXPIRES_IN="15m"
JWT_REFRESH_TOKEN_EXPIRES_IN="7d"
```

### 3. Start Infrastructure

Start PostgreSQL and Redis:
```bash
docker compose up -d
```

### 4. Database Setup

Generate Prisma client and run migrations:
```bash
pnpm prisma:generate
pnpm prisma:push
pnpm prisma:seed
```

### 5. Start the Application

```bash
pnpm start:dev
```

The API will be available at:
- **API**: http://localhost:3000/api/v1
- **Documentation**: http://localhost:3000/api/docs
- **Health Check**: http://localhost:3000/api/v1/health

## 📚 API Documentation

Visit http://localhost:3000/api/docs for interactive Swagger documentation.

### Test Users

The seed script creates these test users:

| Role     | Email                  | Password    |
|----------|------------------------|-------------|
| Admin    | admin@ecommerce.com    | admin123    |
| Customer | customer@example.com   | customer123 |
| Seller   | seller@example.com     | seller123   |

## 🔧 Development Tools

### Database Management
- **Adminer**: http://localhost:8080 (Database GUI)
- **Prisma Studio**: `pnpm prisma:studio`

### Redis Management
- **Redis Commander**: http://localhost:8081

### Available Scripts

```bash
# Development
pnpm start:dev          # Start in watch mode
pnpm start:debug        # Start in debug mode

# Building
pnpm build              # Build for production
pnpm start:prod         # Start production build

# Database
pnpm prisma:generate    # Generate Prisma client
pnpm prisma:push        # Push schema to database
pnpm prisma:migrate     # Create and run migrations
pnpm prisma:studio      # Open Prisma Studio
pnpm prisma:seed        # Seed database with sample data

# Docker
pnpm docker:up          # Start Docker services
pnpm docker:down        # Stop Docker services

# Testing & Quality
pnpm test               # Run unit tests
pnpm test:e2e           # Run e2e tests
pnpm lint               # Run ESLint
pnpm format             # Format code with Prettier
```

## 🏗️ Project Structure

```
src/
├── common/                 # Shared utilities
│   ├── decorators/        # Custom decorators
│   └── guards/            # Authentication & authorization guards
├── config/                # Configuration management
├── modules/               # Feature modules
│   ├── auth/              # Authentication & authorization
│   ├── users/             # User management
│   ├── products/          # Product & category management
│   ├── orders/            # Order & cart management
│   ├── payments/          # Payment processing
│   ├── notifications/     # Notification system
│   ├── files/             # File upload & management
│   └── analytics/         # Analytics & reporting
├── prisma/                # Database configuration
└── main.ts                # Application entry point
```

## 🔒 Security Features

- **Helmet**: Security headers
- **CORS**: Cross-origin resource sharing
- **Rate Limiting**: API request throttling
- **Input Validation**: Comprehensive request validation
- **JWT Security**: Secure token-based authentication
- **Password Hashing**: Argon2 for secure password storage

## 📊 Monitoring & Observability

- Health check endpoints
- Structured logging with Winston
- Performance monitoring
- Error tracking and reporting

## 🚢 Deployment

### Docker Production Build

```bash
docker build -t ecommerce-api .
docker run -p 3000:3000 ecommerce-api
```

### AWS Deployment Ready

The application is configured for AWS deployment with:
- ECS/EKS container orchestration
- RDS for PostgreSQL
- ElastiCache for Redis
- S3 for file storage
- CloudFront for CDN

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new features
5. Ensure all tests pass
6. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Check the documentation at `/api/docs`
- Review the health check at `/api/v1/health`
- Check application logs for debugging

---

**Happy coding! 🚀**