import React, { useState, useEffect } from "react";
import type { Income } from "../models/income";
import { useUpdateIncome } from "../hooks/useIncomeMutations";

interface IncomeFormProps {
  initialData?: Income;
  onSuccess?: () => void;
}

const IncomeForm: React.FC<IncomeFormProps> = ({ initialData, onSuccess }) => {
  const [amount, setAmount] = useState(initialData?.amount || 0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  //const { createIncome } = useCreateIncome();
  const { updateIncome } = useUpdateIncome();

  useEffect(() => {
    if (initialData) {
      setAmount(initialData.amount);
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (initialData && initialData._id) {
        await updateIncome(initialData._id, { ...initialData, amount });
      } else {
        //await createIncome({ amount });
      }
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setError(err.message || "Error saving income");
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
          onChange={(e) => setAmount(Number(e.target.value))}
          required
        />
      </div>
      {error && <div style={{ color: "red" }}>{error}</div>}
      <button type="submit" disabled={loading}>
        {initialData ? "Update" : "Create"} Income
      </button>
    </form>
  );
};

export default IncomeForm;
