# Database Migrations

This directory holds Prisma migration histories for PostgreSQL.

## Running Migrations

To generate and apply migrations against your PostgreSQL instance:

```bash
# Set your DATABASE_URL in root or apps/api .env
# Example: DATABASE_URL="postgresql://postgres:password@localhost:5432/docme_cms?schema=public"

# Run Prisma migration
npx prisma migrate dev --name init --schema=database/schema/schema.prisma

# Generate Prisma Client
npx prisma generate --schema=database/schema/schema.prisma

# Seed database
npx tsx database/seeds/seed.ts
```
