import {connectDB} from "@config/db";
import {NextResponse} from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
  console.log("Revalidate");
  await connectDB();
  return NextResponse.json({ status: "ok", env: process.env.MONGODB_URI, db: "connected" });
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? "Bad Request" }, { status: 400 });
  }
}
