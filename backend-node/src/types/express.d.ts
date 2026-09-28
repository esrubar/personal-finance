// src/types/express.d.ts
import type { UserRole } from '../user/user';
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

export {};