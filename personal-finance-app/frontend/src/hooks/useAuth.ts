import { useState } from 'react';
import * as authDataSource from '../data/authDataSource';

export const useAuth = () => {
  const [user, setUser] = useState(null);

  const login = async (name: string, password: string) => {
    const { token, user } = await authDataSource.login(name, password);
    localStorage.setItem('token', token);
    setUser(user);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return { user, login, logout };
};
