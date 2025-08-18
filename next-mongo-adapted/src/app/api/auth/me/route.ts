export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { verifyJWT } from "@utils/jwt";

export async function GET() {
  try {
    const token = cookies().get("token")?.value;
    if (!token) return NextResponse.json({ user: null }, { status: 200 });
    const payload = verifyJWT<{ sub: string; name: string }>(token);
    return NextResponse.json({ user: { id: payload.sub, name: payload.name } });
  } catch {
    return NextResponse.json({ user: null }, { status: 200 });
  }
}
