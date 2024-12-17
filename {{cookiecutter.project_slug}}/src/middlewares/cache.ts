// express
import { Request, Response, NextFunction } from 'express';

// redis connection
import { redisClient } from '@/db/redis';

// Middleware to check cache first
const cacheMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const key = req.originalUrl || req.url;

  try {
    // Check if the data exists in Redis
    const reply = await redisClient.get(key);

    if (reply) {
      res.json(JSON.parse(reply)); // Return cached response
      return;
    }

    // Save the original res.send function to a variable
    const originalSend = res.send;

    res.send = (body: any): Response => {
      // Cache the response in Redis with an expiration time (1 hour, 3600 seconds)
      redisClient.set(key, JSON.stringify(body), {
        EX: 3600, // Expiration time in seconds
      });
      return originalSend.call(res, body); // Send the actual response
    };

    next(); // Pass the request to the next middleware
  } catch (err) {
    console.error('Redis error:', err);
    next(); // Continue processing the request if Redis fails
  }
};

export default cacheMiddleware;
