import { type Track } from "@/lib/deezer";

function mapItunesTrack(t: any): Track {
  const artwork = (t.artworkUrl100 as string | undefined)?.replace("100x100bb", "300x300bb") ?? "";
  return {
    id: `it_${t.trackId}`,
    name: t.trackName ?? "",
    artists: [{ name: t.artistName ?? "" }],
    album: {
      name: t.collectionName ?? "",
      images: artwork ? [{ url: artwork }] : [],
    },
    duration_ms: t.trackTimeMillis ?? 0,
    bpm: 0,
    key: "",
    url: t.trackViewUrl ?? "",
    preview: t.previewUrl ?? undefined,
    release_year: t.releaseDate ? parseInt(t.releaseDate.slice(0, 4)) : undefined,
  };
}

async function fetchDeezerBpm(title: string, artist: string): Promise<number> {
  try {
    const q = encodeURIComponent(`${title} ${artist}`);
    const res = await fetch(`https://api.deezer.com/search?q=${q}&limit=1`);
    const data = (await res.json()) as any;
    const hit = data?.data?.[0];
    if (!hit?.id) return 0;
    if (hit.bpm) return Math.round(hit.bpm);
    const detail = await fetch(`https://api.deezer.com/track/${hit.id}`);
    const d = (await detail.json()) as any;
    return d?.bpm ? Math.round(d.bpm) : 0;
  } catch {
    return 0;
  }
}

export async function searchTracks(query: string): Promise<Track[]> {
  const encoded = encodeURIComponent(query);
  const res = await fetch(
    `https://itunes.apple.com/search?term=${encoded}&media=music&country=JP&limit=25&lang=ja_jp`
  );
  const data = (await res.json()) as any;
  const tracks: Track[] = (data?.results ?? []).filter((t: any) => t.trackId).map(mapItunesTrack);

  const enriched = await Promise.all(
    tracks.map(async (track) => {
      const bpm = await fetchDeezerBpm(track.name, track.artists[0]?.name ?? "");
      return bpm ? { ...track, bpm } : track;
    })
  );

  return enriched;
}
