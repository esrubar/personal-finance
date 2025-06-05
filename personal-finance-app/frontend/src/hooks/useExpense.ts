import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as expenseDataSource from '../data/expenseDataSource';
import type { Expense } from '../models/Expense';

export function useExpenses() {
  return useQuery<Expense[], Error>(['expenses'], expenseDataSource.getExpenses);
}

export function useExpense(id: string) {
  return useQuery<Expense, Error>(['expense', id], () => expenseDataSource.getExpense(id), {
    enabled: !!id,
  });
}

export function useCreateExpense() {
  const queryClient = useQueryClient();
  return useMutation(expenseDataSource.createExpense, {
    onSuccess: () => {
      queryClient.invalidateQueries(['expenses']);
    },
  });
}

export function useUpdateExpense() {
  const queryClient = useQueryClient();
  return useMutation(
    ({ id, data }: { id: string; data: Expense }) => expenseDataSource.updateExpense(id, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['expenses']);
      },
    }
  );
}

export function useDeleteExpense() {
  const queryClient = useQueryClient();
  return useMutation(expenseDataSource.deleteExpense, {
    onSuccess: () => {
      queryClient.invalidateQueries(['expenses']);
    },
  });
}