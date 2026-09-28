// src/api/axios.ts
import axios from 'axios';
import qs from 'qs';

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000', // Usa variables de entorno
  withCredentials: true, // Si necesitas cookies
  paramsSerializer: (params) => {
    return qs.stringify(params, { arrayFormat: 'repeat' });
  },
});

export default instance;
