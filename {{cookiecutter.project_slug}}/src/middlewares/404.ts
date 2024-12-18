// express
import { Request, Response, NextFunction } from 'express';

// No route found middleware
const noRouteMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  res.status(404).json({
    success: false,
    error: {
      message: `Route not found: ${req.method} ${req.originalUrl}`,
    },
  });
};

export default noRouteMiddleware;
