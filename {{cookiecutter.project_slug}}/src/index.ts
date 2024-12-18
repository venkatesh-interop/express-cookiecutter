// express
import express, { Application } from 'express';

// cors
import cors from 'cors';

// body parser
import bodyParser from 'body-parser';

// sentry
import * as Sentry from '@sentry/node';

// local router
import router from '@/routes';

// environment variables
import { env, initializeVariables } from '@/variables';

// mongo database configuration
import { connectMongoDB } from '@/db/mongo';

// redis database configuration
import { connectToRedis } from '@/db/redis';

// postgres database configuration
import { connectToPg } from '@/db';
import { errorMiddleware, noRouteMiddleware } from '@/middlewares';

// Function to initialize variables and dependencies
async function initializeApp() {
  try {
    // Initialize environment variables
    await initializeVariables();

    // Connect to PostgreSQL
    await connectToPg();

    // Connect to MongoDB
    await connectMongoDB();

    // Connect to Redis
    await connectToRedis();

    // Initialize Sentry only in production
    if (process.env.NODE_ENV === 'production') {
      Sentry.init({
        dsn: env.SENTRY_DSN,
        environment: 'production',
        tracesSampleRate: 1.0,
      });
    }

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

  // local router
  app.use('/', router);

  // Add Sentry request handler middleware
  Sentry.setupExpressErrorHandler(app);

  app.use(noRouteMiddleware);
  app.use(errorMiddleware);

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
