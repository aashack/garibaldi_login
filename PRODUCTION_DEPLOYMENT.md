# Garibaldi Login - Production Deployment Guide

## Overview

This service is now configured for production deployment on Render with Docker.

## Key Changes for Production

### 1. Dockerfile (Multi-Stage Build)

- **Build Stage**: Compiles TypeScript with all dependencies installed
- **Production Stage**: Only includes production dependencies, reducing image size
- **NODE_ENV=production**: Optimizes Node.js runtime
- **Migrations**: Automatically runs on container startup
- **Seed**: Optionally seeds default users (idempotent)

### 2. Build Process

The build script now:

```bash
tsc --rootDir . --outDir dist
```

This compiles both `src/` and `prisma/` folders to `dist/`.

### 3. Compiled Paths

- Source: `src/index.ts` → Build output: `dist/src/index.js`
- Seed: `prisma/seed.ts` → Build output: `dist/prisma/seed.js`

### 4. Startup Sequence

1. Runs migrations: `npx prisma migrate deploy`
2. Seeds database: `node dist/prisma/seed.js`
3. Starts server: `node dist/src/index.js`

## Environment Variables for Render

```
PORT=3000
NODE_ENV=production
DATABASE_URL=postgresql://authuser:[PASSWORD]@[HOST]:5432/auth?schema=public
REDIS_URL=redis://[HOST]:6379
JWT_SECRET=[SECURE_SECRET_KEY]
PORTAL_BASE_URL=https://your-portal-backend.onrender.com
FRONTEND_URL=https://your-portal.onrender.com
CORS_ORIGINS=https://your-portal.onrender.com,https://your-business-site.onrender.com
SMTP_HOST=[EMAIL_SERVICE_HOST]
SMTP_PORT=587
SMTP_USER=[EMAIL_USERNAME]
SMTP_PASS=[EMAIL_PASSWORD]
```

## Deployment Steps

1. **Connect Repository**: Link this repo to Render
2. **Set Build Command**: `npm install --production && npm run build`
3. **Set Start Command**: Docker handles this via CMD in Dockerfile
4. **Configure Environment Variables**: Use the values above (replace placeholders)
5. **Set Database URL**: Use the connection string from your Render PostgreSQL instance

## Database Setup

1. Create PostgreSQL instance on Render:

   - Name: `garibaldi-login-db`
   - Database: `auth`
   - User: `authuser`
   - Region: Same as service (US West Oregon)

2. Update `DATABASE_URL` in service environment with the connection string

## Health Checks

The service is ready when:

- Migrations complete without errors
- Server starts on port 3000
- CORS is properly configured

## Production Notes

- **Free Tier Limits**: 750 hours/month, services sleep after 15 min inactivity
- **Image Size**: Optimized with multi-stage build (~200mb vs ~400mb)
- **Seed Script**: Idempotent - won't duplicate users on restarts
- **HTTPS**: Render automatically provisions HTTPS certificates
- **Private Network**: Communication with other services in same region is private
