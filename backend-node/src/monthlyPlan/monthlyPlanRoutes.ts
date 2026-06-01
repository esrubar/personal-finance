import { Router } from 'express';
import { authMiddleware } from '../middlewares/middleware';
import * as MonthlyPlanController from './monthlyPlanController';

const router = Router();

router.get('/:month/:year', authMiddleware, MonthlyPlanController.getPreviousPlan);

export default router;
