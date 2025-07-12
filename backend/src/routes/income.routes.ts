// routes/income.routes.ts
import { Router } from 'express';
import * as IncomeController from '../controllers/income.controller';

const router = Router();

router.get('/', IncomeController.getAll);
router.get('/:id', IncomeController.getById);
router.post('/', IncomeController.create);
router.put('/:id', IncomeController.update);
router.delete('/:id', IncomeController.remove);

export default router;
