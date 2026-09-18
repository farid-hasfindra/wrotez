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

  const project = await db.project.findUnique({
    where: { id: projectId },
    include: {
      members: {
        include: {
          user: { select: { id: true, name: true, email: true, avatarUrl: true } },
        },
      },
      chapters: {
        select: { id: true, title: true, wordCount: true, status: true, orderIndex: true, updatedAt: true },
        orderBy: { orderIndex: "asc" },
      },
      _count: {
        select: { characters: true, ideas: true, plots: true, worldbuilding: true, timelineEvents: true },
      },
    },
  });

  if (!project) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }

  // Check user is member
  const isMember = project.members.some((m) => m.userId === userPayload.userId);
  if (!isMember) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  return NextResponse.json({ project });
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const userPayload = await getCurrentUser();
  if (!userPayload) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { projectId } = await params;

  try {
    const { title, description, genre, language, targetWordCount, writingStyle } = await request.json();

    const existing = await db.project.findUnique({
      where: { id: projectId },
      include: { members: true },
    });

    if (!existing) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Only owner or co-author can edit
    const member = existing.members.find((m) => m.userId === userPayload.userId);
    if (!member || (member.role !== "OWNER" && member.role !== "CO_AUTHOR")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const project = await db.project.update({
      where: { id: projectId },
      data: {
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(genre !== undefined && { genre }),
        ...(language !== undefined && { language }),
        ...(targetWordCount !== undefined && { targetWordCount: Number(targetWordCount) }),
        ...(writingStyle !== undefined && { writingStyle }),
      },
    });

    return NextResponse.json({ project });
  } catch (error) {
    console.error("Update project error:", error);
    return NextResponse.json({ error: "Failed to update project" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const userPayload = await getCurrentUser();
  if (!userPayload) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { projectId } = await params;

  const existing = await db.project.findUnique({
    where: { id: projectId },
    include: { members: true },
  });

  if (!existing) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }

  const member = existing.members.find((m) => m.userId === userPayload.userId);
  if (!member || member.role !== "OWNER") {
    return NextResponse.json({ error: "Only owner can delete project" }, { status: 403 });
  }

  await db.project.delete({ where: { id: projectId } });

  return NextResponse.json({ success: true });
}