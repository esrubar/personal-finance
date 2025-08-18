export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

import { NextRequest } from "next/server";
import { connectDB } from "@config/db";
import { listSavingProjects, createSavingProject } from "@services/savingProject.service";
import { SavingProjectCreateDto } from "@dtos/savingProject.dto";
import { toProblem } from "@utils/errors";
import { currentUserId } from "@utils/authContext";

export async function GET() {
  try {
    await connectDB();
    const userId = currentUserId();
    const items = await listSavingProjects(userId);
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
    const parsed = SavingProjectCreateDto.parse(body);
    const created = await createSavingProject(userId, parsed);
    return Response.json(created, { status: 201 });
  } catch (e: any) {
    return toProblem(400, e.message ?? "Bad Request");
  }
}
