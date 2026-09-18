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

  const ideas = await db.idea.findMany({
    where: { projectId },
    include: {
      author: { select: { id: true, name: true, avatarUrl: true } },
      developments: {
        include: {
          // IdeaContribution does not have a user relation; derive via author of the idea or leave as-is
        },
        orderBy: { createdAt: "asc" },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ ideas });
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
    const { title, description, category } = await request.json();

    if (!title || !description) {
      return NextResponse.json({ error: "Title and description are required" }, { status: 400 });
    }

    const idea = await db.idea.create({
      data: {
        projectId,
        authorId: userPayload.userId,
        title,
        description,
        category: category || "PLOT",
        status: "PROPOSED",
      },
    });

    await db.activityLog.create({
      data: {
        projectId,
        userId: userPayload.userId,
        action: "CREATED_IDEA",
        details: `Proposed idea: ${title}`,
      },
    });

    return NextResponse.json({ idea });
  } catch (error) {
    console.error("Create idea error:", error);
    return NextResponse.json({ error: "Failed to create idea" }, { status: 500 });
  }
}