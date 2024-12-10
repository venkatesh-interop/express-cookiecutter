import { env } from "@/variables";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "@/db/schema";

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
