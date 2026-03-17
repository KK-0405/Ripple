import { NextResponse } from "next/server";

export async function GET() {
  const apiKey = process.env.GETSONGBPM_API_KEY;

  if (!apiKey) {
    return NextResponse.json({ error: "GETSONGBPM_API_KEY is not set" });
  }

  try {
    const searchRes = await fetch(
      `https://api.getsongbpm.com/search/?api_key=${apiKey}&type=song&lookup=${encodeURIComponent("Pretender Official Hige Dandism")}`
    );
    const text = await searchRes.text();
    let parsed: unknown = null;
    try { parsed = JSON.parse(text); } catch { /* not json */ }

    return NextResponse.json({
      apiKeySet: true,
      status: searchRes.status,
      rawResponse: text.slice(0, 500),
      parsed,
    });
  } catch (e) {
    return NextResponse.json({ error: String(e) });
  }
}
