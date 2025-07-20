import express, { json } from "express";
import cors from "cors";
import { config } from "dotenv";
import expenseRoutes from "./routes/expense.routes";
import categoryRoutes from "./routes/category.routes";
import savingProjectRoutes from "./routes/savingProject.routes";
import userRoutes from "./routes/user.routes";
import categoryBudgetRoutes from "./routes/categoryBudget.routes";
import incomeRoutes from "./routes/income.routes";
import importTransactionRoutes from "./routes/importTransaction.routes";
import connectDB from "./config/db";

config();

export const app = express();

// Conectar a la base de datos
connectDB();

// Middleware
app.use(json());

const corsOptions = {
    origin: [
        "https://personal-finance-backend-csxjr8eya-esrubar-projects.vercel.app",
        "http://localhost:3000",
        "http://localhost:5173",
    ],
    methods: "GET,POST,PUT,DELETE,OPTIONS",
    allowedHeaders: "Content-Type,Authorization",
    credentials: true,
};

app.use(cors(corsOptions));

app.get('/', (_req: any, res: any) => res.send('API funcionando 🎉'));
app.use('/api/expenses', expenseRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/saving-projects', savingProjectRoutes);
app.use('/api/users', userRoutes);
app.use('/api/categoryBudgets', categoryBudgetRoutes);
app.use('/api/incomes', incomeRoutes);
app.use('/api/import-transactions', importTransactionRoutes);

export default app;
