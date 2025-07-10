import { Router } from 'express';
import * as controller from '../controllers/categoryBudget.controller';

const router = Router();

router.post('/', controller.create);
router.get('/:month/:year', controller.getByMonthAndYear);
router.get('/', controller.getAll);

export default router;