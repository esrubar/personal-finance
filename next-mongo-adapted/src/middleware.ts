import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const PUBLIC = [/^\/api\/login/, /^\/api\/register/, /^\/api\/health/]; // rutas públicas

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isPublic = PUBLIC.some((re) => re.test(pathname));
  if (isPublic) return NextResponse.next();

  if (pathname.startsWith("/api/")) {
    const token = req.cookies.get("token")?.value;

    if (!token)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
      await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET));
      return NextResponse.next();
    } catch (err) {
      console.error("JWT invalid:", err);
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }
  }

  return NextResponse.next();
}
export const config = { matcher: ["/api/:path*"] };
