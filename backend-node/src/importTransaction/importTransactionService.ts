import { randomUUID } from 'crypto';
import * as XLSX from 'xlsx';
import { BankTransaction } from './bankTransaction';

// ==========================================
// MÓDULOS DE UTILIDAD (Helpers)
// ==========================================

/**
 * Normaliza cualquier celda de fecha a formato DD/MM/YYYY.
 * Maneja cadenas, números de serie de Excel y objetos Date.
 */
const formatExcelDate = (cellValue: any): string | null => {
  if (cellValue == null) return null;

  // 1. Si ya es una cadena en formato DD/MM/YYYY
  if (typeof cellValue === 'string') {
    const trimmed = cellValue.trim();
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(trimmed)) {
      return trimmed;
    }
  }

  // 2. Si es un número serial de Excel (ej: 45292)
  if (typeof cellValue === 'number') {
    const parsed = XLSX.SSF.parse_date_code(cellValue);
    if (parsed) {
      const day = String(parsed.d).padStart(2, '0');
      const month = String(parsed.m).padStart(2, '0');
      const year = parsed.y;
      return `${day}/${month}/${year}`;
    }
  }

  // 3. Si es un objeto Date nativo
  if (cellValue instanceof Date && !isNaN(cellValue.getTime())) {
    const day = String(cellValue.getDate()).padStart(2, '0');
    const month = String(cellValue.getMonth() + 1).padStart(2, '0');
    const year = cellValue.getFullYear();
    return `${day}/${month}/${year}`;
  }

  return null;
};

/**
 * Parsea importes numéricos eliminando separadores de miles y devolviendo un tipo number.
 * Ejemplos:
 * "1,093.06"  -> 1093.06 (number)
 * "1.093,06"  -> 1093.06 (number)
 * "-500.00"   -> -500 (number)
 */
const parseAmount = (str: string): number | null => {
  let cleaned = str.trim().replace(/[€$\s]/g, '');
  if (!/^-?[\d.,]+$/.test(cleaned)) return null;

  if (cleaned.includes('.') && cleaned.includes(',')) {
    const lastDot = cleaned.lastIndexOf('.');
    const lastComma = cleaned.lastIndexOf(',');
    
    if (lastComma > lastDot) {
      // Formato europeo (ej: 1.093,06)
      cleaned = cleaned.replace(/\./g, '').replace(',', '.');
    } else {
      // Formato anglosajón (ej: 1,093.06)
      cleaned = cleaned.replace(/,/g, '');
    }
  } else if (cleaned.includes(',')) {
    const parts = cleaned.split(',');
    if (parts.length === 2 && parts[1].length === 3) {
      cleaned = cleaned.replace(',', '');
    } else {
      cleaned = cleaned.replace(',', '.');
    }
  } else if (cleaned.includes('.')) {
    const parts = cleaned.split('.');
    if (parts.length === 2 && parts[1].length === 3 && parts[0].length <= 3) {
      cleaned = cleaned.replace('.', '');
    }
  }

  const num = parseFloat(cleaned);
  return isNaN(num) ? null : num;
};

/**
 * Valida si un texto es un código de moneda de 3 letras (ej: EUR, USD, GBP).
 */
const isCurrency = (str: string): boolean => /^[A-Z]{3}$/.test(str);

// ==========================================
// FUNCIONES PRINCIPALES EXPORTADAS
// ==========================================

export const parseRowToTransaction = (row: any[]): BankTransaction => {
  let date: string | null = null;
  let amount: number | null = null;
  let currency: string | null = null;
  const descriptionParts: string[] = [];

  for (const item of row) {
    if (item == null) continue;
    const trimmed = String(item).trim();
    if (!trimmed) continue;

    const possibleDate: string | null = !date ? formatExcelDate(item) : null;
    const possibleAmount: number | null = amount === null ? parseAmount(trimmed) : null;

    if (possibleDate) {
      date = possibleDate;
    } else if (amount === null && possibleAmount !== null) {
      amount = possibleAmount;
    } else if (!currency && isCurrency(trimmed)) {
      currency = trimmed;
    } else {
      descriptionParts.push(trimmed);
    }
  }

  const type = amount !== null ? (amount < 0 ? 'expense' : 'income') : null;
  const absAmount: number | null = amount !== null ? Math.abs(amount) : null;

  return {
    tempId: randomUUID(),
    date,
    description: descriptionParts.join(' ').trim(),
    amount: absAmount, // Garantizado number | null
    currency,
    type,
    raw: row.map((v) => String(v ?? '')),
  };
};

export const extractValidTransactionsFromExcel = (fileBuffer: Buffer): BankTransaction[] => {
  const workbook = XLSX.read(fileBuffer, { type: 'buffer', cellDates: true, raw: false });
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];

  const allRows: any[][] = XLSX.utils.sheet_to_json(sheet, {
    header: 1,
    blankrows: false,
    raw: false,
  });

  const isValidRow = (row: any[]) => {
    const nonEmptyCells = row.filter(
      (cell) => cell != null && String(cell).trim() !== '',
    );
    const hasDate = nonEmptyCells.some((cell) => formatExcelDate(cell) !== null);

    return nonEmptyCells.length >= 3 && hasDate;
  };

  const firstValidIndex = allRows.findIndex(isValidRow);
  if (firstValidIndex === -1) {
    console.error('No se encontraron filas válidas en el archivo.');
    return [];
  }

  const dataRows = allRows.slice(firstValidIndex);

  return dataRows.map((row) => parseRowToTransaction(row));
};