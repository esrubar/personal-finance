import { useState } from 'react';
import * as registerDataSource from '../data/registerDataSource.ts';

export function useRegister() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const register = async (values: { name: string; password: string }) => {
    setLoading(true);
    setError(null);
    try {
      return await registerDataSource.register(values);
    } catch (err: any) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { register, loading, error };
}
