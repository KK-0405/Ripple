import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { supabase } from "@/lib/supabase";

export async function GET() {
  const session = await getServerSession(authOptions);
  const userEmail = session?.user?.email;

  if (!userEmail) {
    return NextResponse.json({ playlists: [] });
  }

  const { data, error } = await supabase
    .from("playlists")
    .select("*")
    .eq("user_email", userEmail)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ playlists: data });
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  const userEmail = session?.user?.email;

  if (!userEmail) {
    return NextResponse.json({ error: "ログインが必要です" }, { status: 401 });
  }

  const { name, tracks } = await request.json();

  if (!name || !tracks) {
    return NextResponse.json({ error: "name and tracks are required" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("playlists")
    .insert({ name, tracks, user_email: userEmail })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ playlist: data });
}

export async function DELETE(request: NextRequest) {
  const session = await getServerSession(authOptions);
  const userEmail = session?.user?.email;

  if (!userEmail) {
    return NextResponse.json({ error: "ログインが必要です" }, { status: 401 });
  }

  const { id } = await request.json();

  const { error } = await supabase
    .from("playlists")
    .delete()
    .eq("id", id)
    .eq("user_email", userEmail); // 自分のプレイリストのみ削除可

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
