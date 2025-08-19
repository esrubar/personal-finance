export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

import { NextRequest, NextResponse } from "next/server";
import { login } from "@services/auth.service";
import { LoginDto } from "@dtos/user.dto";
import { signJWT } from "@utils/jwt";

export async function POST(req: NextRequest) {
  console.log(process.env.MONGODB_URI, process.env.JWT_SECRET)
  try {
    console.log("Primera linea");
    const body = await req.json();
    const { name, password } = LoginDto.parse(body);

    const user = await login(name, password);
    console.log(user);
    
    const token = signJWT({ sub: user.id, name: user.name });
    console.log("token:", token);
    const res = NextResponse.json({ user });
    console.log(res);
    res.cookies.set("token", token, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: 60*60*24*7 });
    return res;
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? "Bad Request" }, { status: 400 });
  }
}
