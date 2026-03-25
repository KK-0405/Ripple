"use client";

import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";
import { ThemeProvider } from "@/lib/theme-context";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <head>
        {/* Prevent white flash: set body bg before React hydrates */}
        <script dangerouslySetInnerHTML={{ __html: `try{if(localStorage.getItem('dj_theme_v1')==='dark'){document.body.style.background='#0F0F0F';}}catch(e){}` }} />
        <title>Ripple</title>
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta property="og:title" content="Ripple" />
        <meta property="og:description" content="Find Your Sound" />
        <meta property="og:image" content="/icon.svg" />
      </head>
      <body>
        <AuthProvider>
          <ThemeProvider>{children}</ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
