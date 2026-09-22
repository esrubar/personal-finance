import { Router } from 'express';
import * as controller from './overviewController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { requireRoles } from '../middlewares/rolMiddleware';
import { UserRole } from '../user/user';

const router = Router();

router.get('/stats/:month/:year', authMiddleware, controller.getStats);

export default router;
