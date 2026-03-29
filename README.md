# Ripple — DJ Music Discovery

> DJのための楽曲発見・管理ツール。AIが選曲理由を添えて類似曲を提案する。

**デモ: https://ripplefm.vercel.app**

---

## 概要

Rippleは、DJが「次にかける曲」を見つけるためのWebアプリです。

曲名・アーティスト名で検索した曲を **Seed（起点）** に設定すると、Google Gemini AIがBPM・キー・ジャンル・雰囲気を総合的に分析し、「なぜこの曲を選んだか」の理由付きで類似曲を最大30曲提案します。提案された曲はプレイリストとして保存・共有でき、YouTubeへの書き出しにも対応しています。

---

## 主な機能

### 楽曲検索
- iTunes Search APIによる曲名・アーティスト名検索
- 日本語・英語のロケール自動切替（日本語ならiTunes Japan、英語ならiTunes USを使用）
- アーティスト名でのサジェスト表示
- Deezerから取得したBPMを検索結果に表示
- アルバムアートのサムネイル表示

### AI類似曲探索（メイン機能）
- **メインSeed**（基準曲）をもとに、Gemini AIが類似曲リストを生成
- **サブSeed**を複数追加することで探索方向を細かく指定できる（例：「AとBの中間のような曲」）
- サブSeedごとに影響させる要素を個別選択（タイトル・アーティスト・ジャンル・BPM・年代・ムード）
- 自由テキストで追加指示を入力可能（例：「インスト曲のみ」「80年代に絞って」）
- 取得件数を10・20・30曲から選択（デフォルト20曲）
- 結果はNDJSONストリームで届いた曲から順次表示（体感待ち時間を短縮）
- 各曲にGeminiによる**選曲理由**が付く

### フィルター
- BPM範囲（±5 / ±10 / 制限なし）
- Camelotキー隣接（ハーモニックミキシング対応）
- ジャンル絞り込み
- エネルギーレベル（High / Medium / Low）
- 年代絞り込み（10年単位）
- 大ヒット曲の除外
- インストのみ表示

### 楽曲詳細パネル
- BPM / Camelotキー / エネルギー値（バーグラフ）
- ボーカルあり/なし バッジ
- ジャンルタグ
- ストリーミング再生数（Deezer）
- 30秒プレビュー再生
- YouTubeリンク
- 選曲理由（類似曲探索結果から開いた場合）

### トラックメタデータ解析
- 検索結果の曲に対してGeminiがBPM・Key・Camelot・Energy・ボーカル有無・ジャンルタグ・リリース年を自動推定
- 推定結果はlocalStorageにキャッシュし、同じ曲を再解析しない

### プレイリスト管理
- 曲を個別・一括でプレイリストに追加
- ドラッグ＆ドロップでトラックの並び替え
- プレイリスト名変更・公開/非公開切替・削除
- 公開設定にすると8文字のスラッグURLが自動生成される（例：`/playlist/abc12345`）
- Supabaseに保存（Googleログイン必須）

### YouTube書き出し
- YouTube Data APIでプレイリストを新規作成、または既存プレイリストに追記
- 各曲をYouTube上で自動検索してマッチング
- 書き出し完了後にYouTube Musicを自動で開く

### 探索履歴
- 過去の類似曲探索結果を最大20件localStorageに保存
- 履歴から再度Seedに設定して探索を再実行できる

### 公開プレイリストページ
- `/explore` — 全ユーザーの公開プレイリスト一覧（ISR 60秒キャッシュ）
- `/playlist/[slug]` — 公開プレイリスト詳細ページ（SSG）

### その他
- ダーク / ライトモード（設定はlocalStorageに保存）
- iPhone PWA対応（SafariのホームScreen追加でフルスクリーン起動）
- Safe Area対応（iPhoneのホームインジケーターにUIが被らない）
- モバイルレイアウト対応（スワイプでドロワー操作）

---

## 技術スタック

| カテゴリ | 技術 |
|---|---|
| フレームワーク | Next.js 16 (App Router) |
| 言語 | TypeScript |
| スタイリング | Tailwind CSS v4 |
| 認証 | Supabase Auth（Google OAuth） |
| データベース | Supabase（PostgreSQL + Row Level Security） |
| ホスティング | Vercel |
| AI | Google Gemini API（`gemini-3.1-flash-lite-preview`） |
| 楽曲検索 | iTunes Search API |
| BPM補完・プレビュー | Deezer API |
| 動画連携 | YouTube Data API v3 |

**運用コスト：月額 ¥0**（全サービスを無料枠内で運用）

---

## システム構成

```
ブラウザ / iPhone PWA
        │ HTTPS
        ▼
Next.js（Vercel）
  ├── フロントエンド（React / TSX）
  └── API Routes（サーバーレス関数）
        ├── /api/search          → iTunes Search API
        ├── /api/similar         → Gemini API + iTunes API（NDJSONストリーム）
        ├── /api/track-metadata  → Gemini API（BPM・キー・エネルギー推定）
        ├── /api/preview         → Deezer API（プレビューURL更新）
        ├── /api/playlist        → Supabase（CRUD + RLS）
        ├── /api/public-playlists → Supabase（公開プレイリスト一覧）
        └── /api/youtube/*       → YouTube Data API
              │
              ▼
        Supabase（DB / Auth）
```

外部APIへの通信はすべてNext.jsのAPIルートを経由します。ブラウザから直接叩くと発生するCORS問題の回避と、GeminiのAPIキーをクライアントに露出させないためです。

---

## セットアップ

### 前提条件

- Node.js 18以上
- Supabaseアカウント
- Google Cloud Consoleでプロジェクト作成済み（OAuth + YouTube Data API有効化）
- Gemini APIキー

### インストール

```bash
git clone https://github.com/KK-0405/dj-discovery.git
cd dj-discovery
npm install
```

### 環境変数

`.env.local` をプロジェクトルートに作成します。

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Google Gemini
GEMINI_API_KEY=your_gemini_api_key

# Google OAuth（Supabase Auth の Google Provider に設定したもの）
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# YouTube Data API（クォータ上限対策として複数キー対応）
YOUTUBE_API_KEY_1=your_youtube_api_key_1
# YOUTUBE_API_KEY_2=your_youtube_api_key_2
# YOUTUBE_API_KEY_3=...
```

### 開発サーバー起動

```bash
npm run dev
```

> **注意**: Deezer APIはブラウザからのCORSリクエストを拒否します。ローカル開発ではプレビュー再生・BPM補完が動作しない場合があります。本番動作の確認はVercelデプロイ後に行ってください。

---

## 使い方

1. 曲名またはアーティスト名を検索する
2. 気に入った曲の「メイン」ボタンを押してSeedに設定する（GeminiがBPM・キーなどを自動解析）
3. 必要に応じてサブSeedや絞り込み条件・カスタム指示を設定する
4. 「類似曲を探索」ボタンを押す
5. 結果が届いた曲から順次表示される（30秒プレビューで試聴可能）
6. 気に入った曲を「リスト」ボタンでプレイリストに追加する
7. Googleログイン後にプレイリストを保存・公開・YouTubeに書き出しできる

---

## プロジェクト構成

```
src/
├── app/
│   ├── api/
│   │   ├── search/             # iTunes楽曲検索
│   │   ├── similar/            # Gemini類似曲生成（NDJSONストリーム）
│   │   ├── track-metadata/     # Geminiメタデータ解析
│   │   ├── playlist/           # プレイリストCRUD
│   │   ├── public-playlists/   # 公開プレイリスト一覧
│   │   ├── preview/            # Deezerプレビュー URL更新
│   │   ├── youtube/            # YouTube書き出し
│   │   └── google/             # Googleトークン管理
│   ├── explore/                # 公開プレイリスト一覧ページ
│   ├── playlist/[slug]/        # 公開プレイリスト詳細ページ
│   ├── layout.tsx              # ルートレイアウト（PWAメタタグ・viewport設定）
│   ├── providers.tsx           # クライアントプロバイダー
│   └── page.tsx                # メインアプリ
├── components/
│   ├── SearchPanel.tsx         # 検索・類似曲一覧・履歴・詳細パネル
│   ├── SeedPanel.tsx           # Seed設定・フィルター・探索条件
│   └── PlaylistPanel.tsx       # プレイリスト管理・YouTube書き出し
└── lib/
    ├── gemini.ts               # Gemini APIクライアント（メタデータ・類似曲）
    ├── itunes.ts               # iTunes Search APIラッパー
    ├── deezer.ts               # Deezer APIラッパー・Track型定義
    ├── supabase.ts             # Supabaseクライアント
    ├── auth-context.tsx        # 認証状態管理・Googleトークン管理
    └── theme-context.tsx       # ダーク/ライトモード
```

---

## 主な設計判断

### NDJSONストリーミング

`/api/similar` はGeminiが候補リストを生成するのに20〜30秒かかります。全件揃ってからレスポンスを返すとユーザーが長時間待つため、NDJSON（改行区切りJSON）形式でストリーミングします。

1. Gemini完了 → `{"type":"start"}` を送信（クライアントがローディング解除）
2. iTunes検索が完了した曲から即 `{"type":"track", "track":{...}}` を送信
3. 全曲完了 → `{"type":"done"}` を送信

これによりGeminiの待ち時間後、曲が流れ込んでくる体験になります。

### 楽曲データのAPI分担

| API | 用途 | 理由 |
|---|---|---|
| iTunes Search API | 楽曲検索・アートワーク | 認証不要・安定・CORS問題なし |
| Deezer API | BPM補完・プレビュー音源 | iTunesはBPMを返さないため |
| Gemini API | BPM/Key/Energy推定・ジャンルタグ・類似曲・選曲理由 | |

DeezerのプレビューURLはCDNの署名付きURLで時間制限があります。ページ読み込み時にまとめて取得するとリロード後に期限切れになるため、再生ボタンを押した時点で `/api/preview` 経由で最新URLを取得します。

### SupabaseのRow Level Security

```sql
-- 自分のプレイリストのみ操作可
CREATE POLICY "own playlists" ON playlists
  USING (user_id = auth.uid());

-- 公開プレイリストは全員が閲覧可
CREATE POLICY "public read" ON playlists
  FOR SELECT USING (is_public = true);
```

### Geminiの日本語/英語判定

「クイーン」はイギリスのバンドQueenのカタカナ表記であり、文字種で判断するとJPとして誤判定します。GeminiにアーティストのIDを直接問い合わせ、国籍・活動市場で日本語コンテキストかどうかを判断させています。これによってiTunes APIのロケール（`country=JP` / `country=US`）を正しく切り替えます。

---

## データベーススキーマ

### playlists テーブル

| カラム | 型 | 説明 |
|---|---|---|
| id | UUID | 主キー |
| user_id | UUID | auth.users への外部キー |
| user_email | text | ユーザーのメールアドレス |
| name | text | プレイリスト名 |
| tracks | JSONB | Track オブジェクトの配列 |
| is_public | boolean | 公開フラグ |
| slug | text | 公開URL用8文字スラッグ（例: `abc12345`） |
| created_at | timestamptz | 作成日時 |

### users テーブル（プロフィール）

| カラム | 型 | 説明 |
|---|---|---|
| id | UUID | auth.users.id と同値（PK兼FK） |
| user_id | text | 表示名 |
| avatar_url | text | アバター画像URL |

### Track型（JSONB）

楽曲データは正規化せず `playlists.tracks` にJSONB配列として格納します。GeminiのメタデータはAIの推定値なので取得タイミングで変わる可能性があり、プレイリストごとのスナップショットとして保持する方が適切なためです。

```
id           string   — "it_{trackId}" 形式
name         string   — 曲名
artists      object[] — [{name: string}]
album        object   — {name: string, images: [{url: string}]}
bpm          number
camelot      string   — 例: "11A"（Camelotホイール表記）
energy       number   — 0〜1
is_vocal     boolean
genre_tags   string[]
release_year number
reason       string   — AI選曲理由（類似曲探索時のみ）
preview      string   — Deezerプレビュー音源URL（時限付き）
url          string   — iTunes楽曲ページURL
```

---

## デプロイ

Vercelへのデプロイ時は、Vercelダッシュボードの Environment Variables に上記の環境変数をすべて設定してください。

```bash
vercel --prod
```

---

## クレジット

- 楽曲データ: [Apple iTunes](https://www.apple.com/itunes/) / [Deezer](https://www.deezer.com)
- AI推論: [Google Gemini](https://ai.google.dev/)
- データベース: [Supabase](https://supabase.com/)
- 動画データ: [YouTube Data API](https://developers.google.com/youtube)
