import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  const { data, error } = await supabase
    .from("playlists")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ playlists: data });
}

export async function POST(request: NextRequest) {
  const { name, tracks } = await request.json();

  if (!name || !tracks) {
    return NextResponse.json({ error: "name and tracks are required" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("playlists")
    .insert({ name, tracks })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ playlist: data });
}

export async function DELETE(request: NextRequest) {
  const { id } = await request.json();

  const { error } = await supabase
    .from("playlists")
    .delete()
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}