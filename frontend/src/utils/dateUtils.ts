// utils/date.ts
export function getMonthNameCapitalized(monthNumber: number, locale: string = 'es-ES'): string {
  if (monthNumber < 1 || monthNumber > 12) return 'Invalid month';

  const date = new Date(2000, monthNumber - 1);
  const month = date.toLocaleString(locale, { month: 'long' });

  return month.charAt(0).toUpperCase() + month.slice(1);
}
