import express, { json } from "express";
import cors from "cors";
import { config } from "dotenv";
import userRoutes from "./routes/userRoutes";
import connectDB from "./config/db";
import expenseRoutes from "./routes/expenseRoutes";
import categoryRoutes from "./routes/categoryRoutes";
import savingProjectRoutes from "./routes/savingProjectRoutes";
import categoryBudgetRoutes from "./routes/categoryBudgetRoutes";
import incomeRoutes from "./routes/incomeRoutes";
import importTransactionRoutes from "./routes/importTransactionRoutes";

config();

export const app = express();

// Conectar a la base de datos
connectDB();

// Middleware
app.use(json());
const corsOptions = {
    origin: [
        "https://personal-finance-app-coral.vercel.app",
        "https://personal-finance-frontend-six.vercel.app",
        "http://localhost:3000",
        "http://localhost:5173",
    ],
    methods: "GET,POST,PUT,DELETE,OPTIONS",
    allowedHeaders: "Content-Type,Authorization",
    credentials: true
};

app.use(cors(corsOptions));

// Ruta de ejemplo
app.get("/test", (req: any, res: any) => {
    res.json({ message: "CORS configurado correctamente!" });
});

// Rutas
app.use('/api/users', userRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/saving-projects', savingProjectRoutes);
app.use('/api/categoryBudgets', categoryBudgetRoutes);
app.use('/api/incomes', incomeRoutes);
app.use('/api/import-transactions', importTransactionRoutes);

export default app;
