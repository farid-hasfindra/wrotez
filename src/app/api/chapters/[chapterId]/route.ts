import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { computeTextDiff } from "@/lib/contribution-engine";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ chapterId: string }> }
) {
  const userPayload = await getCurrentUser();
  if (!userPayload) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { chapterId } = await params;

  const chapter = await db.chapter.findUnique({
    where: { id: chapterId },
    include: {
      versions: { orderBy: { createdAt: "desc" }, take: 10 },
      comments: {
        include: { user: { select: { id: true, name: true, avatarUrl: true } } },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!chapter) {
    return NextResponse.json({ error: "Chapter not found" }, { status: 404 });
  }

  return NextResponse.json({ chapter });
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ chapterId: string }> }
) {
  const userPayload = await getCurrentUser();
  if (!userPayload) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { chapterId } = await params;

  try {
    const { content, title, status } = await request.json();

    const existingChapter = await db.chapter.findUnique({
      where: { id: chapterId },
    });

    if (!existingChapter) {
      return NextResponse.json({ error: "Chapter not found" }, { status: 404 });
    }

    const beforeText = existingChapter.content || "";
    const afterText = content !== undefined ? content : beforeText;

    const words = afterText.trim().split(/\s+/).filter(Boolean);
    const wordCount = words.length;

    // Calculate diff if content changed
    const diffResult = computeTextDiff(beforeText, afterText);

    // Create chapter version if major change (> 20 words)
    let versionIndex = 1;
    const lastVersion = await db.chapterVersion.findFirst({
      where: { chapterId },
      orderBy: { version: "desc" },
    });
    if (lastVersion) versionIndex = lastVersion.version + 1;

    const updatedChapter = await db.chapter.update({
      where: { id: chapterId },
      data: {
        title: title || existingChapter.title,
        content: afterText,
        wordCount,
        status: status || existingChapter.status,
      },
    });

    if (Math.abs(diffResult.wordDelta) > 10 || beforeText.length === 0) {
      // Log Contribution Event
      await db.contributionEvent.create({
        data: {
          userId: userPayload.userId,
          projectId: existingChapter.projectId,
          chapterId: existingChapter.id,
          type: diffResult.type,
          beforeContent: beforeText.slice(0, 500),
          afterContent: afterText.slice(0, 500),
          diff: diffResult.summary,
          wordDelta: diffResult.wordDelta,
          characterDelta: diffResult.characterDelta,
        },
      });

      // Save Version
      await db.chapterVersion.create({
        data: {
          chapterId,
          version: versionIndex,
          content: afterText,
          wordCount,
          createdById: userPayload.userId,
        },
      });

      // Log Activity
      await db.activityLog.create({
        data: {
          projectId: existingChapter.projectId,
          userId: userPayload.userId,
          action: "EDITED_CHAPTER",
          details: `Edited '${updatedChapter.title}' (${diffResult.summary})`,
        },
      });
    }

    return NextResponse.json({ chapter: updatedChapter, diffResult });
  } catch (error) {
    console.error("Save chapter error:", error);
    return NextResponse.json({ error: "Failed to save chapter" }, { status: 500 });
  }
}
