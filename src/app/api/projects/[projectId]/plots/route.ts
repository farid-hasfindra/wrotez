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

  const plots = await db.plot.findMany({
    where: { projectId },
    include: {
      points: { orderBy: { orderIndex: "asc" } },
    },
    orderBy: { id: "asc" },
  });

  return NextResponse.json({ plots });
}