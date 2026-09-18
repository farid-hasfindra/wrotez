import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { getAIProvider } from "@/lib/ai-provider";

export async function POST(request: Request) {
  const userPayload = await getCurrentUser();
  if (!userPayload) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { projectId, changeDescription, affectedCharacter } = await request.json();

    if (!projectId || !changeDescription) {
      return NextResponse.json({ error: "projectId and changeDescription are required" }, { status: 400 });
    }

    const project = await db.project.findUnique({
      where: { id: projectId },
      include: {
        chapters: { select: { id: true, title: true, orderIndex: true, content: true } },
        characters: { select: { id: true, name: true, role: true } },
        storyEvents: { select: { id: true, title: true } },
        ideas: { select: { id: true, title: true, status: true } },
      },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    const aiProvider = getAIProvider();
    const impact = await aiProvider.analyzeStoryImpact({
      changeDescription,
      affectedCharacter,
      chapters: project.chapters,
      characters: project.characters,
      events: project.storyEvents,
    });

    // Persist to AIAnalysis table
    await db.aIAnalysis.create({
      data: {
        projectId,
        analysisType: "PLOT",
        result: JSON.stringify({ changeDescription, impact }),
        confidence: 0.88,
      },
    });

    return NextResponse.json({ impact, projectId });
  } catch (error) {
    console.error("Impact analysis error:", error);
    return NextResponse.json({ error: "Failed to analyze story impact" }, { status: 500 });
  }
}
