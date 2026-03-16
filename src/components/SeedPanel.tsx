"use client";

import { type Track } from "@/types";

type Props = {
  mainSeed: Track | null;
  setMainSeed: (track: Track | null) => void;
  subSeeds: Track[];
  removeSubSeed: (id: string) => void;
  exploreSimilar: () => void;
};

export default function SeedPanel({
  mainSeed, setMainSeed, subSeeds, removeSubSeed, exploreSimilar,
}: Props) {
  return (
    <div>
      <div style={{ fontSize: "12px", fontWeight: 500, color: "#aaa", marginBottom: "10px", textTransform: "uppercase", letterSpacing: "0.05em" }}>Seed</div>

      <div style={{ marginBottom: "10px" }}>
        <div style={{ fontSize: "11px", color: "#666", marginBottom: "6px" }}>メイン</div>
        {mainSeed ? (
          <div style={{ display: "flex", alignItems: "center", gap: "8px", background: "#1db95422", border: "0.5px solid #1db95444", borderRadius: "6px", padding: "8px" }}>
            <img src={mainSeed.album.images[0]?.url} alt={mainSeed.album.name} width={32} height={32} style={{ borderRadius: "3px", flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <div style={{ color: "#fff", fontSize: "11px" }}>{mainSeed.name}</div>
              <div style={{ color: "#666", fontSize: "10px" }}>{mainSeed.artists[0].name}</div>
            </div>
            <button onClick={() => setMainSeed(null)} style={{ background: "none", border: "none", color: "#555", fontSize: "14px", cursor: "pointer" }}>×</button>
          </div>
        ) : (
          <div style={{ padding: "8px", background: "#1a1a1a", borderRadius: "6px", color: "#555", fontSize: "11px", textAlign: "center" }}>検索結果からメインを選択</div>
        )}
      </div>

      <div>
        <div style={{ fontSize: "11px", color: "#666", marginBottom: "6px" }}>サブ</div>
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          {subSeeds.length === 0 && (
            <div style={{ padding: "8px", background: "#1a1a1a", borderRadius: "6px", color: "#555", fontSize: "11px", textAlign: "center" }}>サブSeedを追加</div>
          )}
          {subSeeds.map((track) => (
            <div key={track.id} style={{ display: "flex", alignItems: "center", gap: "8px", background: "#1a1a1a", borderRadius: "6px", padding: "8px" }}>
              <img src={track.album.images[0]?.url} alt={track.album.name} width={28} height={28} style={{ borderRadius: "3px", flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div style={{ color: "#aaa", fontSize: "11px" }}>{track.name}</div>
                <div style={{ color: "#555", fontSize: "10px" }}>{track.artists[0].name}</div>
              </div>
              <button onClick={() => removeSubSeed(track.id)} style={{ background: "none", border: "none", color: "#555", fontSize: "14px", cursor: "pointer" }}>×</button>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={exploreSimilar}
        disabled={!mainSeed}
        style={{ width: "100%", marginTop: "12px", padding: "8px", background: mainSeed ? "#1db954" : "#222", border: "none", borderRadius: "8px", color: mainSeed ? "#fff" : "#555", fontSize: "13px", fontWeight: 500, cursor: mainSeed ? "pointer" : "default" }}
      >
        類似曲を探索
      </button>
    </div>
  );
}