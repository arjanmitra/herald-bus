# Database Migration Guide

## Setting Up Vercel Postgres

### 1. Create a Vercel Postgres Database

1. Go to your [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project (or create a new one)
3. Go to the **Storage** tab
4. Click **Create Database**
5. Select **Postgres**
6. Choose a database name and region
7. Click **Create**

### 2. Get Your Database Connection Strings

After creating the database:

1. Go to the **Settings** tab of your database
2. Copy the environment variables
3. You'll see variables like:
   - `POSTGRES_URL`
   - `POSTGRES_PRISMA_URL`
   - `POSTGRES_URL_NON_POOLING`
   - `POSTGRES_USER`
   - `POSTGRES_HOST`
   - `POSTGRES_PASSWORD`
   - `POSTGRES_DATABASE`

### 3. Set Up Local Environment

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Fill in your database credentials in `.env.local`

3. Add your Herald API key and email credentials

### 4. Initialize Database Tables

You can initialize the database tables in one of two ways:

#### Option A: Automatic (via API call)

The tables will be created automatically on first use. However, you can manually trigger initialization:

```bash
# Start your dev server
npm run dev

# In another terminal, run:
curl http://localhost:3000/api/init-db
```

Or create a simple initialization route by adding `app/api/init-db/route.ts`:

```typescript
import { NextResponse } from 'next/server';
import { initDB } from '../../../lib/db';

export async function GET() {
    const success = await initDB();
    if (success) {
        return NextResponse.json({ message: 'Database initialized successfully' });
    }
    return NextResponse.json({ error: 'Database initialization failed' }, { status: 500 });
}
```

#### Option B: Manual (via psql or Vercel dashboard)

1. Go to your Vercel Postgres dashboard
2. Click on the **Query** tab
3. Copy and paste the contents of `lib/schema.sql`
4. Click **Execute**

Or use `psql`:
```bash
psql $POSTGRES_URL < lib/schema.sql
```

### 5. Deploy to Vercel

1. Push your code to GitHub (you've already done this)

2. In Vercel dashboard:
   - Go to your project settings
   - Navigate to **Environment Variables**
   - Add all the environment variables from `.env.local`
   - Make sure to add them for **Production**, **Preview**, and **Development** environments

3. Redeploy your application

### 6. Verify the Migration

Test your deployed app:
1. Try signing up for a new account
2. Upload a PDF file
3. Check that your history is persisted
4. Sign out and sign back in - your data should still be there

## Key Changes from lowdb

- **Users table**: Stores user accounts with hashed passwords
- **Sessions table**: Manages user sessions with expiration
- **Upload_history table**: Stores all PDF uploads and extraction metadata
- **Automatic cleanup**: Expired sessions are automatically ignored
- **Better performance**: SQL queries are much faster than JSON file operations
- **Production ready**: Works in serverless environments like Vercel

## Troubleshooting

### Connection Errors

If you see connection errors:
1. Verify your connection strings are correct
2. Check that your Vercel Postgres database is active
3. Ensure you're not hitting connection limits (upgrade your plan if needed)

### Table Not Found

If you see "table does not exist" errors:
1. Run the database initialization (see Step 4 above)
2. Verify tables were created in Vercel Postgres dashboard

### Development vs Production

- **Development**: Uses `.env.local` file
- **Production**: Uses Vercel environment variables
- Make sure both have the same database credentials (or use separate dev/prod databases)
