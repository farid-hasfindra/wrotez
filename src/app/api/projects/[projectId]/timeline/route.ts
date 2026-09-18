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

  const events = await db.timelineEvent.findMany({
    where: { projectId },
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json({ events });
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
    const { title, description, timeString, chapterRef, locationRef, characters } = await request.json();

    if (!title || !description || !timeString) {
      return NextResponse.json({ error: "Title, description, and timeString are required" }, { status: 400 });
    }

    const event = await db.timelineEvent.create({
      data: {
        projectId,
        title,
        description,
        timeString,
        chapterRef,
        locationRef,
        characters: typeof characters === "string" ? characters : JSON.stringify(characters || []),
      },
    });

    return NextResponse.json({ event });
  } catch (error) {
    console.error("Create timeline event error:", error);
    return NextResponse.json({ error: "Failed to create event" }, { status: 500 });
  }
}