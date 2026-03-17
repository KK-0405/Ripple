import { NextRequest, NextResponse } from "next/server";
import { getMetadataBatch } from "@/lib/gemini";

export async function POST(request: NextRequest) {
  try {
    const { tracks } = (await request.json()) as {
      tracks: { id: string; title: string; artist: string }[];
    };

    if (!tracks?.length) {
      return NextResponse.json({ metadata: [] });
    }

    const batchResult = await getMetadataBatch(
      tracks.map((t) => ({ title: t.title, artist: t.artist }))
    );

    return NextResponse.json({ metadata: batchResult.results, _debug: batchResult.error });
  } catch (error) {
    console.error("track-metadata error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
