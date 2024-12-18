// express
import express, { Request, Router, Response } from 'express';

// routes
import documentRouter from '@/routes/documents';

// environment variables
import { env } from '@/variables';

// middlewares
import {
  authMiddleware,
  collectionMiddleware,
  auditMiddleware,
  cacheMiddleware,
} from '@/middlewares';

const router: Router = express.Router();

const apiPrefix =
  env.API_PREFIX.includes('{') && env.API_PREFIX.includes('}')
    ? '/api/:resource'
    : env.API_PREFIX;

// Root route
router.get('/', (req: Request, res: Response) => {
  res.send('Welcome to FHIR {{ cookiecutter.project_name }} Service');
});

// middlewares for all child routes under /api
const middlewares = [authMiddleware, auditMiddleware, cacheMiddleware, collectionMiddleware];

router.use(apiPrefix as string, middlewares, documentRouter);

export default router;
