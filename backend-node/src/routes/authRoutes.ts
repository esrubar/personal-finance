import { Router } from 'express';
import * as controller from '../controllers/authController';
import {authMiddleware} from "../middlewares/middleware";

const router = Router();

router.get('/me', authMiddleware, controller.getMe);

export default router;