"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { type Track, type SavedPlaylist, type YoutubePlaylist } from "@/types";

type Props = {
  session: any;
  playlist: Track[];
  removeFromPlaylist: (id: string) => void;
  savedPlaylists: SavedPlaylist[];
  playlistName: string;
  setPlaylistName: (v: string) => void;
  savePlaylist: () => void;
  deletePlaylist: (id: string) => void;
  setPlaylist: (tracks: Track[]) => void;
  exportToYouTube: (existingPlaylistId: string | null) => void;
};

export default function PlaylistPanel({
  session, playlist, removeFromPlaylist, savedPlaylists,
  playlistName, setPlaylistName, savePlaylist, deletePlaylist,
  setPlaylist, exportToYouTube,
}: Props) {
  const [showSaved, setShowSaved] = useState(false);
  const [showYoutubeSelect, setShowYoutubeSelect] = useState(false);
  const [youtubePlaylists, setYoutubePlaylists] = useState<YoutubePlaylist[]>([]);
  const [selectedYoutubePlaylist, setSelectedYoutubePlaylist] = useState("new");
  const [exporting, setExporting] = useState(false);

  const handleYoutubeExportClick = async () => {
    if (playlist.length === 0) return;
    const res = await fetch("/api/youtube/playlists");
    const data = await res.json();
    setYoutubePlaylists(data.playlists ?? []);
    setShowYoutubeSelect(true);
  };

  const handleExport = async () => {
    setExporting(true);
    await exportToYouTube(selectedYoutubePlaylist === "new" ? null : selectedYoutubePlaylist);
    setExporting(false);
    setShowYoutubeSelect(false);
  };

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "8px" }}>
      <div style={{ fontSize: "12px", fontWeight: 500, color: "#aaa", textTransform: "uppercase", letterSpacing: "0.05em" }}>プレイリスト（{playlist.length}曲）</div>

      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        {playlist.length === 0 && (
          <div style={{ padding: "8px", background: "#1a1a1a", borderRadius: "6px", color: "#555", fontSize: "11px", textAlign: "center" }}>類似曲から追加</div>
        )}
        {playlist.map((track) => (
          <div key={track.id} style={{ display: "flex", alignItems: "center", gap: "8px", background: "#1a1a1a", borderRadius: "6px", padding: "8px" }}>
            <img src={track.album.images[0]?.url} alt={track.album.name} width={28} height={28} style={{ borderRadius: "3px", flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <div style={{ color: "#fff", fontSize: "11px" }}>{track.name}</div>
              <div style={{ color: "#666", fontSize: "10px" }}>{track.artists[0].name}</div>
            </div>
            <button onClick={() => removeFromPlaylist(track.id)} style={{ background: "none", border: "none", color: "#555", fontSize: "14px", cursor: "pointer" }}>×</button>
          </div>
        ))}
      </div>

      {!session ? (
        <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginTop: "auto" }}>
          <div style={{ padding: "8px", background: "#1a1a1a", borderRadius: "6px", color: "#555", fontSize: "11px", textAlign: "center" }}>
            ログインすると保存・書き出しができます
          </div>
          <button
            onClick={() => signIn("google")}
            style={{ width: "100%", padding: "8px", background: "#4285f4", border: "none", borderRadius: "8px", color: "#fff", fontSize: "13px", fontWeight: 500, cursor: "pointer" }}
          >
            Googleでログイン
          </button>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginTop: "auto" }}>
          <div style={{ fontSize: "11px", color: "#666", textAlign: "center" }}>{session.user?.email}</div>
          <input
            type="text"
            value={playlistName}
            onChange={(e) => setPlaylistName(e.target.value)}
            style={{ width: "100%", padding: "6px 8px", background: "#222", border: "0.5px solid #444", borderRadius: "6px", color: "#fff", fontSize: "11px", outline: "none" }}
          />
          <button
            onClick={savePlaylist}
            style={{ width: "100%", padding: "8px", background: playlist.length > 0 ? "#1db954" : "#222", border: "none", borderRadius: "8px", color: playlist.length > 0 ? "#fff" : "#555", fontSize: "13px", fontWeight: 500, cursor: playlist.length > 0 ? "pointer" : "default" }}
          >
            保存する
          </button>
          <button
            onClick={handleYoutubeExportClick}
            style={{ width: "100%", padding: "8px", background: playlist.length > 0 ? "#ff0000" : "#222", border: "none", borderRadius: "8px", color: playlist.length > 0 ? "#fff" : "#555", fontSize: "13px", fontWeight: 500, cursor: playlist.length > 0 ? "pointer" : "default" }}
          >
            YouTubeに書き出し
          </button>
          {showYoutubeSelect && (
            <div style={{ display: "flex", flexDirection: "column", gap: "6px", background: "#1a1a1a", borderRadius: "8px", padding: "10px" }}>
              <div style={{ fontSize: "11px", color: "#aaa" }}>書き出し先を選択</div>
              <select
                value={selectedYoutubePlaylist}
                onChange={(e) => setSelectedYoutubePlaylist(e.target.value)}
                style={{ width: "100%", padding: "6px 8px", background: "#222", border: "0.5px solid #444", borderRadius: "6px", color: "#fff", fontSize: "11px", outline: "none" }}
              >
                <option value="new">新規プレイリストを作成</option>
                {youtubePlaylists.map((p) => (
                  <option key={p.id} value={p.id}>{p.snippet.title}</option>
                ))}
              </select>
              <div style={{ display: "flex", gap: "6px" }}>
                <button
                  onClick={handleExport}
                  style={{ flex: 1, padding: "6px", background: "#ff0000", border: "none", borderRadius: "6px", color: "#fff", fontSize: "11px", fontWeight: 500, cursor: "pointer" }}
                >
                  {exporting ? "書き出し中..." : "書き出す"}
                </button>
                <button
                  onClick={() => setShowYoutubeSelect(false)}
                  style={{ padding: "6px 10px", background: "#333", border: "none", borderRadius: "6px", color: "#aaa", fontSize: "11px", cursor: "pointer" }}
                >
                  キャンセル
                </button>
              </div>
            </div>
          )}
          <button
            onClick={() => setShowSaved(!showSaved)}
            style={{ width: "100%", padding: "6px", background: "#222", border: "none", borderRadius: "6px", color: "#888", fontSize: "11px", cursor: "pointer" }}
          >
            {showSaved ? "保存済みを隠す" : `保存済み（${savedPlaylists.length}）`}
          </button>
          {showSaved && savedPlaylists.map((p) => (
            <div key={p.id} style={{ display: "flex", alignItems: "center", gap: "6px", background: "#1a1a1a", borderRadius: "6px", padding: "6px 8px" }}>
              <div style={{ flex: 1 }}>
                <div style={{ color: "#fff", fontSize: "11px" }}>{p.name}</div>
                <div style={{ color: "#666", fontSize: "10px" }}>{p.tracks.length}曲</div>
              </div>
              <button onClick={() => setPlaylist(p.tracks)} style={{ padding: "2px 6px", background: "#333", border: "none", borderRadius: "4px", color: "#aaa", fontSize: "10px", cursor: "pointer" }}>読込</button>
              <button onClick={() => deletePlaylist(p.id)} style={{ background: "none", border: "none", color: "#555", fontSize: "12px", cursor: "pointer" }}>×</button>
            </div>
          ))}
        </div>
      )}

      <div style={{ marginTop: "8px", paddingTop: "8px", borderTop: "0.5px solid #222", textAlign: "center" }}>
        <a href="https://getsongbpm.com" target="_blank" rel="noreferrer" style={{ color: "#444", fontSize: "10px", textDecoration: "none" }}>
          BPM data by GetSongBPM
        </a>
      </div>
    </div>
  );
}