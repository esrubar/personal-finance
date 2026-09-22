// src/middlewares/authMiddleware.ts
import { Request, Response, NextFunction } from 'express';
import jwt, { VerifyErrors, JwtPayload } from 'jsonwebtoken';

// Interfaz para extender el payload si guardas datos personalizados (ej. 'role')
export interface CustomJwtPayload extends JwtPayload {
  id: string;
  role: string;
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies?.access_token;

  if (!token) {
    return res.status(401).json({ message: 'Token de acceso no proporcionado' });
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET no está configurado en las variables de entorno');
  }

  // Tipamos 'err' como VerifyErrors | null y 'decoded' como CustomJwtPayload | undefined
  jwt.verify(
    token,
    secret,
    (err: VerifyErrors | null, decoded: string | JwtPayload | undefined) => {
      if (err || !decoded) {
        return res.status(401).json({ message: 'Token inválido o expirado' });
      }

      // Guardamos la información decodificada
      req.user = decoded as CustomJwtPayload;
      next();
    },
  );
};
