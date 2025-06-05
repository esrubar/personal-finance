import React, { useState, useEffect } from 'react';
import type { Income } from '../models/income';
import { useCreateIncome, useUpdateIncome } from '../hooks/useIncomeMutations';

interface IncomeFormProps {
  initialData?: Income;
  onSuccess?: () => void;
}

const IncomeForm: React.FC<IncomeFormProps> = ({ initialData, onSuccess }) => {
  const [amount, setAmount] = useState(initialData?.amount || 0);
  const [source, setSource] = useState(initialData?.source || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { createIncome } = useCreateIncome();
  const { updateIncome } = useUpdateIncome();

  useEffect(() => {
    if (initialData) {
      setAmount(initialData.amount);
      setSource(initialData.source);
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (initialData && initialData.id) {
        await updateIncome(initialData.id, { ...initialData, amount, source });
      } else {
        await createIncome({ amount, source } as Income);
      }
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setError(err.message || 'Error saving income');
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
        <label htmlFor="source">Source:</label>
        <input
          id="source"
          type="text"
          value={source}
          onChange={e => setSource(e.target.value)}
          required
        />
      </div>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <button type="submit" disabled={loading}>
        {initialData ? 'Update' : 'Create'} Income
      </button>
    </form>
  );
};

export default IncomeForm;
