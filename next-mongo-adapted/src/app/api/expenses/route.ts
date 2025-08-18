export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

import { NextRequest } from "next/server";
import { connectDB } from "@config/db";
import { listExpenses, createExpense } from "@services/expense.service";
import { ExpenseCreateDto } from "@dtos/expense.dto";
import { toProblem } from "@utils/errors";
import { currentUserId } from "@utils/authContext";

export async function GET() {
  try {
    await connectDB();
    const userId = currentUserId();
    const items = await listExpenses(userId);
    return Response.json(items);
  } catch (e: any) {
    return toProblem(500, e.message ?? "Internal error");
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const userId = currentUserId();
    const body = await req.json();
    const parsed = ExpenseCreateDto.parse(body);
    const created = await createExpense(userId, parsed);
    return Response.json(created, { status: 201 });
  } catch (e: any) {
    return toProblem(400, e.message ?? "Bad Request");
  }
}
