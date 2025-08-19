import axios from "../api/axios.ts";

const API_URL = '/api/auth/login';
export const login = async (values: { name: string; password: string }): Promise<{ name: string; password: string }> => {
    const { data } = await axios.post<{ name: string; password: string }>(API_URL, values, { withCredentials: true });
    return data;
};