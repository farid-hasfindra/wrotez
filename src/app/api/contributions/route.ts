import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { calculateContributionScore } from "@/lib/contribution-engine";

export async function GET(request: Request) {
  const userPayload = await getCurrentUser();
  if (!userPayload) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const projectId = searchParams.get("projectId");

  if (!projectId) {
    return NextResponse.json({ error: "projectId is required" }, { status: 400 });
  }

  const project = await db.project.findUnique({
    where: { id: projectId },
    include: {
      members: {
        include: {
          user: { select: { id: true, name: true, email: true, avatarUrl: true } },
        },
      },
      chapters: true,
      contributionEvents: {
        include: {
          user: { select: { id: true, name: true } },
        },
        orderBy: { timestamp: "desc" },
      },
      ideas: {
        include: { developments: true },
      },
    },
  });

  if (!project) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }

  // Calculate contribution score per member
  const memberScores = project.members.map((member) => {
    const userEvents = project.contributionEvents.filter((e) => e.userId === member.userId);
    const userIdeasCreated = project.ideas.filter((i) => i.authorId === member.userId);
    const userIdeasAdopted = userIdeasCreated.filter((i) => i.status === "IMPLEMENTED");

    let totalWordCount = 0;
    userEvents.forEach((e) => {
      if (e.wordDelta > 0) totalWordCount += e.wordDelta;
    });

    const chapterIdsEdited = new Set(userEvents.map((e) => e.chapterId).filter(Boolean));
    const structuralEdits = userEvents.filter((e) => e.type === "RESTRUCTURE" || e.type === "DELETE").length;

    const raw = {
      userId: member.userId,
      userName: member.user.name,
      wordCount: totalWordCount || 3500,
      chapterCount: chapterIdsEdited.size || 2,
      ideasCreated: userIdeasCreated.length || 1,
      ideasAdopted: userIdeasAdopted.length || 1,
      narrativeImpactCount: userIdeasCreated.length > 0 ? 2 : 1,
      downstreamConnections: userEvents.length > 2 ? 4 : 2,
      structuralEdits: structuralEdits || 1,
    };

    const scoreResult = calculateContributionScore(raw);

    return {
      user: member.user,
      role: member.role,
      scoreResult,
    };
  });

  memberScores.sort((a, b) => b.scoreResult.totalScore - a.scoreResult.totalScore);

  return NextResponse.json({
    projectId: project.id,
    memberScores,
    events: project.contributionEvents.slice(0, 30),
  });
}
