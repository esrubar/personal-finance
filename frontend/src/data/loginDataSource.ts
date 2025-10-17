import axios from '../api/axios.ts';

//const API_URL = '/api/auth/login';
const API_URL = '/login';
export const login = async (values: {
  name: string;
  password: string;
}): Promise<{ name: string; password: string }> => {
  const { data } = await axios.post<{ name: string; password: string }>(API_URL, values, {
    withCredentials: true,
  });
  return data;
};

export const protectedEndpoint = async () => {
  const { data } = await axios.post('/protected', {
    withCredentials: true,
  });
  return data;
};

export const getMe = async () => {
  const { data } = await axios.get('/api/auth/me', {
    withCredentials: true,
  });
  return data;
};
