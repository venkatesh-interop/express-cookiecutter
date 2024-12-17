import { Request } from 'express';
import { Collection } from 'mongodb';

interface DecodedToken extends JwtPayload {
  [key: string]: any; // Adjust this to include specific token properties you expect
}

// Extend Express Request to include user and collection
declare global {
  namespace Express {
    interface Request {
      user?: DecodedToken; // The decoded JWT token
      collection?: Collection; // MongoDB collection
    }
  }
}
