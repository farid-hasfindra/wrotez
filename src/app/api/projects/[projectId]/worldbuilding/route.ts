import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const userPayload = await getCurrentUser();
  if (!userPayload) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { projectId } = await params;

  const entries = await db.worldBuildingEntry.findMany({
    where: { projectId },
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json({ entries });
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const userPayload = await getCurrentUser();
  if (!userPayload) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { projectId } = await params;

  try {
    const { name, category, description, history } = await request.json();

    if (!name || !description) {
      return NextResponse.json({ error: "Name and description are required" }, { status: 400 });
    }

    const entry = await db.worldBuildingEntry.create({
      data: {
        projectId,
        name,
        category: category || "Kingdoms",
        description,
        history,
      },
    });

    return NextResponse.json({ entry });
  } catch (error) {
    console.error("Create worldbuilding entry error:", error);
    return NextResponse.json({ error: "Failed to create entry" }, { status: 500 });
  }
}