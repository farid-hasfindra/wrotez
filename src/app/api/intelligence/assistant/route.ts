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
    const { projectId, question } = await request.json();

    if (!question) {
      return NextResponse.json({ error: "Question is required" }, { status: 400 });
    }

    const project = await db.project.findUnique({
      where: { id: projectId },
      include: {
        chapters: { select: { title: true, content: true } },
        characters: { select: { name: true, secrets: true } },
      },
    });

    const novelContext = project?.chapters.map((c) => `${c.title}\n${c.content}`).join("\n\n") || "";
    const characters = project?.characters.map((ch) => ch.name) || [];

    const aiProvider = getAIProvider();
    const answer = await aiProvider.answerStoryQuestion({
      question,
      novelContext,
      characters,
    });

    return NextResponse.json({ answer, provider: aiProvider.name });
  } catch (error) {
    console.error("AI Assistant error:", error);
    return NextResponse.json({ error: "Failed to answer story question" }, { status: 500 });
  }
}
