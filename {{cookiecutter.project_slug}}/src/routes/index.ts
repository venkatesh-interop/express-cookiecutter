// express
import express, { Router, Response } from 'express';

// routes
import documentRouter from '@/routes/documents';

// types
import { ExtendedRequest } from '@/types';

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
router.get('/', (req: ExtendedRequest, res: Response) => {
  if (req.user && env.resourceType) {
    documentRouter.handle(req, res);
  }
  res.send('Welcome to FHIR {{ cookiecutter.project_name }} Service');
});

const basePath = env.resourceType ? '/api/:resource' : '/';

// middlewares for all child routes under /api
const middlewares = [auditMiddleware, authMiddleware, collectionMiddleware, cacheMiddleware];

router.use(basePath, middlewares, documentRouter);

export default router;
