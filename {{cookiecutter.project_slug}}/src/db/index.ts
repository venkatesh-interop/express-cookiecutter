// postgresql
import { Pool } from 'pg';

// drizzle
import { drizzle } from 'drizzle-orm/node-postgres';

// environment variables
import { env } from '@/variables';

// schema
import * as schema from '@/db/schema';

let db: any = null;

export const connectToPg = async () => {
  if (!db) {
    const pool = new Pool({
      connectionString: env.DATABASE_URL,
    });

    // Log successful connection when the pool is created
    pool.on('connect', () => {
      console.log('Connected to PostgreSQL');
    });

    // Handle connection errors
    pool.on('error', (error: any) => {
      console.error('PostgreSQL connection error:', error);
    });

    // Acquire a client connection from the pool
    await pool.connect();

    db = drizzle(pool, { schema });
  }
  return db;
};

export { db };
