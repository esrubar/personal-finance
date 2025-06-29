import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

// Importa tus rutas reales
import expenseRoutes from './routes/expense.routes';
import categoryRoutes from './routes/category.routes';
import savingProjectRoutes from './routes/savingProject.routes'
import userRoutes from './routes/user.routes'
import categoryBudgetRoutes from './routes/categoryBudget.routes';

dotenv.config();

const app = express();
const corsOptions = {
  origin: [
    "http://localhost:3000",
    "http://localhost:5173",
  ],
  methods: "GET,POST,PUT,DELETE,OPTIONS",
  allowedHeaders: "Content-Type,Authorization",
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

// Ruta de prueba
app.get('/', (_req, res) => {
  res.send('API Finanzas funcionando');
});

// Tus rutas reales
app.use('/api/expenses', expenseRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/saving-projects', savingProjectRoutes);
app.use('/api/users', userRoutes);
app.use('/api/categoryBudgets', categoryBudgetRoutes);

// Exporta el app para usar en tests
export default app;

// Lanza el servidor solo si no está en entorno de test
if (process.env.NODE_ENV !== 'test') {
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
}
