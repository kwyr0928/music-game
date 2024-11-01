import { NextResponse } from "next/server";
import { db } from "~/server/db";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Invalid song ID" }, { status: 400 });
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    const song = await db.songs.findUnique({
      where: { id: Number(id) },
    });

    if (!song) {
      return NextResponse.json({ error: "Song not found" }, { status: 404 });
    }

    console.log("Fetched song:", song); // Debugging line to check song data

    return NextResponse.json(song);
  } catch (error) {
    console.error("Error fetching song:", error);
    return NextResponse.json({ error: "Failed to fetch song" }, { status: 500 });
  }
}
