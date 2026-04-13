import { Router } from 'express';
import * as controller from './overviewController';
import { authMiddleware } from '../middlewares/middleware';

const router = Router();

router.get('/stats/:month/:year', authMiddleware, controller.getStats);

export default router;
