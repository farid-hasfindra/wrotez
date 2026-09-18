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

  try {
    const characters = await db.character.findMany({
      where: { projectId },
      include: {
        relationshipsFrom: true,
      },
    });

    const plots = await db.plot.findMany({
      where: { projectId },
      include: {
        points: true,
      },
    });

    const locations = await db.location.findMany({
      where: { projectId },
    });
    
    const events = await db.storyEvent.findMany({
      where: { projectId },
    });

    return NextResponse.json({
      characters,
      plots,
      locations,
      events,
    });
  } catch (error) {
    console.error("Error fetching graph data:", error);
    return NextResponse.json({ error: "Failed to fetch graph data" }, { status: 500 });
  }
}
