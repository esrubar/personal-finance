import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Aquí van las rutas (por ejemplo: gastos, ingresos)
app.get('/', (_req, res) => {
  res.send('API Finanzas funcionando');
});

const NEXT_PUBLIC_PORT = process.env.NEXT_PUBLIC_PORT || 4000;
const NEXT_PUBLIC_MONGODB_URI = process.env.NEXT_PUBLIC_MONGODB_URI || '';

mongoose
  .connect(NEXT_PUBLIC_MONGODB_URI)
  .then(() => {
    console.log('Conectado a MongoDB');
    app.listen(NEXT_PUBLIC_PORT, () => {
      console.log(`Servidor escuchando en http://localhost:${NEXT_PUBLIC_PORT}`);
    });
  })
  .catch((err) => console.error('Error de conexión a MongoDB', err));
