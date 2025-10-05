import { Router } from 'express';
import * as controller from '../controllers/userController';
import {authMiddleware} from "../middlewares/middleware";

const router = Router();

router.post('/', authMiddleware, controller.create);
router.get('/', authMiddleware, controller.getAll);
router.get('/:id', authMiddleware, controller.getById);
router.put('/:id', authMiddleware, controller.update);
router.delete('/:id', authMiddleware, controller.remove);

export default router;
