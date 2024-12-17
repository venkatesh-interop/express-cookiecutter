// mongoose
import mongoose, { Connection, Document } from 'mongoose';

// environment variables
import { env } from '@/variables';

// MongoDB Client Instance
let dbConnection: Connection | null = null;

const connectMongoDB = async (): Promise<Connection> => {
  try {
    const connection = await mongoose.connect(env.MONGODB_URI || '', {});
    console.log('Connected to MongoDB');
    dbConnection = connection.connection; // Store the connection
    return dbConnection;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
};

// Function to get a collection dynamically
const getCollection = <T extends Document>(collectionName: string): mongoose.Collection => {
  if (!dbConnection) {
    throw new Error('Database connection is not initialized. Call connectMongoDB first.');
  }

  return dbConnection.collection(collectionName);
};

export { connectMongoDB, getCollection };
