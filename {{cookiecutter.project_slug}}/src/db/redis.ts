import { env } from '@/variables';
import { createClient, RedisClientType } from 'redis';

// Create a Redis client for Redis v4, using the `url` option
const redisClient: RedisClientType = createClient({
    url: env.REDIS_URI, // Redis URL with the host and port
});

// Define a function to connect the client
const connectToRedis = async (): Promise<void> => {
    try {
        await redisClient.connect();
        console.log('Connected to Redis v4');
    } catch (err) {
        console.error('Redis connection error:', err);
    }
};

// Export the redis client and connect function
export { redisClient, connectToRedis };
