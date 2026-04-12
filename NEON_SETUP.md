# Neon Setup Instructions

## Step 1: Create Neon Project
1. Go to https://console.neon.tech
2. Create a new project named `pubmedweb`
3. Choose PostgreSQL 16, region: us-east-2 (closest to Vercel)

## Step 2: Get Connection String
1. Click on your project
2. Go to "Connection string" section
3. Select "Pooled connection" 
4. Copy the full PostgreSQL URL

## Step 3: Add to Environment
```bash
# In .env.local (for local development)
DATABASE_URL=postgresql://...
DIRECT_URL=postgresql://...

# In Vercel Dashboard
# Settings > Environment Variables > Add DATABASE_URL & DIRECT_URL
```

## Step 4: Run Migrations
```bash
npx prisma migrate deploy
```

## Step 5: Seed Data (Optional)
```bash
DATABASE_URL="your_url" node scripts/seed.js
```

## Connection String Format
Pooler (for app): `postgresql://user:password@pooler.region.aws.neon.tech/dbname?sslmode=require`
Direct (for migrations): `postgresql://user:password@region.aws.neon.tech/dbname?sslmode=require`
