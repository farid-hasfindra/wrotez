import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { getAIProvider } from "@/lib/ai-provider";

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
    include: { chapters: true },
  });

  const fullText = project?.chapters.map((c) => c.content).join("\n") || "";

  const aiProvider = getAIProvider();
  const inconsistencies = await aiProvider.detectInconsistency(fullText);

  return NextResponse.json({
    projectId,
    healthMetrics: {
      narrativeConsistency: 92,
      characterConsistency: 88,
      timelineConsistency: 95,
      unresolvedPlotThreads: 3,
    },
    inconsistencies,
  });
}
