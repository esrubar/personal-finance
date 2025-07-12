import { Request, Response } from "express";
import * as importTransactionService from '../services/importTransaction.service';


export const importTransactions = async (req: Request, res: Response) => {
  try {
    const buffer = req.file?.buffer;
    if (!buffer) {
      res.status(400).send("Archivo no encontrado");
      return;
    }

    const transactions = importTransactionService.extractValidTransactionsFromExcel(buffer);

    // Aquí podrías guardarlos en base de datos si quieres
    // await TransactionModel.insertMany(transactions);

    res.status(200).json({ message: "Importación correcta", count: transactions.length, data: transactions });
  } catch (error: any) {
    console.error("Error al importar transacciones:", error);
    res.status(400).json({ message: error.message || "Error procesando archivo" });
  }
};
