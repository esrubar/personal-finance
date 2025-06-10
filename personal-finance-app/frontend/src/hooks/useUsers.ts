import { useState, useEffect } from 'react';
import * as userDataSource from '../data/userDataSource';
import type { User } from '../models/user';

export function useUsers(refreshKey?: number) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setLoading(true);
    userDataSource.getUsers()
      .then(setUsers)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [refreshKey]);

  return { users, loading, error };
}

export function useUser(id: string) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    userDataSource.getUser(id)
      .then(setUser)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [id]);

  return { user, loading, error };
}
