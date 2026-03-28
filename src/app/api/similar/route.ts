import { NextRequest } from "next/server";
import { getSimilarTrackSuggestions, isJapanese, isJapaneseContext } from "@/lib/gemini";

const BLOCKED_PATTERNS = [
  /歌っちゃ王/, /うたっちゃ王/, /karaoke/i, /カラオケ/,
  /tribute/i, /cover version/i, /JOYSOUND/i,
];

function isKaraoke(title: string, artist: string): boolean {
  return BLOCKED_PATTERNS.some((re) => re.test(title) || re.test(artist));
}

function matchScore(hitTitle: string, hitArtist: string, sugTitle: string, sugArtist: string): number {
  const ht = hitTitle.toLowerCase();
  const ha = hitArtist.toLowerCase();
  const st = sugTitle.toLowerCase();
  const sa = sugArtist.toLowerCase();
  let score = 0;
  if (isJapanese(sugTitle)) {
    if (ht.includes(st) || st.includes(ht)) score += 6;
  } else {
    for (const w of st.split(/\s+/).filter((w) => w.length > 1)) if (ht.includes(w)) score += 2;
  }
  if (isJapanese(sugArtist)) {
    if (ha.includes(sa) || sa.includes(ha)) score += 6;
  } else {
    for (const w of sa.split(/\s+/).filter((w) => w.length > 1)) if (ha.includes(w)) score += 2;
  }
  if (ht === st) score += 4;
  if (ha === sa) score += 4;
  return score;
}

type Suggestion = {
  title: string; artist: string; bpm?: number; key?: string; camelot?: string;
  energy?: number; is_vocal?: boolean; genre_tags?: string[]; release_year?: number; reason?: string;
};

async function fetchItunesTrack(s: Suggestion, locale: string) {
  try {
    const q = encodeURIComponent(`${s.title} ${s.artist}`);
    const res = await fetch(`https://itunes.apple.com/search?term=${q}&media=music&entity=song&${locale}&limit=5`);
    const data = (await res.json()) as any;
    const hits: any[] = (data?.results ?? []).filter((r: any) => r.trackId);

    const candidates = hits
      .filter((h) => !isKaraoke(h.trackName ?? "", h.artistName ?? ""))
      .map((h) => ({ h, score: matchScore(h.trackName ?? "", h.artistName ?? "", s.title, s.artist) }))
      .sort((a, b) => b.score - a.score);

    const MIN_MATCH = isJapanese(s.title) ? 4 : 2;
    const best = (candidates[0]?.score ?? 0) >= MIN_MATCH ? candidates[0]?.h : null;
    if (!best) return null;

    const artwork = (best.artworkUrl100 as string | undefined)?.replace("100x100bb", "600x600bb") ?? "";

    return {
      id: `it_${best.trackId}`,
      name: best.trackName ?? s.title,
      artists: [{ name: best.artistName ?? s.artist }],
      album: { name: best?.collectionName ?? "", images: artwork ? [{ url: artwork }] : [] },
      duration_ms: best?.trackTimeMillis ?? 0,
      bpm: s.bpm || 0,
      key: s.key ?? "",
      camelot: s.camelot ?? "",
      energy: s.energy ?? 0.5,
      is_vocal: s.is_vocal ?? true,
      genre_tags: s.genre_tags ?? [],
      release_year: s.release_year ?? (best?.releaseDate ? parseInt(best.releaseDate.slice(0, 4)) : undefined),
      url: best?.trackViewUrl ?? `https://music.apple.com/search?term=${encodeURIComponent(`${s.title} ${s.artist}`)}`,
      preview: best?.previewUrl ?? undefined,
      reason: s.reason ?? undefined,
    };
  } catch {
    return {
      id: `gemini_${s.title}_${s.artist}`,
      name: s.title,
      artists: [{ name: s.artist }],
      album: { name: "", images: [] },
      duration_ms: 0,
      bpm: s.bpm || 0,
      key: s.key ?? "",
      camelot: s.camelot ?? "",
      energy: s.energy ?? 0.5,
      is_vocal: s.is_vocal ?? true,
      genre_tags: s.genre_tags ?? [],
      release_year: s.release_year ?? undefined,
      url: `https://music.apple.com/search?term=${encodeURIComponent(`${s.title} ${s.artist}`)}`,
      preview: undefined,
      reason: s.reason ?? undefined,
    };
  }
}

export async function POST(request: NextRequest) {
  const { seed, subSeeds = [], count = 20, excludeTitles = [], excludeAnthems = false, instruction, subSeedInfluences } = (await request.json()) as {
    seed: {
      title: string; artist: string; genre_tags?: string[];
      bpm?: number; camelot?: string; energy?: number;
      danceability?: number; is_vocal?: boolean; release_year?: number;
    };
    subSeeds?: { title: string; artist: string; genre_tags?: string[]; bpm?: number; camelot?: string; release_year?: number; energy?: number; is_vocal?: boolean }[];
    count?: number; excludeTitles?: string[]; excludeAnthems?: boolean; instruction?: string;
    subSeedInfluences?: string[];
  };

  if (!seed?.title || !seed?.artist) {
    return new Response(JSON.stringify({ error: "seed is required" }), { status: 400 });
  }
  if (typeof seed.title !== "string" || seed.title.length > 300 ||
      typeof seed.artist !== "string" || seed.artist.length > 300) {
    return new Response(JSON.stringify({ error: "invalid seed" }), { status: 400 });
  }
  if (!Array.isArray(excludeTitles) || excludeTitles.length > 500) {
    return new Response(JSON.stringify({ error: "invalid excludeTitles" }), { status: 400 });
  }

  const cap = Math.min(count, 30);
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      const enqueue = (obj: object) =>
        controller.enqueue(encoder.encode(JSON.stringify(obj) + "\n"));

      try {
        // Phase 1: Gemini で類似曲候補を取得（ここが最も時間がかかる）
        const { suggestions, japaneseSeed: geminiJapaneseSeed, error: geminiError } =
          await getSimilarTrackSuggestions(seed, subSeeds, cap, excludeTitles, excludeAnthems, instruction, subSeedInfluences);

        const japaneseSeed = geminiJapaneseSeed ?? isJapaneseContext(seed.title, seed.artist, seed.genre_tags);

        if (suggestions.length === 0) {
          enqueue({ type: "error", message: geminiError ?? "Gemini returned 0 suggestions" });
          controller.close();
          return;
        }

        const locale = japaneseSeed ? "country=JP&lang=ja_jp" : "country=US&lang=en_us";

        // Gemini完了を通知 → クライアントはローディングを解除してリスト表示開始
        enqueue({ type: "start" });

        // Phase 2: 全 iTunes 検索を並列起動し、完了した曲から即座にストリーム送出
        await Promise.all(
          suggestions.slice(0, cap).map(async (s) => {
            const track = await fetchItunesTrack(s, locale);
            if (track) enqueue({ type: "track", track });
          })
        );

        enqueue({ type: "done" });
      } catch (error) {
        enqueue({ type: "error", message: String(error) });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "application/x-ndjson",
      "Cache-Control": "no-cache",
      "X-Accel-Buffering": "no",
    },
  });
}
