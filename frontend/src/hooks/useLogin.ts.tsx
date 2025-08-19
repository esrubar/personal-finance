import {useState} from "react";
import * as loginDataSource from "../data/loginDataSource.ts";

export function useLogin() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const login = async (values: { name: string; password: string }) => {
        setLoading(true);
        setError(null);
        try {
            const result = await loginDataSource.login(values)
            console.log(result)
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