import "./globals.css";
import type { Viewport } from "next";
import { Providers } from "./providers";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <head>
        <title>Ripple</title>
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-title" content="Ripple" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="theme-color" content="#FFFFFF" />
        {/* ライトモードのデフォルト。ダーク設定の場合はスクリプトで上書き */}
        <script dangerouslySetInnerHTML={{ __html: `try{var d=localStorage.getItem('dj_theme_v1')==='dark';if(d){document.body.style.background='#0F0F0F';var m=document.querySelector('meta[name="apple-mobile-web-app-status-bar-style"]');if(m)m.content='black';var t=document.querySelector('meta[name="theme-color"]');if(t)t.content='#0F0F0F';}}catch(e){}` }} />
        <meta property="og:title" content="Ripple" />
        <meta property="og:description" content="Find Your Sound" />
        <meta property="og:image" content="/icon.svg" />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
