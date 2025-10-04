import express, { json } from "express";
import cors from "cors";
import { config } from "dotenv";
import userRoutes from "./routes/userRoutes";
import connectDB from "./config/db";

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

export default app;
