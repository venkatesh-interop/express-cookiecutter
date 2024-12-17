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

    db = drizzle(pool, { schema });
  }
  return db;
};

export { db };
