import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ chapterId: string }> }
) {
  const userPayload = await getCurrentUser();
  if (!userPayload) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { chapterId } = await params;

  const versions = await db.chapterVersion.findMany({
    where: { chapterId },
    orderBy: { version: "desc" },
  });

  return NextResponse.json({ versions });
}