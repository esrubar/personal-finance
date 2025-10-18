import {Request, Response} from "express";
import * as importTransactionService from '../services/importTransactionService';


export const importTransactions = async (req: Request, res: Response) => {
    try {
        const buffer = req.file?.buffer;
        if (!buffer) {
            res.status(400).send("Archivo no encontrado");
            return;
        }

        const transactions = importTransactionService.extractValidTransactionsFromExcel(buffer);
        res.json(transactions);

    } catch (error: any) {
        console.error("Error al importar transacciones:", error);
        res.status(400).json({message: error.message || "Error procesando archivo"});
    }
};
