export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

import { NextRequest } from "next/server";
import { connectDB } from "@config/db";
import { getIncome, updateIncome, deleteIncome } from "@services/income.service";
import { IncomeUpdateDto } from "@dtos/income.dto";
import { toProblem } from "@utils/errors";
import { currentUserId } from "@utils/authContext";

type Ctx = { params: { id: string } };

export async function GET(_: NextRequest, { params }: Ctx) {
  try {
    await connectDB();
    const userId = currentUserId();
    const item = await getIncome(params.id, userId);
    if (!item) return toProblem(404, "Not found");
    return Response.json(item);
  } catch (e: any) {
    return toProblem(500, e.message ?? "Internal error");
  }
}

export async function PUT(req: NextRequest, { params }: Ctx) {
  try {
    await connectDB();
    const userId = currentUserId();
    const body = await req.json();
    const patch = IncomeUpdateDto.parse(body);
    const updated = await updateIncome(params.id, userId, patch);
    if (!updated) return toProblem(404, "Not found");
    return Response.json(updated);
  } catch (e: any) {
    return toProblem(400, e.message ?? "Bad Request");
  }
}

export async function DELETE(_: NextRequest, { params }: Ctx) {
  try {
    await connectDB();
    const userId = currentUserId();
    const res = await deleteIncome(params.id, userId);
    if (res.deletedCount === 0) return toProblem(404, "Not found");
    return new Response(null, { status: 204 });
  } catch (e: any) {
    return toProblem(500, e.message ?? "Internal error");
  }
}
