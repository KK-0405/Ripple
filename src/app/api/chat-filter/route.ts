import { NextRequest, NextResponse } from "next/server";

const GEMINI_API =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent";

export async function POST(req: NextRequest) {
  const { instruction, tracks, mainSeed } = await req.json();
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return NextResponse.json({ error: "No API key" }, { status: 500 });
  if (!instruction || !Array.isArray(tracks) || tracks.length === 0) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  if (typeof instruction !== "string" || instruction.length > 500) {
    return NextResponse.json({ error: "instruction too long" }, { status: 400 });
  }
  if (tracks.length > 100) {
    return NextResponse.json({ error: "too many tracks" }, { status: 400 });
  }

  const trackList = tracks
    .map((t: any, i: number) => {
      const parts = [`${i}: "${t.name}" by ${t.artists?.[0]?.name ?? "Unknown"}`];
      if (t.bpm) parts.push(`BPM:${t.bpm}`);
      if (t.camelot) parts.push(`Key:${t.camelot}`);
      if (t.energy !== undefined) parts.push(`Energy:${Math.round(t.energy * 100)}%`);
      if (t.danceability !== undefined) parts.push(`Dance:${Math.round(t.danceability * 100)}%`);
      if (t.is_vocal !== undefined) parts.push(t.is_vocal ? "Vocal" : "Instrumental");
      if (t.genre_tags?.length) parts.push(`Genres:${t.genre_tags.join(",")}`);
      if (t.release_year) parts.push(`Year:${t.release_year}`);
      return parts.join(" ");
    })
    .join("\n");

  const seedInfo = mainSeed
    ? `"${mainSeed.name}" by ${mainSeed.artists?.[0]?.name ?? "Unknown"}` +
      (mainSeed.bpm ? ` (${mainSeed.bpm} BPM)` : "") +
      (mainSeed.camelot ? `, Key:${mainSeed.camelot}` : "") +
      (mainSeed.energy !== undefined ? `, Energy:${Math.round(mainSeed.energy * 100)}%` : "")
    : "unknown";

  const prompt = `You are a DJ assistant helping filter a list of similar tracks based on a natural language instruction.

Seed track: ${seedInfo}

Similar tracks (index: title, metadata):
${trackList}

User's filter instruction: "${instruction}"

Based on the instruction, select which tracks match. Return a JSON object:
{
  "indices": [/* array of matching track indices (0-based integers) */],
  "message": "/* brief reply in Japanese, max 50 chars, explaining what was filtered */"
}

Rules:
- Be generous: if unsure, include the track
- If the instruction is unclear, include all tracks
- Reply message must be in Japanese
- Return ONLY the JSON object, no markdown fences`;

  const res = await fetch(`${GEMINI_API}?key=${apiKey}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.2, maxOutputTokens: 512 },
    }),
  });

  const data = await res.json();
  const text: string =
    data?.candidates?.[0]?.content?.parts?.find((p: any) => !p.thought && p.text)?.text ??
    data?.candidates?.[0]?.content?.parts?.[0]?.text ??
    "";

  try {
    const match = text.match(/\{[\s\S]*\}/);
    const parsed = JSON.parse(match?.[0] ?? text);
    const indices: number[] = (parsed.indices ?? []).filter(
      (i: unknown) => typeof i === "number" && i >= 0 && i < tracks.length
    );
    const ids = indices.map((i) => tracks[i].id).filter(Boolean);
    return NextResponse.json({ ids, message: parsed.message ?? "" });
  } catch {
    return NextResponse.json({ error: "Parse failed", raw: text.slice(0, 200) }, { status: 500 });
  }
}
