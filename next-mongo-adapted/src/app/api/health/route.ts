export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  console.log("Revalidate", process.env.MONGODB_URI, process.env.JWT_SECRET);
  return Response.json({ status: "ok", env: process.env.MONGODB_URI });
}
