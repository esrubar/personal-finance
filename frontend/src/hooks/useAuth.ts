import { useState, useEffect } from 'react';
import * as loginDataSource from "../data/loginDataSource.ts";
import type {User} from "../models/user.ts";

export function useAuth() {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(false);
    const [user, setUser] = useState<User>();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const checkAuth = async () => {
            setLoading(true)
            await loginDataSource.getMe().then(r => {
                setUser(r.user);
                setIsAuthenticated(r.authenticated);
            })
                .catch(setError)
                .finally(() => setLoading(false));
        }
        checkAuth();
    }, []);

    return { user, isAuthenticated, loading, error };
}