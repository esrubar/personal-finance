import React, { createContext, useState, useEffect, type ReactNode } from 'react';
import * as loginDataSource from '../data/loginDataSource.ts';
import type { MinimalUser } from '../models/user';

interface AuthContextType {
  user: MinimalUser | null;
  isAuthenticated: boolean | null; // null = cargando estado inicial, true = logueado, false = no logueado
  setUser: React.Dispatch<React.SetStateAction<MinimalUser | null>>;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean | null>>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<MinimalUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    // Al montar la app, verificamos si hay una sesión activa ejecutando /me
    const initAuth = async () => {
      try {
        const userData = await loginDataSource.getMe();
        setUser(userData);
        setIsAuthenticated(true);
      } catch {
        setUser(null);
        setIsAuthenticated(false);
      }
    };

    initAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, setUser, setIsAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};
