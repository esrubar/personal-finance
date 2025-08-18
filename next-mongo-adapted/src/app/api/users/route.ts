export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

import { NextRequest } from "next/server";
import { connectDB } from "@config/db";
import { listUsers, createUser } from "@services/user.service";
import { UserCreateDto } from "@dtos/user.dto";
import { toProblem } from "@utils/errors";

export async function GET() {
  try {
    await connectDB();
    const items = await listUsers();
    return Response.json(items.map(u => ({ _id: u._id, name: u.name, auditable: u.auditable })));
  } catch (e: any) {
    return toProblem(500, e.message ?? "Internal error");
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const parsed = UserCreateDto.parse(body);
    const created = await createUser(parsed.name, parsed.password);
    return Response.json(created, { status: 201 });
  } catch (e: any) {
    return toProblem(400, e.message ?? "Bad Request");
  }
}
