const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID!;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET!;
const GETSONGBPM_API_KEY = process.env.GETSONGBPM_API_KEY!;

// SpotifyはHTTPS直接接続（プロキシ経由だとブロックされる）
const spotifyFetch = (url: string, init?: RequestInit) => fetch(url, init);

// アクセストークンのキャッシュ
let cachedToken: string | null = null;
let tokenExpiry = 0;

async function getAccessToken(): Promise<string> {
  if (cachedToken && Date.now() < tokenExpiry) return cachedToken;

  const res = await spotifyFetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString("base64")}`,
    },
    body: "grant_type=client_credentials",
  });

  const data = (await res.json()) as any;
  cachedToken = data.access_token;
  tokenExpiry = Date.now() + (data.expires_in - 60) * 1000;
  return cachedToken!;
}

// BPM・キーはGetSongBPMから取得（SpotifyのAudio Features APIは新規アプリに制限あり）
async function getBpmAndKey(artist: string, track: string): Promise<{ bpm: number; key: string }> {
  try {
    const query = `${artist} ${track}`;
    const searchRes = await fetch(
      `https://api.getsongbpm.com/search/?api_key=${GETSONGBPM_API_KEY}&type=song&lookup=${encodeURIComponent(query)}`
    );
    const searchData = (await searchRes.json()) as any;
    const songId = searchData?.search?.[0]?.song_id;
    if (!songId) return { bpm: 0, key: "" };

    const songRes = await fetch(
      `https://api.getsongbpm.com/song/?api_key=${GETSONGBPM_API_KEY}&id=${songId}`
    );
    const songData = (await songRes.json()) as any;
    const bpm = songData?.song?.tempo ? Math.round(Number(songData.song.tempo)) : 0;
    const key = songData?.song?.key_of || "";
    return { bpm, key };
  } catch {
    return { bpm: 0, key: "" };
  }
}

export type Track = {
  id: string;
  name: string;
  artists: { name: string }[];
  album: { name: string; images: { url: string }[] };
  duration_ms: number;
  bpm: number;
  key: string;
  url: string;
};

export async function searchTracks(query: string): Promise<Track[]> {
  const token = await getAccessToken();

  const res = await spotifyFetch(
    `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=20`,
    { headers: { Authorization: `Bearer ${token}` } }
  );

  const data = (await res.json()) as any;
  const items = data?.tracks?.items ?? [];

  if (items.length === 0) return [];

  return Promise.all(
    items.map(async (t: any) => {
      const { bpm, key } = await getBpmAndKey(t.artists[0]?.name ?? "", t.name);
      return {
        id: t.id,
        name: t.name,
        artists: t.artists.map((a: any) => ({ name: a.name })),
        album: {
          name: t.album.name,
          images: t.album.images,
        },
        duration_ms: t.duration_ms,
        bpm,
        key,
        url: t.external_urls.spotify,
      };
    })
  );
}

export async function getSimilarTracks(artist: string, track: string): Promise<Track[]> {
  const token = await getAccessToken();

  // まずトラックIDを取得
  const searchRes = await spotifyFetch(
    `https://api.spotify.com/v1/search?q=${encodeURIComponent(`${track} ${artist}`)}&type=track&limit=1`,
    { headers: { Authorization: `Bearer ${token}` } }
  );

  const searchData = (await searchRes.json()) as any;
  const seedTrack = searchData?.tracks?.items?.[0];

  if (!seedTrack) return [];

  // レコメンデーション取得
  const recRes = await spotifyFetch(
    `https://api.spotify.com/v1/recommendations?seed_tracks=${seedTrack.id}&limit=20`,
    { headers: { Authorization: `Bearer ${token}` } }
  );

  const recData = (await recRes.json()) as any;
  const tracks = recData?.tracks ?? [];

  if (tracks.length === 0) return [];

  return Promise.all(
    tracks.map(async (t: any) => {
      const { bpm, key } = await getBpmAndKey(t.artists[0]?.name ?? "", t.name);
      return {
        id: t.id,
        name: t.name,
        artists: t.artists.map((a: any) => ({ name: a.name })),
        album: {
          name: t.album.name,
          images: t.album.images,
        },
        duration_ms: t.duration_ms,
        bpm,
        key,
        url: t.external_urls.spotify,
      };
    })
  );
}
