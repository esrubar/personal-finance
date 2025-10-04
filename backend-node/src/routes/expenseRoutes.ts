// routes/expense.routes.ts
import { Router } from 'express';
import * as ExpenseController from '../controllers/expenseController';

const router = Router();

router.get('/getMensualExpenses', ExpenseController.getMensualExpenses);
router.post('/create-many', ExpenseController.createMany);
router.get('/', ExpenseController.getFiltered);
router.get('/:id', ExpenseController.getById);
router.post('/', ExpenseController.create);
router.put('/:id', ExpenseController.update);
router.delete('/:id', ExpenseController.remove);

export default router;
