import React, { useState, useEffect } from 'react';
import type { Expense } from '../models/expense';
import { useCreateExpense, useUpdateExpense } from '../hooks/useExpenseMutations';
import { useCategories } from '../hooks/useCategories';

interface ExpenseFormProps {
  initialData?: Expense;
  onSuccess?: () => void;
}

const ExpenseForm: React.FC<ExpenseFormProps> = ({ initialData, onSuccess }) => {
  const [amount, setAmount] = useState(initialData?.amount || 0);
  const [categoryId, setCategoryId] = useState(initialData?.category?.id || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { categories } = useCategories();

  const { createExpense } = useCreateExpense();
  const { updateExpense } = useUpdateExpense();

  useEffect(() => {
    if (initialData) {
      setAmount(initialData.amount);
      setCategoryId(initialData.category?.id || '');
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (initialData && initialData.id) {
        await updateExpense(initialData.id, { ...initialData, amount, category: { ...initialData.category, id: categoryId } });
      } else {
        await createExpense({ amount, category: { id: categoryId, name: '' } } as Expense);
      }
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setError(err.message || 'Error saving expense');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="amount">Amount:</label>
        <input
          id="amount"
          type="number"
          value={amount}
          onChange={e => setAmount(Number(e.target.value))}
          required
        />
      </div>
      <div>
        <label htmlFor="category">Category:</label>
        <select
          id="category"
          value={categoryId}
          onChange={e => setCategoryId(e.target.value)}
          required
        >
          <option value="">Select category</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
      </div>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <button type="submit" disabled={loading}>
        {initialData ? 'Update' : 'Create'} Expense
      </button>
    </form>
  );
};

export default ExpenseForm;
