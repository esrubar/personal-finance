import { Router } from 'express';
import { authMiddleware } from '../middlewares/authMiddleware';
import * as MonthlyPlanController from './monthlyPlanController';

const router = Router();

router.get('/:month/:year', authMiddleware, MonthlyPlanController.getPreviousPlan);

export default router;
