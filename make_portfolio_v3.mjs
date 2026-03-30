import PptxGenJS from 'pptxgenjs';
import { readFileSync } from 'fs';
import path from 'path';

const pptx = new PptxGenJS();
pptx.layout = 'LAYOUT_WIDE'; // 13.33 x 7.5 inches

// ============================================================
// カラートークン
// ============================================================
const C = {
  bg:       'FFFFFF',
  card:     'EEF2FA',
  panel:    'DDE4F2',
  navy:     '1B3A6B',
  navyMid:  '2D5096',
  navyLine: '4A6FA5',
  textHd:   '111111',
  textBody: '444444',
  textSub:  '888888',
  textWhite:'FFFFFF',
  border:   'C5D0E6',
  youtube:  'CC0000',
};

const F = {
  mincho: 'Yu Mincho',
  gothic: 'Yu Gothic',
  num:    'Calibri',
};

const SS = 'screenshots/mj_final/';
const SS_ROOT = 'screenshots/';
const IMG_RATIO = 1.6;

// ============================================================
// ヘルパー関数
// ============================================================
const TOTAL = 11;

function header(slide, title, pageNum) {
  slide.addShape(pptx.ShapeType.rect, {
    x: 0, y: 0, w: 13.33, h: 0.08,
    fill: { color: C.navy }, line: { type: 'none' },
  });
  slide.addText(pageNum + ' / ' + TOTAL, {
    x: 12.0, y: 0.12, w: 1.1, h: 0.22,
    fontFace: F.gothic, fontSize: 8, color: C.textSub, align: 'right',
  });
  slide.addText(title, {
    x: 0.45, y: 0.15, w: 11.4, h: 0.5,
    fontFace: F.mincho, fontSize: 16, bold: true, color: C.navy, align: 'left',
  });
  slide.addShape(pptx.ShapeType.line, {
    x: 0.45, y: 0.72, w: 12.43, h: 0,
    line: { color: C.navyLine, width: 0.75 },
  });
}

function foot(slide, text) {
  slide.addText(text, {
    x: 0.45, y: 7.2, w: 12.43, h: 0.2,
    fontFace: F.gothic, fontSize: 7.5, italic: true, color: C.textSub,
  });
}

function screenshot(slide, file, x, y, w, dir) {
  const h = w / IMG_RATIO;
  try {
    const data = readFileSync(path.join(dir || SS, file));
    slide.addImage({ data: 'image/png;base64,' + data.toString('base64'), x, y, w, h });
  } catch {
    slide.addShape(pptx.ShapeType.rect, {
      x, y, w, h, fill: { color: C.card }, line: { color: C.border, width: 0.5 },
    });
    slide.addText('(画像なし)', {
      x, y, w, h, fontFace: F.gothic, fontSize: 10, color: C.textSub,
      align: 'center', valign: 'middle',
    });
  }
  return h;
}

function circleBadge(slide, text, x, y, size, fontSize, color) {
  slide.addShape(pptx.ShapeType.ellipse, {
    x, y, w: size, h: size, fill: { color }, line: { type: 'none' },
  });
  slide.addText(text, {
    x, y, w: size, h: size,
    fontFace: F.num, fontSize, bold: true,
    color: C.textWhite, align: 'center', valign: 'middle',
  });
}

function accentCard(slide, x, y, w, h, barColor) {
  slide.addShape(pptx.ShapeType.rect, {
    x, y, w, h, fill: { color: C.card }, line: { color: C.border, width: 0.5 },
  });
  slide.addShape(pptx.ShapeType.rect, {
    x, y, w: 0.1, h, fill: { color: barColor }, line: { type: 'none' },
  });
}

// ============================================================
// スライド 1: タイトル
// ============================================================
{
  const s = pptx.addSlide();
  s.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 13.33, h: 7.5, fill: { color: C.bg }, line: { type: 'none' } });
  s.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 13.33, h: 0.18, fill: { color: C.navy }, line: { type: 'none' } });
  s.addShape(pptx.ShapeType.rect, { x: 9.0, y: 0.18, w: 4.33, h: 7.32, fill: { color: C.card }, line: { type: 'none' } });
  s.addShape(pptx.ShapeType.line, { x: 9.0, y: 0.18, w: 0, h: 7.32, line: { color: C.navyLine, width: 0.75 } });

  s.addText('Ripple', {
    x: 0.6, y: 1.2, w: 7.5, h: 1.3,
    fontFace: F.mincho, fontSize: 60, bold: true, color: C.navy,
  });
  s.addText('Find Your Sound', {
    x: 0.6, y: 2.55, w: 7.5, h: 0.55,
    fontFace: F.gothic, fontSize: 22, color: C.navyMid,
  });
  s.addShape(pptx.ShapeType.line, { x: 0.6, y: 3.25, w: 5.0, h: 0, line: { color: C.navy, width: 1.5 } });
  s.addText('類似曲検索アプリ', {
    x: 0.6, y: 3.45, w: 7.5, h: 0.35,
    fontFace: F.gothic, fontSize: 13, color: C.textSub,
  });

  const tags = ['AI 活用', '完全無料構成', 'フルスタック実装'];
  tags.forEach((t, i) => {
    const x = 0.6 + i * 2.55;
    s.addShape(pptx.ShapeType.rect, { x, y: 4.05, w: 2.3, h: 0.36, fill: { color: C.navy }, line: { type: 'none' } });
    s.addText(t, { x, y: 4.05, w: 2.3, h: 0.36, fontFace: F.gothic, fontSize: 10, bold: true, color: C.textWhite, align: 'center', valign: 'middle' });
  });

  s.addText('https://ripplefm.vercel.app', {
    x: 0.6, y: 4.65, w: 7.5, h: 0.3,
    fontFace: F.gothic, fontSize: 11, color: C.navyMid, underline: true,
  });
  s.addText('https://github.com/KK-0405/Ripple', {
    x: 0.6, y: 5.02, w: 7.5, h: 0.3,
    fontFace: F.gothic, fontSize: 11, color: C.navyMid, underline: true,
  });

  // QRコード
  try {
    const qrData = readFileSync('public/qr_ripple.png');
    s.addImage({ data: 'image/png;base64,' + qrData.toString('base64'), x: 0.6, y: 5.42, w: 1.55, h: 1.55 });
  } catch {}

  // コードメトリクス（日付右横・1行）
  s.addText('6,494行  ·  29ファイル  ·  4コンポーネント  ·  12 APIエンドポイント', {
    x: 3.10, y: 6.9, w: 5.6, h: 0.28,
    fontFace: F.gothic, fontSize: 8.5, color: C.textSub, valign: 'middle',
  });

  s.addText('2026年3月　｜　開発期間：7日', {
    x: 0.6, y: 6.9, w: 4, h: 0.28,
    fontFace: F.gothic, fontSize: 10, color: C.textSub,
  });

  s.addText('概要', { x: 9.25, y: 0.55, w: 3.8, h: 0.38, fontFace: F.mincho, fontSize: 14, bold: true, color: C.navy });
  s.addShape(pptx.ShapeType.line, { x: 9.25, y: 0.98, w: 3.8, h: 0, line: { color: C.navyLine, width: 0.5 } });

  const rightItems = [
    ['対象',     '音楽ファンとDJ'],
    ['機能',     '楽曲検索・AI類似曲提案\nプレイリスト管理\nYouTube Music書き出し（※テストユーザーのみ）'],
    ['技術',     'Next.js / React / TypeScript\nTailwind CSS v4'],
    ['インフラ', 'Vercel (ホスティング)\nSupabase (DB / Auth)'],
    ['AI',       'Google Gemini API\n（類似曲推薦・メタデータ解析）'],
    ['費用',     '月額 ¥0\n（すべて無料枠のみ使用）'],
  ];
  rightItems.forEach(([label, value], i) => {
    const y = 1.2 + i * 1.0;
    s.addText(label, { x: 9.25, y, w: 1.0, h: 0.3, fontFace: F.gothic, fontSize: 9, bold: true, color: C.navy });
    s.addText(value, { x: 10.4, y: y - 0.05, w: 2.7, h: 0.55, fontFace: F.gothic, fontSize: 10, color: C.textBody, wrap: true });
    if (i < rightItems.length - 1) {
      s.addShape(pptx.ShapeType.line, { x: 9.25, y: y + 0.7, w: 3.8, h: 0, line: { color: C.border, width: 0.3 } });
    }
  });
}

// ============================================================
// スライド 2: エグゼクティブサマリー
// ============================================================
{
  const s = pptx.addSlide();
  s.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 13.33, h: 7.5, fill: { color: C.bg }, line: { type: 'none' } });
  header(s, '未経験エンジニアがAIと無料サービスだけで類似曲検索アプリを完成させた', 2);

  s.addText('「曲を1つ入れるだけで似た曲が次々見つかる」── 自分のDJ活動の課題をAI技術で解決した個人開発アプリ。', {
    x: 0.45, y: 0.82, w: 12.43, h: 0.35,
    fontFace: F.gothic, fontSize: 11.5, color: C.textBody,
  });

  // ── カード1: アプリでできること（カスタムレイアウト）──
  {
    const x = 0.45; const cardW = 4.05;
    s.addShape(pptx.ShapeType.rect, { x, y: 1.28, w: cardW, h: 5.9, fill: { color: C.card }, line: { color: C.border, width: 0.5 } });
    s.addShape(pptx.ShapeType.rect, { x, y: 1.28, w: cardW, h: 0.08, fill: { color: C.navy }, line: { type: 'none' } });
    circleBadge(s, '機能', x + 0.2, 1.42, 0.52, 10, C.navy);
    s.addText('アプリでできること', { x: x + 0.85, y: 1.44, w: cardW - 1.0, h: 0.45, fontFace: F.mincho, fontSize: 14, bold: true, color: C.navy });
    s.addShape(pptx.ShapeType.line, { x: x + 0.15, y: 2.02, w: cardW - 0.3, h: 0, line: { color: C.border, width: 0.5 } });

    // 主要機能セクション
    s.addText('主要機能', { x: x + 0.15, y: 2.1, w: cardW - 0.3, h: 0.25, fontFace: F.gothic, fontSize: 9, bold: true, color: C.navyMid });
    const mainFeatures = [
      '楽曲検索 ＆ プレビュー再生',
      'AIによる類似曲提案（最大30曲）',
      'プレイリスト作成・保存・管理',
      'YouTube Musicライブラリへ書き出し（※OAuth審査待ち・現在はテストユーザーのみ）',
    ];
    mainFeatures.forEach((f, i) => {
      s.addText(`▸  ${f}`, { x: x + 0.2, y: 2.38 + i * 0.38, w: cardW - 0.35, h: 0.35, fontFace: F.gothic, fontSize: 10.5, color: C.textBody, wrap: true });
    });

    // その他できること セクション
    s.addShape(pptx.ShapeType.line, { x: x + 0.15, y: 3.92, w: cardW - 0.3, h: 0, line: { color: C.border, width: 0.3 } });
    s.addText('その他できること', { x: x + 0.15, y: 4.0, w: cardW - 0.3, h: 0.25, fontFace: F.gothic, fontSize: 9, bold: true, color: C.navyMid });
    const otherFeatures = [
      'AIによる選曲理由の表示',
      'サブシード設定で複数曲から絞り込み提案',
      'BPM・キー・ジャンル・年代フィルター',
      'YouTubeリンク ＆ 再生数表示',
      'ドラッグ&ドロップで曲順変更',
      '検索履歴の保存・復元',
      'プレイリストの公開 / 非公開設定',
      'ダークモード / PWA（インストール対応）',
    ];
    otherFeatures.forEach((f, i) => {
      s.addText(`·  ${f}`, { x: x + 0.2, y: 4.28 + i * 0.33, w: cardW - 0.35, h: 0.3, fontFace: F.gothic, fontSize: 10, color: C.textBody, wrap: true });
    });
  }

  // ── カード2（完全無料 × フルスタック独学、マージ版）──
  {
    const x = 0.45 + 4.27;   // = 4.72（カード1の直後）
    const cardW = 8.32;       // 右端 13.04 まで
    const innerX = x + 0.15;
    const innerW = cardW - 0.3; // = 8.02

    s.addShape(pptx.ShapeType.rect, { x, y: 1.28, w: cardW, h: 5.9, fill: { color: C.card }, line: { color: C.border, width: 0.5 } });
    s.addShape(pptx.ShapeType.rect, { x, y: 1.28, w: cardW, h: 0.08, fill: { color: C.navy }, line: { type: 'none' } });
    circleBadge(s, '¥0', x + 0.2, 1.42, 0.52, 11, C.navy);
    s.addText('完全無料 × フルスタック独学', { x: x + 0.85, y: 1.44, w: cardW - 1.0, h: 0.45, fontFace: F.mincho, fontSize: 14, bold: true, color: C.navy });
    s.addShape(pptx.ShapeType.line, { x: innerX, y: 2.02, w: innerW, h: 0, line: { color: C.border, width: 0.5 } });

    s.addText('Next.js から API・DB 設計・Vercel デプロイまで一気通貫で独学実装。Claude Code（AI）で仕様〜デバッグを効率化し、下記 6 サービスをすべて ¥0 で組み合わせ本番リリース。', {
      x: innerX, y: 2.12, w: innerW, h: 0.65,
      fontFace: F.gothic, fontSize: 10.5, color: C.textBody, wrap: true,
    });

    // 6 サービス一覧テーブル（スライド8の内容を要約）
    const svcRows = [
      ['Vercel',           'ホスティング',             'Hobby（無料）',                'Next.js デプロイ・CDN 配信'],
      ['Supabase',         'DB / 認証',                'Free（500MB・Auth 無制限）',    'プレイリスト・キャッシュ・ユーザー管理'],
      ['Google Gemini',    'AI エンジン',              '無料枠',                       '類似曲レコメンド・BPM / キー解析'],
      ['iTunes API',       '楽曲検索・メタデータ',     '完全無料（Apple 公式）',        'メイン検索・アルバムアート取得'],
      ['Deezer API',       'BPM 補完・プレビュー補完', '無料（商用利用可）',            'BPM 取得・プレビューフォールバック'],
      ['YouTube Data API', '動画・書き出し',           '無料クォータ（10,000 u/日）',  'プレイリスト書き出し・動画 ID 検索'],
    ];
    const svcColW = [1.55, 1.75, 2.0, 2.72]; // 合計 8.02
    const svcTbl = [
      ['サービス', '用途', 'プラン / 無料枠', '主な役割'].map(h => ({
        text: h,
        options: { fill: C.navy, color: C.textWhite, fontFace: F.gothic, fontSize: 9.5, bold: true, border: { type: 'solid', color: C.border, pt: 0.5 }, align: 'center', valign: 'middle' },
      })),
      ...svcRows.map((row, ri) => row.map((cell, ci) => ({
        text: cell,
        options: { fill: ri % 2 === 0 ? C.card : C.bg, color: ci === 0 ? C.navy : C.textBody, fontFace: ci === 0 ? F.mincho : F.gothic, fontSize: 9.5, bold: ci === 0, border: { type: 'solid', color: C.border, pt: 0.5 }, valign: 'middle' },
      }))),
    ];
    s.addTable(svcTbl, { x: innerX, y: 2.85, w: innerW, colW: svcColW, rowH: 0.44 });
    // テーブル下端 = 2.85 + 7 * 0.44 = 5.93

    // 2 つのメトリクス（¥0 / 6）
    const metW = (innerW - 0.2) / 2; // = 3.91
    [['¥0', '月額費用', 0], ['6', '連携外部サービス数', metW + 0.2]].forEach(([num, unit, offset]) => {
      s.addShape(pptx.ShapeType.rect, { x: innerX + offset, y: 6.05, w: metW, h: 1.05, fill: { color: C.bg }, line: { color: C.border, width: 0.5 } });
      s.addShape(pptx.ShapeType.line, { x: innerX + offset, y: 6.05, w: metW, h: 0, line: { color: C.navyLine, width: 1.0 } });
      s.addText(num, { x: innerX + offset, y: 6.12, w: metW, h: 0.62, fontFace: F.num, fontSize: 30, bold: true, color: C.navy, align: 'center' });
      s.addText(unit, { x: innerX + offset, y: 6.78, w: metW, h: 0.28, fontFace: F.gothic, fontSize: 9.5, color: C.textSub, align: 'center' });
    });
  }
}

// ============================================================
// スライド 3: 開発背景
// ============================================================
{
  const s = pptx.addSlide();
  s.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 13.33, h: 7.5, fill: { color: C.bg }, line: { type: 'none' } });
  header(s, '既存の音楽サービスにできない「条件付き類似曲検索」への不満が、Ripple 開発の出発点だった', 3);

  const steps = [
    { num: '01', label: '課題', title: '既存サービスへの不満', body: '他の音楽サービスの類似曲おすすめ機能は条件を細かく指定できなかった。趣味のDJで曲を探す際に、BPM・キー・ジャンル・雰囲気を自分で組み合わせて検索できるサービスがなく手間だった。' },
    { num: '02', label: '動機', title: 'Claude Code × フルスタック実践への挑戦', body: '話題となっていた新技術 Claude Code を実際のプロダクト開発で試してみたかった。\n\nまた、授業でフロントエンドからバックエンド・DB 設計まで体系的に学んでいたので、その知識を活かして 1 から本番アプリをフルスタックで自分の手で作り切ってみたいと考えた。' },
    { num: '03', label: '実行', title: '完全無料で本番アプリを構築', body: '「すべて無料のサービスだけで、実際に使えるアプリを作る」という制約を自分に課し、Next.js + Gemini + Supabase で実装。Vercel で公開した。' },
    { num: '04', label: '成果', title: 'AI が選曲理由付きで提案', body: 'Billie Jean（Michael Jackson）を入れると、同じグルーヴ感・BPM・エネルギーを持つ曲が選曲理由テキスト付きで最大30曲提案される。追加検索も可能。' },
  ];

  steps.forEach(({ num, label, title, body }, i) => {
    const x = 0.45 + i * 3.2;
    const cardW = 3.0;
    s.addShape(pptx.ShapeType.rect, { x, y: 1.28, w: cardW, h: 5.9, fill: { color: C.card }, line: { color: C.border, width: 0.5 } });
    s.addShape(pptx.ShapeType.rect, { x, y: 1.28, w: cardW, h: 0.08, fill: { color: C.navy }, line: { type: 'none' } });
    circleBadge(s, num, x + 0.18, 1.45, 0.48, 13, C.navy);
    s.addText(label, { x: x + 0.78, y: 1.5, w: cardW - 0.9, h: 0.3, fontFace: F.gothic, fontSize: 10, bold: true, color: C.textSub });
    s.addShape(pptx.ShapeType.line, { x: x + 0.15, y: 2.05, w: cardW - 0.3, h: 0, line: { color: C.border, width: 0.5 } });
    s.addText(title, { x: x + 0.15, y: 2.15, w: cardW - 0.3, h: 0.75, fontFace: F.mincho, fontSize: 13, bold: true, color: C.navy, wrap: true });
    s.addText(body, { x: x + 0.15, y: 3.0, w: cardW - 0.3, h: 3.8, fontFace: F.gothic, fontSize: 10.5, color: C.textBody, wrap: true });
    if (i < 3) {
      s.addShape(pptx.ShapeType.line, { x: x + cardW + 0.05, y: 4.28, w: 0.15, h: 0, line: { color: C.navyLine, width: 1.5 } });
      s.addText('▶', { x: x + cardW + 0.1, y: 4.15, w: 0.2, h: 0.28, fontSize: 10, color: C.navyLine, align: 'center' });
    }
  });

}

// ============================================================
// スライド 4: Claude Code × VS Code × CLAUDE.md（新規）
// ============================================================
{
  const s = pptx.addSlide();
  s.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 13.33, h: 7.5, fill: { color: C.bg }, line: { type: 'none' } });
  header(s, 'Claude Code × VS Code × CLAUDE.md ── AI支援開発で品質と速度を両立', 4);

  // ── 左カラム: Claude Code ──
  const LX = 0.45, LW = 5.88, CARD_TOP = 1.0, CARD_H = 5.32;
  accentCard(s, LX, CARD_TOP, LW, CARD_H, C.navy);

  s.addText('Claude Code on VS Code', {
    x: LX + 0.22, y: CARD_TOP + 0.1, w: LW - 0.3, h: 0.38,
    fontFace: F.mincho, fontSize: 13, bold: true, color: C.navy,
  });
  s.addShape(pptx.ShapeType.line, {
    x: LX + 0.22, y: CARD_TOP + 0.52, w: LW - 0.44, h: 0,
    line: { color: C.navyLine, width: 0.5 },
  });
  s.addText('Anthropic 公式の AI コーディングエージェントを VS Code 上で使用。ファイル読み書き・コマンド実行・ウェブ検索を組み合わせ、複数ステップのタスクを自律処理する。', {
    x: LX + 0.22, y: CARD_TOP + 0.6, w: LW - 0.3, h: 0.62,
    fontFace: F.gothic, fontSize: 10, color: C.textBody, wrap: true,
  });

  const leftItems = [
    { title: '自律コーディング', body: 'プロンプト指示だけで複数ファイルへの変更・テスト実行・デプロイ指示まで一連の作業を処理した' },
    { title: 'プロジェクト全体を把握', body: 'ファイル構造とコードをすべて理解した上で一貫性のある変更を加えるため、コンテキストのずれがない' },
    { title: 'CLAUDE.md を起点に作業開始', body: 'プロジェクト固有の指示ファイルを毎回参照することで、会話をまたいでも設計方針が引き継がれる' },
  ];

  // 3項目 × slotH=1.33 → 4.00 をちょうど埋める
  leftItems.forEach(({ title, body }, i) => {
    const y = CARD_TOP + 1.32 + i * 1.33;
    s.addShape(pptx.ShapeType.rect, {
      x: LX + 0.22, y, w: LW - 0.3, h: 0.08,
      fill: { color: C.navy }, line: { type: 'none' },
    });
    s.addText('▸ ' + title, {
      x: LX + 0.22, y: y + 0.14, w: LW - 0.3, h: 0.30,
      fontFace: F.gothic, fontSize: 11, bold: true, color: C.navy,
    });
    s.addText(body, {
      x: LX + 0.22, y: y + 0.48, w: LW - 0.3, h: 0.60,
      fontFace: F.gothic, fontSize: 10.5, color: C.textBody, wrap: true,
    });
  });

  // ── 右カラム: CLAUDE.md ──
  const RX = 6.55, RW = 6.53;
  accentCard(s, RX, CARD_TOP, RW, CARD_H, C.navyMid);

  s.addText('CLAUDE.md ── 設計仕様の言語化', {
    x: RX + 0.22, y: CARD_TOP + 0.1, w: RW - 0.3, h: 0.38,
    fontFace: F.mincho, fontSize: 13, bold: true, color: C.navy,
  });
  s.addShape(pptx.ShapeType.line, {
    x: RX + 0.22, y: CARD_TOP + 0.52, w: RW - 0.44, h: 0,
    line: { color: C.navyLine, width: 0.5 },
  });
  s.addText('UI生成の品質を一定に保つため、デザインシステム仕様・ブランド定義・禁止パターンをアプリ専用の CLAUDE.md に記述。Claude Code は毎回このファイルを参照してから作業を開始する。', {
    x: RX + 0.22, y: CARD_TOP + 0.6, w: RW - 0.3, h: 0.62,
    fontFace: F.gothic, fontSize: 10, color: C.textBody, wrap: true,
  });

  // 3項目 × slotH=1.33 → 4.00 をちょうど埋める
  const rightItems = [
    { title: '設計原則 5 つ', body: 'Layered / Contrast / Semantic / Minimal / Grid の原則を全コンポーネントに一律適用' },
    { title: 'コンポーネント仕様 28 個', body: 'ボタン・カード・モーダルなど 28 種類のTailwindクラスをすべて事前定義' },
    { title: '禁止パターン 76 項目', body: 'text-black・shadow-lg など一貫性を崩すクラスを明示的に列挙して禁止' },
  ];

  rightItems.forEach(({ title, body }, i) => {
    const y = CARD_TOP + 1.32 + i * 1.33;
    s.addShape(pptx.ShapeType.rect, {
      x: RX + 0.22, y, w: RW - 0.3, h: 0.08,
      fill: { color: C.navyMid }, line: { type: 'none' },
    });
    s.addText('▸ ' + title, {
      x: RX + 0.22, y: y + 0.14, w: RW - 0.3, h: 0.30,
      fontFace: F.gothic, fontSize: 11, bold: true, color: C.navy,
    });
    s.addText(body, {
      x: RX + 0.22, y: y + 0.48, w: RW - 0.3, h: 0.60,
      fontFace: F.gothic, fontSize: 10.5, color: C.textBody, wrap: true,
    });
  });

  // ── ボトムバー ──
  s.addShape(pptx.ShapeType.rect, {
    x: 0.45, y: 6.48, w: 12.43, h: 0.48,
    fill: { color: C.panel }, line: { color: C.navyLine, width: 0.5 },
  });
  s.addText('「設計意図をMDに書く → Claude Code が毎回参照 → 一貫したUIを継続生成」のループを確立。会話をまたいでも品質が落ちない開発フローを実現した。', {
    x: 0.6, y: 6.48, w: 12.1, h: 0.48,
    fontFace: F.gothic, fontSize: 10.5, bold: true, color: C.navy, align: 'center', valign: 'middle', wrap: true,
  });
}

// ============================================================
// スライド 5: Seed設定後の絞り込み条件 + AI直接指示
// ============================================================
{
  const s = pptx.addSlide();
  s.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 13.33, h: 7.5, fill: { color: C.bg }, line: { type: 'none' } });
  header(s, 'Seed 設定後に 7 種の絞り込み条件と AI への自由テキスト指示で探索を精密に制御できる', 5);

  // ── 左カラム ──
  // スクリーンショット: sw=5.8, sh=3.625, 底 y=4.475
  const sw = 5.8, sh = sw / IMG_RATIO; // sh=3.625
  const SS_TOP = 0.85;
  screenshot(s, '03_seed.png', 0.45, SS_TOP, sw);
  s.addShape(pptx.ShapeType.rect, { x: 0.45, y: SS_TOP, w: sw, h: sh, fill: { type: 'none' }, line: { color: C.border, width: 0.5 } });
  // ss底 = 0.85+3.625 = 4.475

  // Gemini解析カード: y=4.625, h=7.25-4.625=2.625
  const GY = SS_TOP + sh + 0.15; // 4.625
  const GH = 7.25 - GY;          // 2.625
  s.addShape(pptx.ShapeType.rect, { x: 0.45, y: GY, w: sw, h: GH, fill: { color: C.card }, line: { color: C.navyLine, width: 0.8 } });
  s.addShape(pptx.ShapeType.rect, { x: 0.45, y: GY, w: sw, h: 0.08, fill: { color: C.navyMid }, line: { type: 'none' } });
  s.addText('メインSeed選択後 — Gemini が自動解析する項目', {
    x: 0.60, y: GY+0.12, w: sw-0.25, h: 0.28,
    fontFace: F.mincho, fontSize: 11, bold: true, color: C.navy,
  });
  s.addShape(pptx.ShapeType.line, { x: 0.60, y: GY+0.44, w: sw-0.30, h: 0, line: { color: C.border, width: 0.5 } });

  const geminiItems = [
    ['BPM', 'テンポ（例: 117 BPM）'],
    ['Camelot キー', '音楽的調性（例: 11A = D minor）'],
    ['Energy', 'エネルギー値 0〜1（例: 0.8）'],
    ['ジャンルタグ', '複数タグを自動付与（例: Funk / Soul）'],
    ['リリース年代', '年を特定（例: 1982年）'],
    ['ボーカル有無', 'インスト / ボーカルを判定'],
  ];
  const gItemH = (GH - 0.55) / geminiItems.length - 0.03;
  geminiItems.forEach(([key, val], i) => {
    const gy = GY + 0.52 + i * (gItemH + 0.03);
    s.addText(key, { x: 0.62, y: gy, w: 1.30, h: gItemH, fontFace: F.gothic, fontSize: 9.5, bold: true, color: C.navy, valign: 'middle' });
    s.addShape(pptx.ShapeType.line, { x: 1.96, y: gy+0.04, w: 0, h: gItemH-0.08, line: { color: C.border, width: 0.4 } });
    s.addText(val, { x: 2.05, y: gy, w: sw-1.72, h: gItemH, fontFace: F.gothic, fontSize: 9.5, color: C.textBody, valign: 'middle' });
  });
  s.addShape(pptx.ShapeType.rect, { x: 0.45, y: GY+GH-0.30, w: sw, h: 0.30, fill: { color: C.panel }, line: { type: 'none' } });
  s.addText('これらの解析値が各絞り込み条件の基準となる', {
    x: 0.60, y: GY+GH-0.28, w: sw-0.25, h: 0.26,
    fontFace: F.gothic, fontSize: 9, bold: true, color: C.navyMid, valign: 'middle',
  });

  // ── 右カラム ──
  // RX=6.50, RW=6.58, 利用可能高さ=6.40
  const RX = 0.45 + sw + 0.25; // 6.50
  const RW = 13.33 - RX - 0.20; // 6.63

  // フィルターカード: h = 0.52 + 7*(0.44+0.04) - 0.04 = 0.52 + 3.32 = 3.84
  // フィルター8個: fItemH=0.40, fGap=0.04
  // filterCardH = 0.52 + 8*(0.40+0.04) - 0.04 = 4.00  底 y=4.85
  // AIカード: y=5.00, h=2.25
  const fItemH = 0.40, fGap = 0.04;
  const filters = [
    { label: 'BPM 範囲',        desc: '制限なし / ±5 / ±10 から選択' },
    { label: 'キー',             desc: '同じキー or Camelot 隣接（±1）' },
    { label: 'ジャンル',         desc: 'Seed の genre_tags から複数選択可' },
    { label: 'エネルギー',       desc: '高 / 中 / 低 の 3 段階' },
    { label: 'アーティスト',     desc: '同じアーティストを含む / 除外' },
    { label: '年代',             desc: '10 年ごと（70s / 80s …）＋ 2025・2026 年も選択可' },
    { label: 'プレイリスト除外', desc: 'すでにリストにある曲を除く' },
    { label: '有名曲を除外',     desc: '定番・アンセム曲を除いてマイナー曲を優先' },
  ];
  const filterCardH = 0.52 + filters.length * (fItemH + fGap) - fGap; // 4.00
  s.addShape(pptx.ShapeType.rect, { x: RX, y: 0.85, w: RW, h: filterCardH, fill: { color: C.card }, line: { color: C.border, width: 0.5 } });
  s.addShape(pptx.ShapeType.rect, { x: RX, y: 0.85, w: RW, h: 0.08, fill: { color: C.navy }, line: { type: 'none' } });
  s.addText('絞り込み条件（8種類）', { x: RX+0.15, y: 0.96, w: RW-0.25, h: 0.28, fontFace: F.mincho, fontSize: 12, bold: true, color: C.navy });
  s.addShape(pptx.ShapeType.line, { x: RX+0.15, y: 1.28, w: RW-0.30, h: 0, line: { color: C.border, width: 0.5 } });

  filters.forEach(({ label, desc }, i) => {
    const fy = 1.37 + i * (fItemH + fGap);
    if (i % 2 === 0) s.addShape(pptx.ShapeType.rect, { x: RX+0.10, y: fy, w: RW-0.20, h: fItemH, fill: { color: C.panel }, line: { type: 'none' } });
    circleBadge(s, String(i+1), RX+0.14, fy+(fItemH-0.26)/2, 0.26, 7.5, C.navy);
    s.addText(label, { x: RX+0.48, y: fy+0.03, w: 1.22, h: fItemH-0.06, fontFace: F.gothic, fontSize: 9, bold: true, color: C.navy, valign: 'middle' });
    s.addShape(pptx.ShapeType.line, { x: RX+1.74, y: fy+0.05, w: 0, h: fItemH-0.10, line: { color: C.border, width: 0.4 } });
    s.addText(desc, { x: RX+1.84, y: fy+0.03, w: RW-1.98, h: fItemH-0.06, fontFace: F.gothic, fontSize: 9, color: C.textBody, valign: 'middle', wrap: true });
  });

  // AIカード: y=0.85+4.00+0.15=5.00, h=7.25-5.00=2.25
  const aiY = 0.85 + filterCardH + 0.15; // 5.00
  const aiH = 7.25 - aiY;                // 2.25
  s.addShape(pptx.ShapeType.rect, { x: RX, y: aiY, w: RW, h: aiH, fill: { color: C.card }, line: { color: C.navyLine, width: 0.8 } });
  s.addShape(pptx.ShapeType.rect, { x: RX, y: aiY, w: RW, h: 0.08, fill: { color: C.navyMid }, line: { type: 'none' } });
  s.addText('AI への検索指示（自由テキスト）', { x: RX+0.15, y: aiY+0.12, w: RW-0.25, h: 0.28, fontFace: F.mincho, fontSize: 11.5, bold: true, color: C.navy });
  s.addShape(pptx.ShapeType.line, { x: RX+0.15, y: aiY+0.44, w: RW-0.30, h: 0, line: { color: C.border, width: 0.5 } });
  s.addText('フィルターで表現できないニュアンスを自然言語で Gemini に直接指示できる。', {
    x: RX+0.15, y: aiY+0.50, w: RW-0.25, h: 0.32,
    fontFace: F.gothic, fontSize: 9.5, color: C.textBody, wrap: true,
  });
  // 例文リスト（白ボックス）
  const exBoxY = aiY + 0.86;
  const exBoxH = aiH - 0.98;
  s.addShape(pptx.ShapeType.rect, { x: RX+0.15, y: exBoxY, w: RW-0.30, h: exBoxH, fill: { color: C.bg }, line: { color: C.border, width: 0.5 } });
  const examples = ['アニソン以外', 'インスト曲のみ', 'グラミー賞受賞曲のみ', 'ビルボード TOP 10 入りした曲を優先して'];
  const exItemH = (exBoxH - 0.14) / examples.length;
  examples.forEach((ex, i) => {
    const ey = exBoxY + 0.07 + i * exItemH;
    s.addText('·  ' + ex, {
      x: RX+0.28, y: ey, w: RW-0.55, h: exItemH,
      fontFace: F.gothic, fontSize: 10.5, color: C.textSub, valign: 'middle',
    });
  });
}

// ============================================================
// スライド 6: AI 類似曲探索結果
// ============================================================
{
  const s = pptx.addSlide();
  s.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 13.33, h: 7.5, fill: { color: C.bg }, line: { type: 'none' } });
  header(s, 'Gemini AI が Billie Jean に合う曲を選曲理由付きでリアルタイム提案', 6);

  const sw = 7.85, sh = sw / IMG_RATIO;
  screenshot(s, '04_similar.png', 0.45, 0.85, sw);
  s.addShape(pptx.ShapeType.rect, { x: 0.45, y: 0.85, w: sw, h: sh, fill: { type: 'none' }, line: { color: C.border, width: 0.5 } });

  const panelX = 0.45 + sw + 0.25;
  const panelW = 13.33 - panelX - 0.25;

  const points = [
    { title: '各曲に表示される情報', body: '曲名・アーティスト・アルバム名・発売年・YouTube 再生数・キー・BPM・メインシードと関係するジャンル・AI による選曲理由をまとめて表示。DJ ミックスに必要な情報をすべて一画面で確認できる。' },
    { title: '探索履歴に自動保存', body: '左パネルの HISTORY に探索結果が自動記録される。最大20件保存し、過去の探索を再閲覧・再利用できる。' },
    { title: 'プレイリストへ追加・保存', body: '個別追加または「全曲を一括追加」でプレイリストに登録。保存したプレイリストはログイン後も永続的に管理・編集できる。' },
    { title: 'YouTube Music へ書き出し', body: 'プレイリストを YouTube Music のライブラリへ自動書き出し。YouTube Data API でプレイリスト作成・曲追加まで一括処理。（※ OAuth 審査待ち・現在はテストユーザーのみ）' },
  ];

  const pageBottom = 7.25;
  const totalPanelH = pageBottom - 0.85;
  const gap = 0.08;
  const itemH = (totalPanelH - gap * (points.length - 1)) / points.length;
  points.forEach(({ title, body }, i) => {
    const y = 0.85 + i * (itemH + gap);
    accentCard(s, panelX, y, panelW, itemH, C.navy);
    s.addText(title, { x: panelX + 0.22, y: y + 0.08, w: panelW - 0.3, h: 0.30, fontFace: F.mincho, fontSize: 11, bold: true, color: C.navy });
    s.addText(body, { x: panelX + 0.22, y: y + 0.40, w: panelW - 0.3, h: itemH - 0.48, fontFace: F.gothic, fontSize: 9.5, color: C.textBody, wrap: true });
  });

}

// ============================================================
// スライド 7: 曲の詳細パネル
// ============================================================
{
  const s = pptx.addSlide();
  s.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 13.33, h: 7.5, fill: { color: C.bg }, line: { type: 'none' } });
  header(s, '類似曲の詳細パネル ── BPM・キー・AI選曲理由を一画面で確認', 7);

  const sw = 7.5, sh = sw / IMG_RATIO;
  screenshot(s, 'similar_detail.png', 0.45, 0.85, sw, SS_ROOT);
  s.addShape(pptx.ShapeType.rect, { x: 0.45, y: 0.85, w: sw, h: sh, fill: { type: 'none' }, line: { color: C.border, width: 0.5 } });

  const panelX = 0.45 + sw + 0.22;
  const panelW = 13.33 - panelX - 0.22;

  const annotations = [
    { title: 'トラック基本情報', body: '曲名・アーティスト・アルバム・リリース年を表示。ボーカルの有無を Gemini AI が判定しバッジで表示。' },
    { title: 'BPM / KEY / ENERGY', body: 'BPM 125 / KEY 7A（Camelot）＝ D minor / ENERGY 85%。Gemini が自動推定し、エネルギーはバーグラフで視覚化。' },
    { title: 'ジャンルタグ', body: '「Disco」「Funk」「Soul」「Boogie」のジャンルタグ。Gemini が楽曲を分析して自動付与する。' },
    { title: 'AI 選曲の理由', body: '「なぜこの曲が選ばれたか」を Gemini が日本語で説明。Seed 曲との音楽的共通点（ベースライン・グルーヴ・時代感など）を具体的に記述。' },
    { title: '再生数 & YouTube', body: 'Deezer から取得した再生数統計と「YouTube で見る」ボタン。クリックで公式 MV に遷移。' },
  ];

  const pageBottom = 7.25;
  const totalPanelH = pageBottom - 0.85;
  const gap = 0.08;
  const itemH = (totalPanelH - gap * (annotations.length - 1)) / annotations.length;

  annotations.forEach(({ title, body }, i) => {
    const y = 0.85 + i * (itemH + gap);
    accentCard(s, panelX, y, panelW, itemH, C.navy);
    s.addText(title, { x: panelX + 0.22, y: y + 0.08, w: panelW - 0.3, h: 0.30, fontFace: F.mincho, fontSize: 10.5, bold: true, color: C.navy });
    s.addText(body, { x: panelX + 0.22, y: y + 0.40, w: panelW - 0.3, h: itemH - 0.48, fontFace: F.gothic, fontSize: 9.5, color: C.textBody, wrap: true });
  });

}



// ============================================================
// スライド 8: アーキテクチャ図
// ============================================================
{
  const s = pptx.addSlide();
  s.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 13.33, h: 7.5, fill: { color: C.bg }, line: { type: 'none' } });
  header(s, 'アプリケーションアーキテクチャ ── Next.js（Vercel）× 5 外部サービス', 8);

  // ── ブラウザ ──
  s.addShape(pptx.ShapeType.rect, { x: 0.25, y: 2.90, w: 1.92, h: 1.60, fill: { color: C.panel }, line: { color: C.navyLine, width: 0.8 } });
  s.addText('ユーザー', { x: 0.25, y: 3.10, w: 1.92, h: 0.32, fontFace: F.mincho, fontSize: 12, bold: true, color: C.navy, align: 'center' });
  s.addText('ブラウザ', { x: 0.25, y: 3.44, w: 1.92, h: 0.28, fontFace: F.gothic, fontSize: 10, color: C.textBody, align: 'center' });

  // ブラウザ → Next.js 矢印
  s.addShape(pptx.ShapeType.line, { x: 2.17, y: 3.70, w: 0.25, h: 0, line: { color: C.navyLine, width: 1.2 } });
  s.addText('▶', { x: 2.30, y: 3.57, w: 0.22, h: 0.24, fontFace: F.gothic, fontSize: 9, color: C.navyLine, align: 'center' });

  // ── Next.js / Vercel ──
  const NX = 2.48, NY = 0.88, NW = 5.02, NH = 6.22;
  s.addShape(pptx.ShapeType.rect, { x: NX, y: NY, w: NW, h: NH, fill: { color: C.card }, line: { color: C.navyMid, width: 1.2 } });
  s.addShape(pptx.ShapeType.rect, { x: NX, y: NY, w: NW, h: 0.42, fill: { color: C.navy }, line: { type: 'none' } });
  s.addText('Next.js  /  Vercel', { x: NX + 0.15, y: NY + 0.05, w: NW - 0.30, h: 0.32, fontFace: F.mincho, fontSize: 13, bold: true, color: C.textWhite, align: 'center' });

  // App Router ボックス
  const ARY = NY + 0.52, ARH = 1.72;
  s.addShape(pptx.ShapeType.rect, { x: NX + 0.22, y: ARY, w: NW - 0.44, h: ARH, fill: { color: C.bg }, line: { color: C.border, width: 0.6 } });
  s.addShape(pptx.ShapeType.rect, { x: NX + 0.22, y: ARY, w: NW - 0.44, h: 0.06, fill: { color: C.navyMid }, line: { type: 'none' } });
  s.addText('App Router  ──  UI 層', { x: NX + 0.38, y: ARY + 0.12, w: NW - 0.76, h: 0.30, fontFace: F.mincho, fontSize: 11, bold: true, color: C.navy });
  s.addText('· React Server / Client Components（画面描画・インタラクション）\n· ページルーティング / レイアウト管理\n· PWA 対応 / レスポンシブ UI', {
    x: NX + 0.38, y: ARY + 0.50, w: NW - 0.76, h: 1.10,
    fontFace: F.gothic, fontSize: 9.5, color: C.textBody, wrap: true,
  });

  // ↓ 矢印（App Router → API Routes）
  s.addShape(pptx.ShapeType.line, { x: NX + NW / 2, y: ARY + ARH + 0.04, w: 0, h: 0.18, line: { color: C.navyLine, width: 1.0 } });
  s.addText('▼', { x: NX + NW / 2 - 0.12, y: ARY + ARH + 0.16, w: 0.24, h: 0.20, fontFace: F.gothic, fontSize: 8, color: C.navyLine, align: 'center' });

  // API Routes ボックス
  const APIY = ARY + ARH + 0.44, APIH = NY + NH - APIY - 0.12;
  s.addShape(pptx.ShapeType.rect, { x: NX + 0.22, y: APIY, w: NW - 0.44, h: APIH, fill: { color: C.bg }, line: { color: C.border, width: 0.6 } });
  s.addShape(pptx.ShapeType.rect, { x: NX + 0.22, y: APIY, w: NW - 0.44, h: 0.06, fill: { color: C.navyMid }, line: { type: 'none' } });
  s.addText('API Routes  ──  サーバー層', { x: NX + 0.38, y: APIY + 0.12, w: NW - 0.76, h: 0.30, fontFace: F.mincho, fontSize: 11, bold: true, color: C.navy });

  const routeItems = [
    ['Gemini AI',     '類似曲探索・BPM / キー解析・絞り込みフィルター'],
    ['iTunes API',    '楽曲検索・アルバムアート取得'],
    ['Deezer API',    'BPM 補完・プレビュー URL フォールバック'],
    ['YouTube API',   '再生数取得・プレイリスト書き出し'],
    ['Supabase',      'プレイリスト保存・読み込み・ユーザー認証'],
  ];
  routeItems.forEach(([svc, desc], i) => {
    const ry = APIY + 0.52 + i * 0.62;
    s.addShape(pptx.ShapeType.rect, { x: NX + 0.38, y: ry, w: 1.22, h: 0.24, fill: { color: C.navyMid }, line: { type: 'none' } });
    s.addText(svc, { x: NX + 0.38, y: ry, w: 1.22, h: 0.24, fontFace: F.gothic, fontSize: 8.5, bold: true, color: C.textWhite, align: 'center', valign: 'middle' });
    s.addText('→  ' + desc, { x: NX + 1.68, y: ry, w: NW - 1.90, h: 0.24, fontFace: F.gothic, fontSize: 9, color: C.textBody, valign: 'middle' });
  });

  // Next.js → サービス群 矢印
  s.addShape(pptx.ShapeType.line, { x: NX + NW + 0.05, y: NY + NH / 2, w: 0.22, h: 0, line: { color: C.navyLine, width: 1.2 } });
  s.addText('▶', { x: NX + NW + 0.16, y: NY + NH / 2 - 0.12, w: 0.22, h: 0.24, fontFace: F.gothic, fontSize: 9, color: C.navyLine, align: 'center' });

  // ── 外部サービス ──
  const SX = NX + NW + 0.44, SW = 13.33 - SX - 0.22;
  const services = [
    { name: 'Google Gemini API', role: 'AI エンジン',          sub: '類似曲推薦・BPM / キー解析',        bar: C.navyMid },
    { name: 'iTunes Search API', role: '楽曲検索・メタデータ', sub: 'メイン検索・アルバムアート取得',     bar: C.navyMid },
    { name: 'Deezer API',        role: 'BPM / プレビュー',     sub: 'BPM 補完・プレビューフォールバック', bar: C.navyMid },
    { name: 'YouTube Data API',  role: '動画・書き出し',        sub: '再生数取得・プレイリスト書き出し',   bar: C.navyMid },
    { name: 'Supabase',          role: 'DB / 認証',             sub: 'プレイリスト保存・ユーザー管理',     bar: C.navy },
  ];
  const SH = (NH - 4 * 0.18) / 5;
  services.forEach(({ name, role, sub, bar }, i) => {
    const sy = NY + i * (SH + 0.18);
    accentCard(s, SX, sy, SW, SH, bar);
    s.addText(name, { x: SX + 0.22, y: sy + 0.14, w: SW - 0.30, h: 0.28, fontFace: F.mincho, fontSize: 11, bold: true, color: C.navy });
    s.addText(role, { x: SX + 0.22, y: sy + 0.44, w: SW - 0.30, h: 0.24, fontFace: F.gothic, fontSize: 9.5, bold: true, color: C.navyMid });
    s.addText(sub,  { x: SX + 0.22, y: sy + 0.70, w: SW - 0.30, h: 0.28, fontFace: F.gothic, fontSize: 9, color: C.textBody });
  });
}

// ============================================================
// スライド 9: ER図
// LX=0.30 LW=3.85 右端=4.15 / MX=4.50 MW=4.70 右端=9.20 / RX=9.55 RW=3.48 右端=13.03
// ============================================================
{
  const s = pptx.addSlide();
  s.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 13.33, h: 7.5, fill: { color: C.bg }, line: { type: 'none' } });
  header(s, 'ER図 (Supabase) ── RLS で行単位アクセス制御', 9);

  const HDR_H = 0.44, ROW_H = 0.42, TOP_Y = 0.92;
  const LX=0.30, LW=3.85, MX=4.50, MW=4.70, RX=9.55, RW=3.48;

  function erTable(slide, x, y, w, tableName, isSystem, rows, colW, typeW, noteW) {
    const totalH = HDR_H + rows.length * ROW_H;
    slide.addShape(pptx.ShapeType.rect, { x, y, w, h: totalH, fill: { color: C.bg }, line: { color: C.navyMid, width: 1 } });
    slide.addShape(pptx.ShapeType.rect, { x, y, w, h: HDR_H, fill: { color: isSystem ? C.navyMid : C.navy }, line: { type: 'none' } });
    slide.addText(tableName, { x: x+0.12, y: y+0.06, w: w-0.16, h: HDR_H-0.10, fontFace: F.mincho, fontSize: 10.5, bold: true, color: '#FFFFFF' });
    rows.forEach(({ pk, fk, col, type, note }, i) => {
      const ry = y + HDR_H + i * ROW_H;
      if (i % 2 === 0) slide.addShape(pptx.ShapeType.rect, { x, y: ry, w, h: ROW_H, fill: { color: C.panel }, line: { type: 'none' } });
      slide.addShape(pptx.ShapeType.line, { x: x+0.02, y: ry, w: w-0.04, h: 0, line: { color: C.border, width: 0.4 } });
      const badge = pk ? 'PK' : fk ? 'FK' : '';
      if (badge) {
        slide.addShape(pptx.ShapeType.rect, { x: x+0.07, y: ry+0.09, w: 0.28, h: 0.22, fill: { color: pk ? C.navy : C.navyMid }, line: { type: 'none' } });
        slide.addText(badge, { x: x+0.07, y: ry+0.09, w: 0.28, h: 0.22, fontFace: F.gothic, fontSize: 6.5, bold: true, color: '#FFFFFF', align: 'center' });
      }
      const cx = x + 0.44;
      slide.addText(col,  { x: cx,             y: ry+0.07, w: colW,  h: ROW_H-0.10, fontFace: F.gothic, fontSize: 9,   bold: !!pk, color: C.navy });
      slide.addText(type, { x: cx+colW,         y: ry+0.07, w: typeW, h: ROW_H-0.10, fontFace: F.gothic, fontSize: 8.5,             color: C.textSub });
      if (note) slide.addText(note, { x: cx+colW+typeW, y: ry+0.07, w: noteW, h: ROW_H-0.10, fontFace: F.gothic, fontSize: 8, color: C.textSub });
    });
    return totalH;
  }

  // auth.users: cx=0.74 col→2.04 type→3.19 note→4.15=右端 ✓
  erTable(s, LX, TOP_Y, LW, 'auth.users  (Supabase 管理)', true, [
    { pk: true,  col: 'id',         type: 'UUID',        note: '' },
    { fk: false, col: 'email',      type: 'text',        note: '' },
    { fk: false, col: 'created_at', type: 'timestamptz', note: '' },
  ], 1.30, 1.15, 0.96);
  // 終端y = 0.92+0.44+3×0.42 = 2.62

  // users: gap=0.28 → y=2.90
  const usersY = TOP_Y + HDR_H + 3*ROW_H + 0.28;
  erTable(s, LX, usersY, LW, 'users  (プロフィール)', false, [
    { pk: true,  col: 'id',         type: 'UUID', note: '= auth.users.id' },
    { fk: false, col: 'user_id',    type: 'text', note: '表示名' },
    { fk: false, col: 'avatar_url', type: 'text', note: '' },
  ], 1.30, 1.15, 0.96);
  // 終端y = 2.90+0.44+3×0.42 = 4.60

  // playlists: cx=4.94 col→6.44 type→7.59 note→9.20=右端 ✓
  erTable(s, MX, TOP_Y, MW, 'playlists', false, [
    { pk: true,  col: 'id',         type: 'UUID',        note: '' },
    { fk: true,  col: 'user_id',    type: 'UUID',        note: '→ auth.users.id' },
    { fk: false, col: 'name',       type: 'text',        note: '' },
    { fk: false, col: 'tracks',     type: 'JSONB',       note: 'Track[] 配列' },
    { fk: false, col: 'user_email', type: 'text',        note: '' },
    { fk: false, col: 'is_public',  type: 'boolean',     note: '' },
    { fk: false, col: 'slug',       type: 'text',        note: '公開URL 8文字' },
    { fk: false, col: 'created_at', type: 'timestamptz', note: '' },
  ], 1.50, 1.15, 1.61);
  // 終端y = 0.92+0.44+8×0.42 = 4.72

  // Track JSONB: jRowH=0.38 高さ=0.44+13×0.38=5.38 終端=6.30 / RLS(6.45)とかぶらない ✓
  const jRowH = 0.38, FW = 1.40, DW = RW - 0.10 - FW - 0.08; // 1.90
  const jrows = [
    { field: 'id',           desc: 'string' },
    { field: 'name',         desc: 'string' },
    { field: 'artists',      desc: '{name}[]' },
    { field: 'album',        desc: '{name, images[]}' },
    { field: 'bpm',          desc: 'number' },
    { field: 'camelot',      desc: 'string  例: 11A' },
    { field: 'energy',       desc: 'number  0〜1' },
    { field: 'is_vocal',     desc: 'boolean' },
    { field: 'genre_tags',   desc: 'string[]' },
    { field: 'release_year', desc: 'number' },
    { field: 'reason',       desc: 'string  AI選曲理由' },
    { field: 'preview',      desc: 'string  Deezer URL' },
    { field: 'url',          desc: 'string  iTunes URL' },
  ];
  const jTotalH = HDR_H + jrows.length * jRowH;
  s.addShape(pptx.ShapeType.rect, { x: RX, y: TOP_Y, w: RW, h: jTotalH, fill: { color: C.bg }, line: { color: C.border, width: 0.8, dashType: 'dash' } });
  s.addShape(pptx.ShapeType.rect, { x: RX, y: TOP_Y, w: RW, h: HDR_H, fill: { color: '#777777' }, line: { type: 'none' } });
  s.addText('Track  (JSONB — テーブルなし)', { x: RX+0.10, y: TOP_Y+0.06, w: RW-0.14, h: HDR_H-0.10, fontFace: F.mincho, fontSize: 9.5, bold: true, color: '#FFFFFF' });
  s.addShape(pptx.ShapeType.line, { x: RX+0.10+FW, y: TOP_Y+HDR_H, w: 0, h: jrows.length*jRowH, line: { color: C.border, width: 0.4 } });
  jrows.forEach(({ field, desc }, i) => {
    const ry = TOP_Y + HDR_H + i * jRowH;
    if (i % 2 === 0) s.addShape(pptx.ShapeType.rect, { x: RX, y: ry, w: RW, h: jRowH, fill: { color: C.panel }, line: { type: 'none' } });
    s.addShape(pptx.ShapeType.line, { x: RX+0.02, y: ry, w: RW-0.04, h: 0, line: { color: C.border, width: 0.3 } });
    s.addText(field, { x: RX+0.10,        y: ry+0.06, w: FW,  h: jRowH-0.08, fontFace: F.gothic, fontSize: 8.5, color: C.navy });
    s.addText(desc,  { x: RX+0.10+FW+0.08, y: ry+0.06, w: DW, h: jRowH-0.08, fontFace: F.gothic, fontSize: 8,   color: C.textSub });
  });

  // ── リレーション矢印（隙間ゾーン内） ──
  // [1] auth.users → users 縦矢印 (隙間y=2.62〜2.90)
  s.addShape(pptx.ShapeType.line, { x: LX+0.15, y: 2.62, w: 0, h: 0.28, line: { color: C.navyMid, width: 1.2 } });
  s.addText('1:1', { x: LX+0.20, y: 2.66, w: 0.30, h: 0.20, fontFace: F.gothic, fontSize: 7.5, color: C.textSub });

  // [2] auth.users → playlists 横矢印 (隙間x=4.15〜4.50)
  const hArrow1Y = TOP_Y + HDR_H + ROW_H*0.5;
  s.addShape(pptx.ShapeType.line, { x: LX+LW, y: hArrow1Y, w: MX-(LX+LW), h: 0, line: { color: C.navyMid, width: 1.2 } });
  s.addText('1:N', { x: LX+LW+0.02, y: hArrow1Y-0.22, w: 0.28, h: 0.20, fontFace: F.gothic, fontSize: 7.5, color: C.textSub });

  // [3] playlists → Track JSONB 破線横矢印 (隙間x=9.20〜9.55)
  const hArrow2Y = TOP_Y + HDR_H + 3*ROW_H + ROW_H*0.5;
  s.addShape(pptx.ShapeType.line, { x: MX+MW, y: hArrow2Y, w: RX-(MX+MW), h: 0, line: { color: C.border, width: 1, dashType: 'dash' } });
  s.addText('JSONB', { x: MX+MW+0.02, y: hArrow2Y-0.22, w: 0.30, h: 0.20, fontFace: F.gothic, fontSize: 7, color: C.textSub });

  // ── RLS注釈 (Track JSONB終端=6.30, y=6.35, 終端=6.73) ──
  s.addShape(pptx.ShapeType.rect, { x: 0.30, y: 6.35, w: 12.73, h: 0.38, fill: { color: C.panel }, line: { color: C.navyLine, width: 0.5 } });
  s.addText('RLS: playlists は user_id = auth.uid() の行のみ読み書き可。is_public = true の行は全ユーザーが閲覧可。', {
    x: 0.45, y: 6.39, w: 12.43, h: 0.30,
    fontFace: F.gothic, fontSize: 9, color: C.navy, valign: 'middle',
  });

  // ── パスワード注釈 (y=6.78, 終端=7.16) ──
  s.addShape(pptx.ShapeType.rect, { x: 0.30, y: 6.78, w: 12.73, h: 0.38, fill: { color: C.bg }, line: { color: C.border, width: 0.5 } });
  s.addText('※ メール＋パスワード認証のパスワードは Supabase が auth.users 内に encrypted_password としてハッシュ化して管理。自前コードからは参照不可。', {
    x: 0.45, y: 6.82, w: 12.43, h: 0.30,
    fontFace: F.gothic, fontSize: 9, italic: true, color: C.textSub, valign: 'middle',
  });

}

// ============================================================
// スライド 10: 苦労した点
// ============================================================
{
  const s = pptx.addSlide();
  s.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 13.33, h: 7.5, fill: { color: C.bg }, line: { type: 'none' } });
  header(s, '苦労した点 ── 仕様策定・API選定・スコープ管理', 10);

  s.addText('自分がクライアントの立場でChatGPTと相談しながら仕様書を策定したが、開発段階で想定外の壁に繰り返し直面した。', {
    x: 0.40, y: 0.88, w: 12.53, h: 0.30,
    fontFace: F.gothic, fontSize: 11, color: C.textBody,
  });

  const LX = 0.40, LY = 1.28, LW = 5.20, LH = 5.78;

  // 左カラム: 仕様策定の工夫 + スコープクリープ
  const C1Y = LY, C1H = 2.55;
  accentCard(s, LX, C1Y, LW, C1H, C.navyMid);
  s.addText('仕様策定の工夫', { x: LX+0.22, y: C1Y+0.10, w: LW-0.30, h: 0.36, fontFace: F.mincho, fontSize: 12, bold: true, color: C.navy });
  s.addShape(pptx.ShapeType.line, { x: LX+0.22, y: C1Y+0.50, w: LW-0.44, h: 0, line: { color: C.navyLine, width: 0.5 } });
  s.addText('自分がクライアントの立場に立ち、ChatGPTと対話しながら仕様書を策定した。ユーザー視点で欲しい機能を洗い出し、技術要件に落とし込む作業を事前に行ったことで、開発の方向性がブレにくくなった。', {
    x: LX+0.22, y: C1Y+0.60, w: LW-0.44, h: C1H-0.70,
    fontFace: F.gothic, fontSize: 10, color: C.textBody, wrap: true,
  });

  const C2Y = C1Y + C1H + 0.18, C2H = LH - C1H - 0.18;
  accentCard(s, LX, C2Y, LW, C2H, 'C8102E');
  s.addText('スコープクリープと反省点', { x: LX+0.22, y: C2Y+0.10, w: LW-0.30, h: 0.36, fontFace: F.mincho, fontSize: 12, bold: true, color: C.navy });
  s.addShape(pptx.ShapeType.line, { x: LX+0.22, y: C2Y+0.50, w: LW-0.44, h: 0, line: { color: C.navyLine, width: 0.5 } });
  s.addText('開発が進むにつれ「この機能も追加したい」が増え続け、当初の想定より完成が大幅に遅れた。仕様書の段階でMust / Want を厳密に切り分け、スコープを固めてから着手すべきだった。\n\nまた、使用するAPIの選定をAIの提案にそのまま従ってしまい、実際に試して初めて「無料枠の廃止」「CORS制約」「URLの有効期限」などの制約に気づくケースが多く、遠回りになった。設計段階で公式ドキュメントや利用規約を自分で調べてから採用を決めるべきだった。', {
    x: LX+0.22, y: C2Y+0.60, w: LW-0.44, h: C2H-0.70,
    fontFace: F.gothic, fontSize: 10, color: C.textBody, wrap: true,
  });

  // 右カラム: API選定の試行錯誤
  const RX = 5.80, RW = 7.10;
  accentCard(s, RX, LY, RW, LH, C.navy);
  s.addText('API 選定の試行錯誤', {
    x: RX+0.22, y: LY+0.10, w: RW-0.30, h: 0.38,
    fontFace: F.mincho, fontSize: 13, bold: true, color: C.navy,
  });
  s.addText('当初想定したAPIが使えず、仕様を大幅に変更せざるをえなかった', {
    x: RX+0.22, y: LY+0.50, w: RW-0.30, h: 0.26,
    fontFace: F.gothic, fontSize: 9.5, color: C.textBody, italic: true,
  });
  s.addShape(pptx.ShapeType.line, {
    x: RX+0.22, y: LY+0.82, w: RW-0.44, h: 0,
    line: { color: C.navyLine, width: 0.5 },
  });

  const apiItems = [
    {
      from: 'Spotify API', to: 'iTunes + Deezer へ切替',
      body: 'Spotify APIで楽曲検索・BPM取得を想定していたが、無料枠が廃止されており利用不可だった。認証不要のiTunes Search APIへ移行し、BPM補完はDeezer APIで対応する構成に変更した。',
    },
    {
      from: 'BPM解析API', to: 'Gemini API による推定に変更',
      body: '既存のBPM解析サービスを試したが対応楽曲数が少なく精度も不十分だった。GeminiにBPM・キー・エネルギー値の推定を委ねる方針に切替え、結果をキャッシュして呼び出しを最小化した。',
    },
    {
      from: 'プレビュー再生', to: 'iTunes + Deezer のフォールバック構成',
      body: 'iTunesのpreviewUrlをプライマリとして使用。URLが期限切れで再生失敗した場合は、再生ボタン押下時にサーバー経由でDeezer APIから最新URLを取得するフォールバック設計を追加実装した。',
    },
    {
      from: 'Gemini モデル選定', to: 'アプリ要件に合うモデルを複数検証して採用',
      body: '日英両対応・長文出力・低レイテンシという要件を複数モデルで検証した。精度・速度・無料枠のトレードオフを考慮し、最終的にgemini-3.1-flash-lite-previewを選定するまで試行錯誤が必要だった。',
    },
  ];

  apiItems.forEach(({ from, to, body }, i) => {
    const ay = LY + 0.96 + i * 1.20;
    s.addShape(pptx.ShapeType.rect, { x: RX+0.22, y: ay, w: 1.90, h: 0.24, fill: { color: C.navyMid }, line: { type: 'none' } });
    s.addText(from, { x: RX+0.22, y: ay, w: 1.90, h: 0.24, fontFace: F.gothic, fontSize: 8.5, bold: true, color: C.textWhite, align: 'center', valign: 'middle' });
    s.addText('→', { x: RX+2.18, y: ay-0.02, w: 0.28, h: 0.28, fontFace: F.gothic, fontSize: 11, bold: true, color: C.navy });
    s.addText(to, { x: RX+2.50, y: ay, w: RW-2.70, h: 0.24, fontFace: F.gothic, fontSize: 9.5, bold: true, color: C.navy, valign: 'middle' });
    s.addText(body, { x: RX+0.22, y: ay+0.28, w: RW-0.44, h: 0.82, fontFace: F.gothic, fontSize: 9, color: C.textBody, wrap: true });
  });
}


// ============================================================
// スライド 12: まとめ
// ============================================================
{
  const s = pptx.addSlide();
  s.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 13.33, h: 7.5, fill: { color: C.bg }, line: { type: 'none' } });
  header(s, 'まとめ', 11);

  // ── 今回の気づき（3カラム）──
  const KY = 1.84;
  s.addShape(pptx.ShapeType.rect, { x: 0.45, y: KY, w: 12.43, h: 0.32, fill: { color: C.panel }, line: { color: C.navyLine, width: 0.5 } });
  s.addText('今回の気づき', { x: 0.60, y: KY, w: 4.0, h: 0.32, fontFace: F.mincho, fontSize: 12, bold: true, color: C.navy, valign: 'middle' });

  const kCardW = (12.43 - 0.40) / 3; // ≈ 4.01
  const kCardH = 4.30;
  const kCards = [
    {
      num: '①', title: 'AIは実装を加速させるが、設計の判断は人間が持つべき',
      body: 'Claude Code でコード生成・デバッグ・診断が驚くほど速く進んだ。一方、API選定などをAIにまかせると制約に気づくのが遅れ手戻りが生じた。AIは「手を動かす道具」、判断は自分でする、という役割分担を体で学んだ。',
    },
    {
      num: '②', title: '授業では習わなかった領域を実践で習得した',
      body: 'Vercel での本番環境へのデプロイ・GitHub と連携した開発フロー・iOS の Safe Area や PWA 対応など、授業では習わなかった実装上のハマりどころを実際に経験した。「なぜ動かないか」を調べる力がついた。',
    },
    {
      num: '③', title: 'セキュリティは AI 任せが限界、自分で学ぶ必要がある',
      body: '今回のセキュリティ対策は Claude による診断に頼った部分が大きく、「なぜ危険か」を自分の言葉で説明できるレベルには達していない。\n\n本番環境として運用するなら、SQL インジェクション・XSS・CORS・認証の仕組みなどを体系的に自分で学ぶ必要があると強く感じた。AI は問題を発見してくれるが、理解と判断は自分が持つべきだという課題が残った。',
    },
  ];
  kCards.forEach(({ num, title, body }, i) => {
    const kx = 0.45 + i * (kCardW + 0.20);
    const ky = 2.31;
    s.addShape(pptx.ShapeType.rect, { x: kx, y: ky, w: kCardW, h: kCardH, fill: { color: C.card }, line: { color: C.border, width: 0.5 } });
    s.addShape(pptx.ShapeType.rect, { x: kx, y: ky, w: kCardW, h: 0.08, fill: { color: C.navyMid }, line: { type: 'none' } });
    s.addText(num + '  ' + title, { x: kx+0.18, y: ky+0.16, w: kCardW-0.32, h: 0.60, fontFace: F.mincho, fontSize: 12, bold: true, color: C.navy, wrap: true });
    s.addShape(pptx.ShapeType.line, { x: kx+0.18, y: ky+0.84, w: kCardW-0.36, h: 0, line: { color: C.border, width: 0.4 } });
    s.addText(body, { x: kx+0.18, y: ky+0.96, w: kCardW-0.32, h: kCardH-1.08, fontFace: F.gothic, fontSize: 11, color: C.textBody, wrap: true, lineSpacingMultiple: 1.3 });
  });

  // URL バー y=6.80
  s.addShape(pptx.ShapeType.rect, { x: 0.45, y: 6.80, w: 12.43, h: 0.38, fill: { color: C.panel }, line: { color: C.navyLine, width: 0.5 } });
  s.addText('https://ripplefm.vercel.app', {
    x: 0.65, y: 6.80, w: 12.10, h: 0.38,
    fontFace: F.gothic, fontSize: 12, color: C.navy, align: 'center', valign: 'middle', underline: true,
  });
}

// ============================================================
// 保存
// ============================================================
const outPath = 'portfolio_ripple_v3.pptx';
await pptx.writeFile({ fileName: outPath });
console.log(`Saved: ${outPath}  (${pptx.slides.length} slides)`);
