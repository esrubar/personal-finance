export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

import { NextRequest, NextResponse } from "next/server";
import { login } from "@services/auth.service";
import { LoginDto } from "@dtos/user.dto";
import { signJWT } from "@utils/jwt";

const allowedOrigins = {
  development: "http://localhost:5173",
  production: "https://personal-finance-frontend-f02gjef5p-esrubar-projects.vercel.app",
  test: "http://localhost:5173",
};

// Función para generar headers CORS
function getCorsHeaders() {
  const origin =
      allowedOrigins[process.env.NODE_ENV || "development"] || "*";
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Credentials": "true",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };
}

// Preflight
export async function OPTIONS(req: NextRequest) {
  return NextResponse.json({}, { headers: getCorsHeaders() });
}

export async function POST(req: NextRequest) {
  const headers = getCorsHeaders();

  try {
    console.log("Primera linea");
    const body = await req.json();
    const { name, password } = LoginDto.parse(body);

    const user = await login(name, password);
    console.log("Usuario logeado:", user);

    const token = signJWT({ sub: user.id, name: user.name });
    console.log("Token generado:", token);

    const res = NextResponse.json({ user }, { headers });
    res.cookies.set("token", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return res;
  } catch (e: any) {
    console.error("Error en login:", e);
    return NextResponse.json(
        { error: e.message ?? "Bad Request" },
        { status: 401, headers }
    );
  }
}
