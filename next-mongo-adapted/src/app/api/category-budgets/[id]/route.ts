export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

import { NextRequest } from "next/server";
import { connectDB } from "@config/db";
import { getCategoryBudget, updateCategoryBudget, deleteCategoryBudget } from "@services/categoryBudget.service";
import { CategoryBudgetUpdateDto } from "@dtos/categoryBudget.dto";
import { toProblem } from "@utils/errors";
import { currentUserId } from "@utils/authContext";

type Ctx = { params: { id: string } };

export async function GET(_: NextRequest, { params }: Ctx) {
  try {
    await connectDB();
    const userId = currentUserId();
    const item = await getCategoryBudget(params.id, userId);
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
    const patch = CategoryBudgetUpdateDto.parse(body);
    const updated = await updateCategoryBudget(params.id, userId, patch);
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
    const res = await deleteCategoryBudget(params.id, userId);
    if (res.deletedCount === 0) return toProblem(404, "Not found");
    return new Response(null, { status: 204 });
  } catch (e: any) {
    return toProblem(500, e.message ?? "Internal error");
  }
}
