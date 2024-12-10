import express, { Application } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

import router from '@/routes';

import { env, initializeVariables } from '@/variables';

import { connectMongoDB } from '@/db/mongo';
import { connectToRedis } from '@/db/redis';
import { connectToPg } from '@/db';

// Function to initialize variables and dependencies
async function initializeApp() {
    try {
        // Initialize environment variables
        await initializeVariables();

        // Connect to PostgreSQL
        await connectToPg()

        // Connect to MongoDB
        await connectMongoDB();

        // Connect to Redis
        await connectToRedis();

        console.log('All dependencies initialized successfully');
    } catch (error) {
        console.error('Error during app initialization:', error);
        process.exit(1); // Exit the process if initialization fails
    }
}

// Function to create and start the server
function createServer() {
    const app: Application = express();
    const port = env.PORT;

    // Middleware
    app.use(cors());
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));

    // Routes with caching middleware
    app.use('/', router);

    // Start the server
    app.listen(port, () => {
        console.log(`Server is running at http://localhost:${port}`);
    });
}

// Initialize and then run the server
(async () => {
    await initializeApp(); // Ensure everything is initialized first
    createServer(); // Start the server
})();
