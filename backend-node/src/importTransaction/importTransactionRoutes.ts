// routes/import.routes.ts
import {Router} from 'express';
import multer from "multer";
import * as importTransactionController from './importTansactionController';
import {authMiddleware} from "../middlewares/middleware";

const router = Router();

const upload = multer({storage: multer.memoryStorage()});

router.post('/', authMiddleware, upload.single("file"), importTransactionController.importTransactions);

export default router;
