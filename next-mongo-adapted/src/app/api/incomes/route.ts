export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

import { NextRequest } from "next/server";
import { connectDB } from "@config/db";
import { listIncomes, createIncome } from "@services/income.service";
import { IncomeCreateDto } from "@dtos/income.dto";
import { toProblem } from "@utils/errors";
import { currentUserId } from "@utils/authContext";

export async function GET() {
  try {
    await connectDB();
    const userId = currentUserId();
    const items = await listIncomes(userId);
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
    const parsed = IncomeCreateDto.parse(body);
    const created = await createIncome(userId, parsed);
    return Response.json(created, { status: 201 });
  } catch (e: any) {
    return toProblem(400, e.message ?? "Bad Request");
  }
}
