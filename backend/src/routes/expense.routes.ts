// routes/expense.routes.ts
import { Router } from 'express';
import * as ExpenseController from '../controllers/expense.controller';

const router = Router();

router.get('/getMensualExpenses', ExpenseController.getMensualExpenses);
router.get('/', ExpenseController.getAll);
router.get('/:id', ExpenseController.getById);
router.post('/', ExpenseController.create);
router.post('/create-many', ExpenseController.createMany);
router.put('/:id', ExpenseController.update);
router.delete('/:id', ExpenseController.remove);

export default router;
