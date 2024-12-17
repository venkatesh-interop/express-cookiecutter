// express
import express, { Router, Request, Response } from 'express';

const router: Router = express.Router();

// Root route
router.get('/', (req: Request, res: Response) => {
  res.send('Welcome to {{ cookiecutter.project_name.upper().replace(" ", "_") }}');
});

// User-related routes
// router.use('/users', userRouter);

export default router;
