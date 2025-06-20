// routes/expense.routes.ts
import { Router } from 'express';
import * as ExpenseController from '../controllers/expense.controller';

const router = Router();

router.get('/', ExpenseController.getAll);
router.get('/:id', ExpenseController.getById);
router.post('/', ExpenseController.create);
router.put('/:id', ExpenseController.update);
router.delete('/:id', ExpenseController.remove);

export default router;
