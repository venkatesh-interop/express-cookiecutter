// express
import { Request } from 'express';

// mongo
import { Collection } from 'mongodb';

// JWT
import { JwtPayload } from 'jsonwebtoken'; // Import if you're using JWT

interface DecodedToken extends JwtPayload {
  sub?: string;
  [key: string]: any; // Adjust based on expected token structure
}

export interface ExtendedRequest extends Request {
  user?: DecodedToken; // The decoded JWT token
  collection?: Collection; // MongoDB collection
}
