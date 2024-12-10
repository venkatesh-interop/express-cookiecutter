import { Pool, PoolClient } from 'pg';
import { env } from '@/variables'; // Make sure you have your environment variables loaded

// Declare the pool variable
let pool: Pool | null = null;

// Function to initialize the PostgreSQL connection pool
export async function connectToPg(): Promise<PoolClient | null> {
    try {
        // Initialize the pool if it hasn't been initialized already
        if (!pool) {
            pool = new Pool({
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
        }

        // Acquire a client connection from the pool
        const client: PoolClient = await pool.connect();
        return client;
    } catch (error) {
        console.error('Failed to connect to PostgreSQL:', error);
        throw error;
    }
}

// Function to close the pool when the application shuts down
export async function closePool(): Promise<void> {
    if (pool) {
        await pool.end();
        console.log('PostgreSQL connection pool closed');
    }
}




// Export the pool for querying throughout the app
export { pool };