import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  const userPayload = await getCurrentUser();
  if (!userPayload) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const projects = await db.project.findMany({
    where: {
      members: {
        some: { userId: userPayload.userId },
      },
    },
    include: {
      members: {
        include: {
          user: { select: { id: true, name: true, avatarUrl: true } },
        },
      },
      chapters: {
        select: { id: true, title: true, wordCount: true, status: true },
      },
    },
    orderBy: { updatedAt: "desc" },
  });

  return NextResponse.json({ projects });
}

export async function POST(request: Request) {
  const userPayload = await getCurrentUser();
  if (!userPayload) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { title, description, genre, language, targetWordCount, writingStyle } = await request.json();

    if (!title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    const project = await db.project.create({
      data: {
        title,
        description,
        genre: genre || "Fantasy",
        language: language || "English",
        targetWordCount: Number(targetWordCount) || 80000,
        writingStyle: writingStyle || "Third-Person Omniscient",
        members: {
          create: [{ userId: userPayload.userId, role: "OWNER" }],
        },
        chapters: {
          create: [
            {
              title: "Chapter 1: The Beginning",
              orderIndex: 1,
              content: "Write your opening scene here...",
              wordCount: 5,
              status: "DRAFT",
            },
          ],
        },
        activityLogs: {
          create: [
            {
              userId: userPayload.userId,
              action: "CREATED_NOVEL",
              details: `Created novel project '${title}'`,
            },
          ],
        },
      },
    });

    return NextResponse.json({ project });
  } catch (error) {
    console.error("Create project error:", error);
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 });
  }
}
