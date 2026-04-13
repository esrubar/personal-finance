
    export const getMonthRange = (selectedYear: number, selectedMonth: number) => {
        const now = new Date();

        const year = selectedYear || now.getFullYear();
        const month = selectedMonth - 1 || now.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0, 23, 59, 59, 999);
        return { firstDay, lastDay };
    }