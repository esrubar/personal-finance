export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

import { cookies } from "next/headers";
import {NextRequest, NextResponse} from "next/server";
import { verifyJWT } from "@utils/jwt";

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

export async function GET() {
  const headers = getCorsHeaders();

  try {
    const token = cookies().get("token")?.value;
    if (!token) return NextResponse.json({ user: null }, { status: 200 });
    const payload = verifyJWT<{ sub: string; name: string }>(token);
    return NextResponse.json({ user: { id: payload.sub, name: payload.name } }, {headers});
  } catch {
    return NextResponse.json({ user: null }, { status: 200 });
  }
}
