// src/types/express.d.ts
import { UserRole } from '../models/User'; // O ajusta la ruta a tus enum/interfaces

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        role: UserRole;
        email?: string;
      };
    }
  }
}
