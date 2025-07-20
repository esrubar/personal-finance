// src/api/axios.ts
import axios from 'axios';

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000', // Usa variables de entorno
  withCredentials: true, // Si necesitas cookies
});

export default instance;