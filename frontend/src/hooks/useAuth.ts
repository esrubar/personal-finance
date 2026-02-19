import { useState, useEffect } from 'react';
import * as loginDataSource from '../data/loginDataSource.ts';
import type { User } from '../models/user.ts';

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [user, setUser] = useState<User>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const r = await loginDataSource.getMe();
        setUser(r.user);
        setIsAuthenticated(r.authenticated);
      } catch (err) {
        setError(err as Error);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  return { user, isAuthenticated, loading, error };
}
