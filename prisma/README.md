# Prisma Database Setup

This folder contains the Prisma schema and database management files for the Garibaldi Login service.

## Files Overview

| File | Purpose |
|------|---------|
| `schema.prisma` | Database schema definition (models, relations, etc.) |
| `seed.ts` | Script to populate the database with initial/default users |
| `migrations/` | Folder containing all database migration history |

---

## Seeding the Database

The `seed.ts` script creates default user accounts. It runs automatically during Docker container startup, but you can also run it manually.

### How Seeding Works

1. The script checks if each user in `SEED_USERS` array already exists
2. If the user doesn't exist, it creates them with a hashed password
3. If the user already exists, it skips them (idempotent - safe to run multiple times)

### Adding New Seed Users

Edit `seed.ts` and add entries to the `SEED_USERS` array:

```typescript
const SEED_USERS = [
  {
    email: 'existing@example.com',
    password: 'existingPassword',
  },
  // Add new users here:
  {
    email: 'newuser@example.com',
    password: 'securePassword123',
  },
];
```

### Running the Seed Script Manually

```bash
# From the garibaldi_login directory

# Option 1: Using npm script
npm run prisma:seed

# Option 2: Using npx directly
npx ts-node prisma/seed.ts

# Option 3: Using Prisma's built-in seed command
npx prisma db seed
```

---

## Database Migrations

Migrations track changes to your database schema over time. They ensure all environments (dev, staging, production) have the same database structure.

### When to Create a Migration

Create a new migration when you:
- Add a new model/table
- Add, remove, or modify columns
- Change indexes or constraints
- Modify relations between tables

### Creating a New Migration (Development)

```bash
# 1. Edit schema.prisma with your changes

# 2. Create and apply the migration
npx prisma migrate dev --name descriptive_name

# Example names:
# npx prisma migrate dev --name add_user_roles
# npx prisma migrate dev --name add_profile_fields
# npx prisma migrate dev --name remove_legacy_columns
```

This command will:
1. Generate a new migration file in `migrations/`
2. Apply the migration to your local database
3. Regenerate the Prisma Client

### Applying Migrations (Production/Docker)

In production or Docker environments, use `migrate deploy` instead:

```bash
npx prisma migrate deploy
```

This is already configured in the Dockerfile to run automatically on container startup.

### Viewing Migration Status

```bash
# See which migrations have been applied
npx prisma migrate status
```

### Resetting the Database (Development Only!)

⚠️ **WARNING: This deletes ALL data!**

```bash
# Reset database and re-run all migrations + seed
npx prisma migrate reset
```

---

## Common Workflows

### Local Development Setup

```bash
# 1. Make sure PostgreSQL is running (or use Docker)
docker compose up postgres -d

# 2. Apply migrations
npx prisma migrate dev

# 3. Seed the database (optional)
npm run prisma:seed

# 4. Start the dev server
npm run dev
```

### After Pulling New Code

```bash
# Apply any new migrations from teammates
npx prisma migrate dev

# Regenerate client (if schema changed)
npx prisma generate
```

### Schema Changes Workflow

```bash
# 1. Edit schema.prisma

# 2. Create migration
npx prisma migrate dev --name your_change_description

# 3. Update seed.ts if new fields need default values

# 4. Test locally

# 5. Commit all files:
#    - schema.prisma
#    - migrations/[timestamp]_your_change_description/
#    - seed.ts (if modified)
```

---

## Prisma Studio (Database GUI)

To visually browse and edit your database:

```bash
npx prisma studio
```

This opens a web interface at http://localhost:5555

---

## Useful Commands Reference

| Command | Description |
|---------|-------------|
| `npx prisma generate` | Regenerate Prisma Client after schema changes |
| `npx prisma migrate dev` | Create and apply migration (development) |
| `npx prisma migrate deploy` | Apply pending migrations (production) |
| `npx prisma migrate status` | Check migration status |
| `npx prisma migrate reset` | Reset DB and re-run all migrations ⚠️ |
| `npx prisma db seed` | Run the seed script |
| `npx prisma studio` | Open database GUI |
| `npx prisma format` | Format schema.prisma file |
| `npx prisma validate` | Validate schema.prisma syntax |

---

## Troubleshooting

### "Migration failed" errors

1. Check your `DATABASE_URL` in `.env`
2. Ensure PostgreSQL is running
3. Check if the database exists

### "Prisma Client not found" errors

```bash
npx prisma generate
```

### Schema drift (local DB doesn't match migrations)

```bash
# Check status
npx prisma migrate status

# If in development, reset:
npx prisma migrate reset
```
