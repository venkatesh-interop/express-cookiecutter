// express
import express, { Router, Request, Response } from 'express';

// middlewares
import auditMiddleware from '@/middlewares/audit';
import cacheMiddleware from '@/middlewares/cache';
import authMiddleware from '@/middlewares/auth';
import { setCollection } from '@/middlewares/collection';

// routes
import documentRouter from '@/routes/documents';

const router: Router = express.Router();

// Root route
router.get('/', (req: Request, res: Response) => {
  res.send('Welcome to {{ cookiecutter.project_name }}');
});

// middlewares for all child routes under /api
router.use('/api', authMiddleware, cacheMiddleware, auditMiddleware, setCollection, documentRouter);

export default router;
