// routes/expense.routes.ts
import {Router} from 'express';
import * as ExpenseController from '../controllers/expenseController';
import {authMiddleware} from "../middlewares/middleware";

const router = Router();

router.get('/getMensualExpenses', authMiddleware, ExpenseController.getMensualExpenses);
router.post('/create-many', authMiddleware, ExpenseController.createMany);
router.get('/', authMiddleware, ExpenseController.getFiltered);
router.get('/:id', authMiddleware, ExpenseController.getById);
router.post('/', authMiddleware, ExpenseController.create);
router.put('/:id', authMiddleware, ExpenseController.update);
router.delete('/:id', authMiddleware, ExpenseController.remove);

export default router;
