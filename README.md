markdown# DJ Discovery

DJ向け楽曲探索アプリ

![DJ Discovery](https://dj-discovery-ihhs.vercel.app)

## 概要

曲 → 似ている曲 → さらに似ている曲という探索構造でDJが新しい曲を見つけるアプリ。

## デモ

🔗 https://dj-discovery-ihhs.vercel.app

## 機能

- 曲検索（Last.fm API）
- 類似曲探索（Last.fm Recommendations）
- メイン・サブSeed設定
- BPMフィルター
- ジャケ写表示（Last.fm + iTunes）
- プレイリスト作成・保存（Supabase）
- Googleログイン（NextAuth.js）
- YouTubeプレイリスト書き出し（YouTube Data API v3）

## 技術スタック

| カテゴリ | 技術 |
|----------|------|
| Frontend | Next.js 16, React 19, TypeScript |
| Styling | Tailwind CSS |
| Auth | NextAuth.js (Google OAuth) |
| Database | Supabase |
| APIs | Last.fm API, iTunes Search API, YouTube Data API v3 |
| Deploy | Vercel |
| 管理 | GitHub |

## セットアップ
```bash
git clone https://github.com/KK-0405/dj-discovery.git
cd dj-discovery
npm install
```

`.env.local` を作成：
```env
LASTFM_API_KEY=your_lastfm_api_key
LASTFM_API_SECRET=your_lastfm_api_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret
```
```bash
npm run dev
```

## 使い方

1. 曲名またはアーティスト名を検索
2. 気に入った曲をメインSeedまたはサブSeedに設定
3. 「類似曲を探索」ボタンを押す
4. 気に入った曲をプレイリストに追加
5. Googleログイン後にプレイリストを保存またはYouTubeに書き出し

## アーキテクチャ
```
src/
  app/
    api/
      search/      # Last.fm曲検索
      similar/     # Last.fm類似曲
      playlist/    # Supabaseプレイリスト保存
      youtube/     # YouTube書き出し
      auth/        # NextAuth認証
  components/
    SearchPanel    # 検索・曲一覧
    SeedPanel      # Seed設定
    PlaylistPanel  # プレイリスト管理
  lib/
    lastfm.ts      # Last.fm API
    supabase.ts    # Supabase client
  types/
    index.ts       # 型定義
```

## 今後の改善

- BPM・Key自動取得
- Discovery Graph（類似曲ネットワーク可視化）
- DJ Set Builder（次に合う曲推薦）
- Already In Library Filter
- サブジャンル自動分類（AI）

## クレジット

- 楽曲データ by [Last.fm](https://www.last.fm)
- BPM data by [GetSongBPM](https://getsongbpm.com)