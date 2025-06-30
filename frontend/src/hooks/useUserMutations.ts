import { useState } from 'react';
import * as userDataSource from '../data/userDataSource';
import type { User } from '../models/user';

export function useCreateUser() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const createUser = async (user: User) => {
    setLoading(true);
    setError(null);
    try {
      const result = await userDataSource.createUser(user);
      return result;
    } catch (err: any) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { createUser, loading, error };
}

export function useUpdateUser() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const updateUser = async (id: string, user: User) => {
    setLoading(true);
    setError(null);
    try {
      const result = await userDataSource.updateUser(id, user);
      return result;
    } catch (err: any) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { updateUser, loading, error };
}

export function useDeleteUser() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const deleteUser = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await userDataSource.deleteUser(id);
    } catch (err: any) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { deleteUser, loading, error };
}
