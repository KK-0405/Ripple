import { NextRequest, NextResponse } from "next/server";
import { google } from "googleapis";
import { createClient } from "@supabase/supabase-js";

function formatViews(n: number): string {
  if (n >= 100_000_000) return `${(n / 100_000_000).toFixed(1)}億回再生`;
  if (n >= 10_000) return `${Math.floor(n / 10_000)}万回再生`;
  if (n >= 1_000) return `${(n / 1000).toFixed(1)}K回再生`;
  return `${n}回再生`;
}

// キャッシュの有効期限（1日）
const CACHE_TTL_MS = 24 * 60 * 60 * 1000;

// タイトル・アーティスト名が動画タイトルにどれだけ含まれるかスコアリング
function scoreVideo(videoTitle: string, title: string, artist: string): number {
  const vt = videoTitle.toLowerCase();
  const titleWords = title.toLowerCase().split(/\s+/).filter((w) => w.length > 1);
  const artistWords = artist.toLowerCase().split(/\s+/).filter((w) => w.length > 1);
  let score = 0;
  for (const w of titleWords) if (vt.includes(w)) score += 2;
  for (const w of artistWords) if (vt.includes(w)) score += 2;
  if (vt.includes("official")) score += 1;
  if (vt.includes("music video") || vt.includes("mv")) score += 1;
  if (/karaoke|cover|tribute|live/i.test(vt)) score -= 5;
  return score;
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const title = searchParams.get("title");
  const artist = searchParams.get("artist");
  const trackId = searchParams.get("track_id");

  if (!title || !artist) {
    return NextResponse.json({ error: "title and artist required" }, { status: 400 });
  }

  const q = `${title} ${artist}`;
  const searchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(q)}`;

  const apiKeys = [
    process.env.YOUTUBE_API_KEY,
    process.env.YOUTUBE_API_KEY_2,
    process.env.YOUTUBE_API_KEY_3,
    process.env.YOUTUBE_API_KEY_4,
    process.env.YOUTUBE_API_KEY_5,
    process.env.YOUTUBE_API_KEY_6,
    process.env.YOUTUBE_API_KEY_7,
    process.env.YOUTUBE_API_KEY_8,
    process.env.YOUTUBE_API_KEY_9,
  ].filter(Boolean) as string[];
  if (apiKeys.length === 0) {
    return NextResponse.json({ searchUrl });
  }
  const apiKey = apiKeys[Math.floor(Math.random() * apiKeys.length)];

  // Supabaseキャッシュを確認
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const db = supabaseUrl && supabaseKey
    ? createClient(supabaseUrl, supabaseKey)
    : null;

  if (db && trackId) {
    const { data: cached } = await db
      .from("youtube_cache")
      .select("video_id, view_count, fetched_at")
      .eq("track_id", trackId)
      .single();

    if (cached) {
      const age = Date.now() - new Date(cached.fetched_at).getTime();
      if (age < CACHE_TTL_MS) {
        const videoId = cached.video_id;
        const videoUrl = videoId ? `https://www.youtube.com/watch?v=${videoId}` : undefined;
        return NextResponse.json({ videoId, videoUrl, viewCount: cached.view_count, searchUrl, cached: true });
      }
    }
  }

  try {
    const youtube = google.youtube({ version: "v3" });

    const searchRes = await youtube.search.list({
      key: apiKey,
      part: ["snippet"],
      q: `${q} official`,
      type: ["video"],
      maxResults: 5,
    });

    const items = searchRes.data.items ?? [];
    const scored = items
      .map((item) => ({
        item,
        score: scoreVideo(item.snippet?.title ?? "", title, artist),
      }))
      .sort((a, b) => b.score - a.score);
    const videoId = scored[0]?.item?.id?.videoId;
    if (!videoId) {
      return NextResponse.json({ searchUrl });
    }

    const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;

    const statsRes = await youtube.videos.list({
      key: apiKey,
      part: ["statistics"],
      id: [videoId],
    });

    const rawCount = statsRes.data.items?.[0]?.statistics?.viewCount;
    const viewCount = rawCount ? formatViews(parseInt(rawCount, 10)) : null;

    // キャッシュに保存（track_idがある場合のみ）
    if (db && trackId) {
      await db.from("youtube_cache").upsert({
        track_id: trackId,
        video_id: videoId,
        view_count: viewCount,
        fetched_at: new Date().toISOString(),
      });
    }

    return NextResponse.json({ videoId, videoUrl, viewCount, searchUrl });
  } catch (e) {
    return NextResponse.json({ searchUrl, error: String(e) });
  }
}
