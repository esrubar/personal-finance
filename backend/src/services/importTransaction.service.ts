import XLSX from "xlsx";

export interface BankTransaction {
    date: string | null;
    description: string;
    amount: number | null;
    currency: string | null;
    type: "charge" | "deposit" | null;
    raw: string[];
}

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

    const type = amount !== null ? (amount < 0 ? "charge" : "deposit") : null;

    return {
        date,
        description: descriptionParts.join(" ").trim(),
        amount,
        currency,
        type,
        raw: row,
    };
};

export const extractValidTransactionsFromExcel = (buffer: Buffer): BankTransaction[] => {
    const workbook = XLSX.read(buffer, { type: "buffer" });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rawData = XLSX.utils.sheet_to_json<Record<string, any>>(sheet);

    const palabrasClave = ["FECHA", "SALDO", "CONCEPTO", "OBSERVACIONES", "IBAN"];

    const indexPrimeraTransaccion = (rawData as Record<string, any>[]).findIndex((row) =>
        Object.values(row).some((value) => {
            const str = String(value).toUpperCase();
            return str.includes("/") && !palabrasClave.some((p) => str.includes(p));
        })
    );

    if (indexPrimeraTransaccion === -1) {
        throw new Error("No se encontraron transacciones válidas");
    }

    const data = rawData.slice(indexPrimeraTransaccion);

    const transactions: BankTransaction[] = data.map((row) => {
        const allValues = Object.values(row).map((v) => String(v));
        return parseRowToTransaction(allValues);
    });
    console.log("Transacciones extraídas:", transactions);

    return transactions;
};
