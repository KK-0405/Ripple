import { ProxyAgent, fetch as undiciFetch } from "undici";

const API_KEY = process.env.LASTFM_API_KEY!;
const BASE_URL = "https://ws.audioscrobbler.com/2.0/";
const proxyAgent = new ProxyAgent("http://172.16.71.1:3128");

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
  const res = await undiciFetch(
    `${BASE_URL}?method=track.search&track=${encodeURIComponent(query)}&api_key=${API_KEY}&format=json&limit=20`,
    { dispatcher: proxyAgent }
  );
  const data = await res.json() as any;
  const tracks = data.results?.trackmatches?.track ?? [];

  return tracks.map((t: any, i: number) => ({
    id: t.mbid || `${i}-${t.name}`,
    name: t.name,
    artists: [{ name: t.artist }],
    album: {
      name: "",
      images: [{ url: t.image?.[2]?.["#text"] || `https://picsum.photos/seed/${i}/48` }],
    },
    duration_ms: 0,
    bpm: 0,
    key: "",
    url: t.url,
  }));
}

export async function getSimilarTracks(artist: string, track: string): Promise<Track[]> {
  const res = await undiciFetch(
    `${BASE_URL}?method=track.getsimilar&artist=${encodeURIComponent(artist)}&track=${encodeURIComponent(track)}&api_key=${API_KEY}&format=json&limit=20`,
    { dispatcher: proxyAgent }
  );
  const data = await res.json() as any;
  const tracks = data.similartracks?.track ?? [];

  return tracks.map((t: any, i: number) => ({
    id: t.mbid || `${i}-${t.name}`,
    name: t.name,
    artists: [{ name: t.artist.name }],
    album: {
      name: "",
      images: [{ url: t.image?.[2]?.["#text"] || `https://picsum.photos/seed/${i}/48` }],
    },
    duration_ms: t.duration * 1000 || 0,
    bpm: 0,
    key: "",
    url: t.url,
  }));
}