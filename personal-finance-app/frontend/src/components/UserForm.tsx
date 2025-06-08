import React, { useState, useEffect } from "react";
import type { User } from "../models/user";
import { useCreateUser, useUpdateUser } from "../hooks/useUserMutations";

interface UserFormProps {
  initialData?: User;
  onSuccess?: () => void;
}

const UserForm: React.FC<UserFormProps> = ({ initialData, onSuccess }) => {
  const [name, setName] = useState(initialData?.name || "");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { createUser } = useCreateUser();
  const { updateUser } = useUpdateUser();

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (initialData && initialData._id) {
        await updateUser(initialData._id, { ...initialData, name });
      } else {
        await createUser({ name, password } as User);
      }
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setError(err.message || "Error saving user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="name">Name:</label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      {!initialData && (
        <div>
          <label htmlFor="password">Password:</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
      )}
      {error && <div style={{ color: "red" }}>{error}</div>}
      <button type="submit" disabled={loading}>
        {initialData ? "Update" : "Create"} User
      </button>
    </form>
  );
};

export default UserForm;
