import express, { Router, Request, Response } from 'express';


const router: Router = express.Router();

// Root route
router.get('/', (req: Request, res: Response) => {
    res.send('Welcome to Express & TypeScript Server');
});

// User-related routes
// router.use('/users', userRouter);

export default router;
