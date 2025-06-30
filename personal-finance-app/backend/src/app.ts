import express from 'express';
import cors from 'cors';
import { connectDB } from './db';
import expenseRoutes from "./routes/expense.routes";
import categoryRoutes from "./routes/category.routes";
import savingProjectRoutes from "./routes/savingProject.routes";
import userRoutes from "./routes/user.routes";
import categoryBudgetRoutes from "./routes/categoryBudget.routes";

const app = express();
const PORT = process.env.NEXT_PUBLIC_PORT || 4000;

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

app.get('/', (_req: any, res: any) => res.send('API funcionando 🎉'));
app.use('/api/expenses', expenseRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/saving-projects', savingProjectRoutes);
app.use('/api/users', userRoutes);
app.use('/api/categoryBudgets', categoryBudgetRoutes);

if (process.env.VERCEL !== '1') {
    connectDB().then(() => {
        app.listen(PORT, () => {
            console.log(`🚀 Servidor local en http://localhost:${PORT}`);
        });
    });
}

export default app;
