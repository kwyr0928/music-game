import { NextResponse } from "next/server";
import { db } from "~/server/db";

export async function GET() {
  try {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    const songs = await db.songs.findMany({
      select: {
        id: true,
        name: true,
        note: true,
      },
    });
    return NextResponse.json(songs);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "データの取得に失敗しました。";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
