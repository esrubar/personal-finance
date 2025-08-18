import jwt, { SignOptions, JwtPayload } from "jsonwebtoken";

export function signJWT(
  payload: object,
  expiresIn: SignOptions["expiresIn"] = "7d"
): string {
  const options: SignOptions = { expiresIn };
  return jwt.sign(payload, process.env.JWT_SECRET as string, options);
}

export function verifyJWT<T = JwtPayload>(token: string): T {
  return jwt.verify(token, process.env.JWT_SECRET as string) as T;
}