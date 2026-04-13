export const getMonthRange = (selectedYear: number, selectedMonth: number) => {
  const now = new Date();

  const year = selectedYear || now.getFullYear();
  const month = selectedMonth - 1 || now.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0, 23, 59, 59, 999);
  return { firstDay, lastDay };
};

export const getFullYear = (selectedYear: number) => {
  const now = new Date();

  const year = selectedYear || now.getFullYear();

  const firstDay = new Date(year, 0, 1);
  const lastDay = new Date(year, 11, 31, 23, 59, 59, 999);
  return { firstDay, lastDay };
};

export const monthNames = ["", "Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];