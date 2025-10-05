import express from "express";
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
import {UserRepository} from "./repositories/userRepository";
import jwt from 'jsonwebtoken'
import cookieParser from 'cookie-parser'
import {authMiddleware} from "./middlewares/middleware";

config();

export const app = express();

// Conectar a la base de datos
connectDB();

// Middleware
app.use(express.json());
app.use(cookieParser());

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

app.post("/login", async (req: any, res: any) => {
    const { name, password } = req.body;
    try {
        const user = await UserRepository.login(name, password);
        if(!user) return res.status(401).json({})
        
        const token = jwt.sign(
            {id: user.id, name: user.name},
            process.env.JWT_SECRET ?? "",
            { expiresIn: "1h" }
        );
        
        res
            .cookie('access_token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: 'strict',
            })
            .send(user);
    } catch (error: any) {
        res.status(401).send(error.message);
    }
    
    //diferentes interfaces para el usuario
    // la información publica y la privada. El password no hay que enviarlo.
});
app.post("/register", async (req: any, res: any) => {
    const { name, password } = req.body;
    try {
        const user = await UserRepository.create(name, password)
        res.send(user);
    } catch (e: any) {
        res.status(400).send(e.message)
    }
});
app.post("/logout", (req: any, res: any) => {
    res
        .clearCookie('access_token')
        .json({message: 'Logout successfully'});
});
app.post("/protected", authMiddleware, (req: any, res: any) => {
    res.status(200).send("Perfect");
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
