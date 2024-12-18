// express
import express, { Request, Router, Response } from 'express';

// routes
import documentRouter from '@/routes/documents';

// environment variables
import { env } from '@/variables';
import {
  authMiddleware,
  collectionMiddleware,
  auditMiddleware,
  cacheMiddleware,
} from '@/middlewares';

const router: Router = express.Router();

// Root route
router.get('/', (req: Request, res: Response) => {
  res.send('Welcome to FHIR {{ cookiecutter.project_name }} Service');
});

// middlewares for all child routes under /api
const middlewares = [authMiddleware, auditMiddleware, cacheMiddleware, collectionMiddleware];

router.use(env.API_PREFIX, middlewares, documentRouter);

export default router;
