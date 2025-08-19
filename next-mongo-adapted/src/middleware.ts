import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const PUBLIC = [/^\/api\/login/, /^\/api\/register/, /^\/api\/health/]; // rutas públicas

const allowedOrigins = {
  development: "http://localhost:5173",
  production: "https://tu-frontend-en-produccion.vercel.app",
  test: "http://localhost:5173",
};

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const res = NextResponse.next();

  // Determinar origen según entorno
  const origin = allowedOrigins[process.env.NODE_ENV || "development"] || "*";
  res.headers.set("Access-Control-Allow-Origin", origin);
  res.headers.set("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.headers.set("Access-Control-Allow-Credentials", "true");

  // Responder preflight OPTIONS
  if (req.method === "OPTIONS") {
    return res;
  }

  // Rutas públicas
  const isPublic = PUBLIC.some((re) => re.test(pathname));
  if (isPublic) return res;

  // Rutas protegidas con JWT
  if (pathname.startsWith("/api/")) {
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: res.headers });
    }

    try {
      await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET));
      return res;
    } catch (err) {
      console.error("JWT invalid:", err);
      return NextResponse.json({ error: "Invalid token" }, { status: 401, headers: res.headers });
    }
  }

  return res;
}

export const config = { matcher: ["/api/:path*"] };
