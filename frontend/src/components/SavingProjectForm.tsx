import React, { useState, useEffect } from "react";
import type { SavingProject } from "../models/savingProject";
import {
  useCreateSavingProject,
  useUpdateSavingProject,
} from "../hooks/useSavingProjectMutations";

interface SavingProjectFormProps {
  initialData?: SavingProject;
  onSuccess?: () => void;
}

const SavingProjectForm: React.FC<SavingProjectFormProps> = ({
  initialData,
  onSuccess,
}) => {
  const [amount, setAmount] = useState(initialData?.amount || 0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { createSavingProject } = useCreateSavingProject();
  const { updateSavingProject } = useUpdateSavingProject();

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
        await updateSavingProject(initialData._id, { ...initialData, amount });
      } else {
        await createSavingProject({ amount } as SavingProject);
      }
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setError(err.message || "Error saving project");
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
        {initialData ? "Update" : "Create"} Saving Project
      </button>
    </form>
  );
};

export default SavingProjectForm;
