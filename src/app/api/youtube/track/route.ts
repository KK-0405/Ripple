import { NextRequest, NextResponse } from "next/server";
import { google } from "googleapis";

function formatViews(n: number): string {
  if (n >= 100_000_000) return `${(n / 100_000_000).toFixed(1)}億回再生`;
  if (n >= 10_000) return `${Math.floor(n / 10_000)}万回再生`;
  if (n >= 1_000) return `${(n / 1000).toFixed(1)}K回再生`;
  return `${n}回再生`;
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const title = searchParams.get("title");
  const artist = searchParams.get("artist");

  if (!title || !artist) {
    return NextResponse.json({ error: "title and artist required" }, { status: 400 });
  }

  const q = `${title} ${artist}`;
  const searchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(q)}`;

  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey) {
    // APIキー未設定: 検索URLのみ返す
    return NextResponse.json({ searchUrl });
  }

  try {
    const youtube = google.youtube({ version: "v3" });

    // 動画検索
    const searchRes = await youtube.search.list({
      key: apiKey,
      part: ["snippet"],
      q,
      type: ["video"],
      maxResults: 1,
      videoCategoryId: "10", // Music
    });

    const videoId = searchRes.data.items?.[0]?.id?.videoId;
    if (!videoId) {
      return NextResponse.json({ searchUrl });
    }

    const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;

    // 再生数取得
    const statsRes = await youtube.videos.list({
      key: apiKey,
      part: ["statistics"],
      id: [videoId],
    });

    const rawCount = statsRes.data.items?.[0]?.statistics?.viewCount;
    const viewCount = rawCount ? formatViews(parseInt(rawCount, 10)) : null;

    return NextResponse.json({ videoId, videoUrl, viewCount, searchUrl });
  } catch (e) {
    // API失敗でも検索URLは返す
    return NextResponse.json({ searchUrl, error: String(e) });
  }
}
