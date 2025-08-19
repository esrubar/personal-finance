import {connectDB} from "@config/db";
import {NextRequest, NextResponse} from "next/server";
import {LoginDto} from "@dtos/user.dto";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(req: NextRequest) {
  try {
  console.log("Revalidate");
  await connectDB();
    console.log("Primera linea");
    const body = await req.json();
    const { name, password } = LoginDto.parse(body);
    console.log("Body", name, password);
    
  return NextResponse.json({ status: "ok", env: process.env.MONGODB_URI, db: "connected" });
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? "Bad Request" }, { status: 400 });
  }
}
