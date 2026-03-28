# Ripple — DJ Music Discovery

DJが新しい曲を発見するためのAI搭載楽曲探索ツール。

## デモ

🔗 **https://ripplefm.vercel.app**

---

## 機能

### 楽曲検索
- Deezer API（主）＋ iTunes Search API（補完）によるトラック検索
- 日本語 / 英語のロケール自動切替
- BPM付き検索結果 / アルバムアート表示
- 30秒プレビュー再生

### AIによる類似曲探索（メイン機能）
- Gemini APIが文脈を理解してリコメンドを生成
- メインSeed（1曲）＋サブSeed（複数曲）で探索方向を指定
- サブSeedごとの影響パラメータ指定（タイトル・アーティスト・ジャンル・BPM・年代・ムード）
- カスタム指示文（自由テキスト）でリコメンドを制御
- 結果をNDJSON形式でストリーミング表示（リアルタイムに曲が出現）

### フィルター
- BPM範囲（±5 / ±10）
- Camelotキー隣接（ハーモニックミキシング）
- ジャンル絞り込み
- エネルギーレベル（High / Medium / Low）
- 年代（10年単位）
- 同一アーティスト除外 / プレイリスト内曲除外

### トラックメタデータ解析
- GeminiがBPM・Key・Camelot・Energy・ボーカル有無・ジャンルタグ・リリース年を推定
- ブラウザ（localStorage）にキャッシュし、同じ曲を再解析しない

### プレイリスト管理
- ドラッグ＆ドロップでトラック並び替え
- 一括追加 / 一括削除ボタン
- プレイリスト名変更・公開/非公開切替・削除（編集モーダル）
- 公開URLを自動生成（8文字スラッグ）
- Supabaseに保存（Googleログイン必須）

### YouTube書き出し
- YouTube Data API v3でプレイリストを作成 / 既存リストに追記
- 各曲をYouTubeで検索し動画を自動マッチング
- 完了後にYouTube Musicを自動で開く

### 公開プレイリスト
- `/explore` — 公開プレイリスト一覧（ISR 60秒キャッシュ）
- `/playlist/[slug]` — 公開プレイリスト詳細（SSG）

### その他
- 探索履歴（最大20件、localStorage保存）
- ダーク / ライトモード切替
- モバイル対応（スワイプでドロワー操作）

---

## 技術スタック

| カテゴリ | 技術 |
|----------|------|
| Frontend | Next.js 16 (App Router), React 19, TypeScript |
| Styling | Tailwind CSS v4 |
| Auth | NextAuth.js v4 (Google OAuth) + Supabase Auth |
| Database | Supabase (PostgreSQL + RLS) |
| AI | Google Gemini API (gemini-2.0-flash-lite) |
| 音楽データ | Deezer API, iTunes Search API |
| 動画 | YouTube Data API v3 |
| Deploy | Vercel |

---

## セットアップ

```bash
git clone https://github.com/KK-0405/dj-discovery.git
cd dj-discovery
npm install
```

`.env.local` を作成：

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Gemini
GEMINI_API_KEY=your_gemini_api_key

# Google OAuth (NextAuth)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret

# YouTube Data API（クォータ対策で最大9キー対応）
YOUTUBE_API_KEY_1=your_youtube_api_key
# YOUTUBE_API_KEY_2=...
```

> **注意**: DeezerはCORSのため本番（Vercel）経由でのみ動作します。ローカルではDeezer検索が失敗する場合があります。

```bash
npm run dev
```

---

## 使い方

1. 曲名またはアーティスト名を検索
2. 気に入った曲を **メインSeed** に設定 → Geminiが自動でメタデータ（BPM・Key等）を解析
3. 必要に応じて **サブSeed** を追加（探索方向を複数指定）
4. フィルターやカスタム指示を設定して「**類似曲を探索**」
5. 結果をプレイリストに追加（個別 or 一括）
6. Googleログイン後にプレイリストを保存 / YouTubeに書き出し

---

## アーキテクチャ

```
src/
├── app/
│   ├── api/
│   │   ├── search/          # Deezer + iTunes トラック検索
│   │   ├── similar/         # Geminiによる類似曲生成（NDJSONストリーム）
│   │   ├── track-metadata/  # Geminiによるメタデータ解析
│   │   ├── playlist/        # プレイリストCRUD（Supabase）
│   │   ├── youtube/         # YouTube書き出し
│   │   ├── preview/         # Deezerプレビュー URL更新
│   │   ├── public-playlists/# 公開プレイリスト一覧
│   │   └── auth/            # NextAuth.js
│   ├── explore/page.tsx     # 公開プレイリスト一覧ページ
│   ├── playlist/[slug]/     # 公開プレイリスト詳細ページ
│   └── page.tsx             # メインアプリ
├── components/
│   ├── SearchPanel.tsx      # 検索・類似曲一覧・履歴
│   ├── SeedPanel.tsx        # Seed設定・フィルター
│   ├── PlaylistPanel.tsx    # プレイリスト管理・書き出し
│   └── AuthModal.tsx        # ログインモーダル
└── lib/
    ├── gemini.ts            # Gemini APIクライアント
    ├── deezer.ts            # Deezer APIラッパー
    ├── itunes.ts            # iTunes Search APIラッパー
    ├── supabase.ts          # Supabaseクライアント
    ├── auth-context.tsx     # 認証状態管理
    └── theme-context.tsx    # ダーク/ライトモード
```

### 主要な設計判断

- **Geminiによるリコメンド**: 従来のMLレコメンダーではなくLLMで文脈理解。日本語 / 洋楽の言語純度ルールをプロンプトで制御。
- **NDJSONストリーミング**: 類似曲をリアルタイムで1件ずつ表示し体感速度を改善。
- **Deezer + iTunes ハイブリッド**: Deezerで国際的カバレッジ・BPM、iTunesでアートワーク補完。
- **ブラウザローカルキャッシュ**: メタデータ・探索履歴をlocalStorageに保存しサーバーコストゼロ。
- **Supabase RLS**: `user_id = auth.uid()` ポリシーでユーザーデータを分離。

---

## データベーススキーマ（Supabase）

**playlists**

| カラム | 型 | 説明 |
|--------|----|------|
| id | UUID | 主キー |
| user_id | UUID | auth.usersへの外部キー |
| user_email | text | ユーザーメール |
| name | text | プレイリスト名 |
| tracks | jsonb | トラック配列 |
| is_public | boolean | 公開フラグ |
| slug | text | 公開URL用8文字ID |
| created_at | timestamp | 作成日時 |

RLSポリシー: `user_id = auth.uid()` でSELECT/INSERT/UPDATE/DELETE

---

## クレジット

- 楽曲データ by [Deezer](https://www.deezer.com) / [Apple iTunes](https://www.apple.com/itunes/)
- AI推論 by [Google Gemini](https://deepmind.google/technologies/gemini/)
- 動画データ by [YouTube](https://www.youtube.com)
