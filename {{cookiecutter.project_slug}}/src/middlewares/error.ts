// express
import { NextFunction, Response, Request } from 'express';

import * as Sentry from '@sentry/node';

const errorMiddleware = (err: any, req: Request, res: Response, next: NextFunction): void => {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    // Log errors locally in development
    console.error('Error:', err);
  } else {
    // Capture error with Sentry in production
    Sentry.captureException(err);
  }

  res.status(err.status || 500).json({
    success: false,
    error: {
      message: err.message || 'Internal Server Error',
      ...(isProduction ? {} : { stack: err.stack }), // Include stack trace only in development
    },
  });
};

export default errorMiddleware;
