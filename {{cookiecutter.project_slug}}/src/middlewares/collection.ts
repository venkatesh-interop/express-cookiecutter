// express
import { Response, NextFunction } from 'express';

// mongo database configuration
import { getCollection } from '@/db/mongo';

// types
import { ExtendedRequest } from '@/types';

// Middleware to attach a dynamic MongoDB collection
export const collectionMiddleware = async (
  req: ExtendedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    req.collection = await getCollection('resources'); // Attach collection to request
    next();
  } catch (error) {
    res.status(500).send({ error: 'Failed to set collection', details: error });
  }
};

export default collectionMiddleware;
