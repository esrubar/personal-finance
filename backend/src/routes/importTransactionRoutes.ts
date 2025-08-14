// routes/import.routes.ts
import { Router } from 'express';
import multer from "multer";
import * as importTransactionController from '../controllers/importTansactionController';

const router = Router();

const upload = multer({ storage: multer.memoryStorage() });

router.post("/", upload.single("file"), importTransactionController.importTransactions);

export default router;
