// src/hooks/useLogin.ts
import { useState } from 'react';
import * as loginDataSource from '../data/loginDataSource.ts';
import { useAuth } from './useAuth';

export function useLogin() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { setUser, setIsAuthenticated } = useAuth();

  const login = async (values: { name: string; password: string }) => {
    setLoading(true);
    setError(null);
    try {
      const result = await loginDataSource.login(values);

      setUser(result);
      setIsAuthenticated(true);

      return result;
    } catch (err: any) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { login, loading, error };
}

export function useLogout() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { setUser, setIsAuthenticated } = useAuth();

  const logout = async () => {
    setLoading(true);
    setError(null);
    try {
      await loginDataSource.logout();

      // Limpiamos el estado global
      setUser(null);
      setIsAuthenticated(false);
    } catch (err: any) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { logout, loading, error };
}
