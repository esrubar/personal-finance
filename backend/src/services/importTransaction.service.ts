import XLSX from "xlsx";
import { BankTransaction } from "../dtos/bankTransaction";

export const parseRowToTransaction = (row: string[]): BankTransaction => {
    const isDate = (str: string) => /^\d{2}\/\d{2}\/\d{4}$/.test(str);
    const isAmount = (str: string) => /^-?\d+([.,]\d+)?$/.test(str);
    const isCurrency = (str: string) => /^[A-Z]{3}$/.test(str);

    let date: string | null = null;
    let amount: number | null = null;
    let currency: string | null = null;
    const descriptionParts: string[] = [];

    for (const item of row) {
        const trimmed = item.trim();

        if (!date && isDate(trimmed)) {
            date = trimmed;
        } else if (amount === null && isAmount(trimmed.replace(',', '.'))) {
            amount = parseFloat(trimmed.replace(',', '.'));
        } else if (!currency && isCurrency(trimmed)) {
            currency = trimmed;
        } else {
            descriptionParts.push(trimmed);
        }
    }

    const type = amount !== null ? (amount < 0 ? "expense" : "income") : null;

    return {
        date,
        description: descriptionParts.join(" ").trim(),
        amount,
        currency,
        type,
        raw: row,
    };
};

export const extractValidTransactionsFromExcel = (fileBuffer: Buffer): BankTransaction[] => {
    const workbook = XLSX.read(fileBuffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    // Leer todas las filas como arrays
    const allRows: any[][] = XLSX.utils.sheet_to_json(sheet, {
        header: 1,
        blankrows: false,
    });

    // Detectar primera fila "interesante"
    const isValidRow = (row: any[]) => {
        const nonEmptyCells = row.filter(cell => cell !== undefined && cell !== null && String(cell).trim() !== '');
        const hasDate = nonEmptyCells.some(cell => {
            const parsed = new Date(cell);
            return !isNaN(parsed.getTime());
        });

        return nonEmptyCells.length >= 3 && hasDate;
    };

    const firstValidIndex = allRows.findIndex(isValidRow);
    if (firstValidIndex === -1) {
        console.error("No se encontraron filas válidas en el archivo.");
        return [];
    }

    // Quedarse solo con las filas a partir de la válida
    const dataRows = allRows.slice(firstValidIndex);

    const transactions: BankTransaction[] = dataRows.map((row) => {
        const allValues = Object.values(row).map((v) => String(v));
        return parseRowToTransaction(allValues);
    });
    console.log("Transacciones extraídas:", transactions);

    return transactions;
}