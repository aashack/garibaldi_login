# Garibaldi Login

A secure authentication service built with Express.js, TypeScript, and Prisma. Features user registration, login, password reset functionality, and JWT-based authentication.

## Features

- User authentication with JWT tokens
- Password reset via email
- PostgreSQL database with Prisma ORM
- Redis for token blacklisting
- Docker containerization
- TypeScript for type safety

## Quick Start

1. Clone the repository
2. Set up your environment variables in `.env`
3. Start the services:
```bash
docker-compose up -d
```

4. Run database migrations:
```bash
docker-compose exec garibaldi_login npx prisma migrate deploy
```

5. Generate Prisma client:
```bash
docker-compose exec garibaldi_login npx prisma generate
```

## API Routes

### Authentication Endpoints

- `POST /api/auth/random-user` - Create a test user with random credentials
- `POST /api/auth/login` - Authenticate user and return JWT token
- `POST /api/auth/forgot-password` - Send password reset email
- `POST /api/auth/reset-password` - Reset password using token

### Health Check

- `GET /` - Service health check

## Database Schema

### User Model
```prisma
model User {
  id            String          @id @default(uuid())
  username      String          @unique
  email         String          @unique
  passwordHash  String
  createdAt     DateTime        @default(now())
  updatedAt     DateTime        @updatedAt
  PasswordReset PasswordReset[]
}
```

### PasswordReset Model
```prisma
model PasswordReset {
  id        String   @id @default(uuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id])
  token     String   @unique
  expiresAt DateTime
  used      Boolean  @default(false)
  createdAt DateTime @default(now())

  @@index([token])
}
```

## Environment Variables

Required environment variables (configured in docker-compose.yml):
- `DATABASE_URL` - PostgreSQL connection string
- `REDIS_URL` - Redis connection string
- `JWT_SECRET` - Secret key for JWT signing
- `SMTP_HOST` - SMTP server host
- `SMTP_PORT` - SMTP server port
- `SMTP_USER` - SMTP username
- `SMTP_PASS` - SMTP password

## Development

- Built with TypeScript
- Uses Prisma for database management
- Express.js for the web framework
- bcryptjs for password hashing
- jsonwebtoken for JWT handling
- nodemailer for email sending
- ioredis for Redis operations

## License

ISC