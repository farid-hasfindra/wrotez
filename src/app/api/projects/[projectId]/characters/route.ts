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

  const characters = await db.character.findMany({
    where: { projectId },
    include: {
      relationshipsFrom: {
        include: { toCharacter: { select: { id: true, name: true } } },
      },
    },
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json({ characters });
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
    const { name, role, status, description, personality, motivation, secrets } = await request.json();

    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    const character = await db.character.create({
      data: {
        projectId,
        name,
        role: role || "Supporting",
        status: status || "ALIVE",
        description,
        personality,
        motivation,
        secrets,
      },
    });

    return NextResponse.json({ character });
  } catch (error) {
    console.error("Create character error:", error);
    return NextResponse.json({ error: "Failed to create character" }, { status: 500 });
  }
}