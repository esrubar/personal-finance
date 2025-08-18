export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

import { NextRequest } from "next/server";
import { connectDB } from "@config/db";
import { listCategories, createCategory } from "@services/category.service";
import { CategoryCreateDto } from "@dtos/category.dto";
import { toProblem } from "@utils/errors";
import { currentUserId } from "@utils/authContext";

export async function GET() {
  try {
    console.log("GET");
    await connectDB();
    const userId = currentUserId();
    const items = await listCategories(userId);
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
    const parsed = CategoryCreateDto.parse(body);
    const created = await createCategory(userId, parsed);
    return Response.json(created, { status: 201 });
  } catch (e: any) {
    return toProblem(400, e.message ?? "Bad Request");
  }
}
