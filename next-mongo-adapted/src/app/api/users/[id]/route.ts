export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

import { NextRequest } from "next/server";
import { connectDB } from "@config/db";
import { getUser, updateUser, deleteUser } from "@services/user.service";
import { UserUpdateDto } from "@dtos/user.dto";
import { toProblem } from "@utils/errors";
import { currentUserId } from "@utils/authContext";

type Ctx = { params: { id: string } };

export async function GET(_: NextRequest, { params }: Ctx) {
  try {
    await connectDB();
    const item = await getUser(params.id);
    if (!item) return toProblem(404, "Not found");
    return Response.json(item);
  } catch (e: any) {
    return toProblem(500, e.message ?? "Internal error");
  }
}

export async function PUT(req: NextRequest, { params }: Ctx) {
  try {
    await connectDB();
    const actorId = currentUserId();
    const body = await req.json();
    const patch = UserUpdateDto.parse(body);
    const updated = await updateUser(params.id, patch, actorId);
    if (!updated) return toProblem(404, "Not found");
    return Response.json({ _id: updated._id, name: updated.name, auditable: updated.auditable });
  } catch (e: any) {
    return toProblem(400, e.message ?? "Bad Request");
  }
}

export async function DELETE(_: NextRequest, { params }: Ctx) {
  try {
    await connectDB();
    const res = await deleteUser(params.id);
    if (res.deletedCount === 0) return toProblem(404, "Not found");
    return new Response(null, { status: 204 });
  } catch (e: any) {
    return toProblem(500, e.message ?? "Internal error");
  }
}
