import { env } from '@/variables';
import { defineConfig } from 'drizzle-kit';

// Export drizzleConfig after async setup
export default defineConfig({
    out: './src/db/migrations',
    schema: './src/db/schema/*.ts',
    dialect: 'postgresql',
    dbCredentials: {
        host: env.POSTGRES_HOST || "localhost",
        database: env.POSTGRES_DATABASE || "mydatabase",
        user: env.POSTGRES_USER || "postgres",
        password: env.POSTGRES_PASSWORD || "Secretpassword123",
        port: env.POSTGRES_PORT as any || 5433,
        ssl: false,
    },
});;
