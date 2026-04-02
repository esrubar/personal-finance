import {Router} from "express";
import {authMiddleware} from "../middlewares/middleware";
import * as controller from "../savingEntry/savingEntryController";

const router = Router();

router.post('/', authMiddleware, controller.create);

export default router;