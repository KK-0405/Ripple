import { NextRequest, NextResponse } from "next/server";

// Deezer preview URLs are signed/time-limited CDN URLs that expire.
// This endpoint fetches a fresh preview URL from Deezer by track ID.
export async function GET(request: NextRequest) {
  const id = request.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

  try {
    const res = await fetch(`https://api.deezer.com/track/${id}`);
    const data = (await res.json()) as any;
    const preview: string | undefined = data?.preview;
    if (!preview) return NextResponse.json({ error: "no preview" }, { status: 404 });
    return NextResponse.json({ preview });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
