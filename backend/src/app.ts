import express, { json } from "express";
import cors from "cors";
import { config } from "dotenv";
import expenseRoutes from "./routes/expenseRoutes";
import categoryRoutes from "./routes/categoryRoutes";
import savingProjectRoutes from "./routes/savingProjectRoutes";
import userRoutes from "./routes/userRoutes";
import categoryBudgetRoutes from "./routes/categoryBudgetRoutes";
import incomeRoutes from "./routes/incomeRoutes";
import importTransactionRoutes from "./routes/importTransactionRoutes";
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
        "https://personal-finance-backend-ten.vercel.app",
        "https://personal-finance-frontend-f02gjef5p-esrubar-projects.vercel.app"
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
