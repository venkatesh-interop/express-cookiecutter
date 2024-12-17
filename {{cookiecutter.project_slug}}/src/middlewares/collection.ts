// express
import { Request, Response, NextFunction } from 'express';

// mongo database configuration
import { getCollection } from '@/db/mongo';
import { env } from '@/variables';

// Middleware to attach a dynamic MongoDB collection
export const setCollection = async (req: Request, res: Response, next: NextFunction) => {
  const { resource } = req.params;

  if (!resource) {
    res.status(400).send({ error: 'Resource name is required' });
    return;
  }

  try {
    req.collection = await getCollection(resource || env.resourceType); // Attach collection to request
    next();
  } catch (error) {
    res.status(500).send({ error: 'Failed to set collection', details: error });
  }
};
