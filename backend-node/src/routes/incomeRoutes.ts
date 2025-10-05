// routes/income.routes.ts
import { Router } from 'express';
import * as IncomeController from '../controllers/incomeController';
import {authMiddleware} from "../middlewares/middleware";

const router = Router();

router.post('/create-many', authMiddleware, IncomeController.createMany);
router.get('/', authMiddleware, IncomeController.getAll);
router.get('/:id', authMiddleware, IncomeController.getById);
router.post('/', authMiddleware, IncomeController.create);
router.put('/:id', authMiddleware, IncomeController.update);
router.delete('/:id', authMiddleware, IncomeController.remove);

export default router;
