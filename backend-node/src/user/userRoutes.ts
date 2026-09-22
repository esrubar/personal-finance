import { Router } from 'express';
import * as controller from './userController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { requireRoles } from '../middlewares/rolMiddleware';
import { UserRole } from './user';

const router = Router();

router.post('/', authMiddleware, requireRoles(UserRole.ADMIN), controller.create);
router.get('/', authMiddleware, requireRoles(UserRole.ADMIN), controller.getAll);
router.get('/:id', authMiddleware, requireRoles(UserRole.ADMIN), controller.getById);
router.put('/:id', authMiddleware, requireRoles(UserRole.ADMIN), controller.update);
router.delete('/:id', authMiddleware, requireRoles(UserRole.ADMIN), controller.remove);

export default router;
