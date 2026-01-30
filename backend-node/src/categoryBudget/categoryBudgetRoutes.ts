import {Router} from 'express';
import * as controller from './categoryBudgetController';
import {authMiddleware} from "../middlewares/middleware";

const router = Router();

router.post('/', authMiddleware, controller.create);
router.get('/:month/:year', authMiddleware, controller.getByMonthAndYear);
router.get('/', authMiddleware, controller.getAll);

export default router;