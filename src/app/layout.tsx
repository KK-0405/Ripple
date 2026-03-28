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
        <title>Ripple</title>
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-title" content="Ripple" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="theme-color" content="#0F0F0F" media="(prefers-color-scheme: dark)" />
        <meta name="theme-color" content="#FFFFFF" media="(prefers-color-scheme: light)" />
        {/* Set bg color and status bar style based on saved theme before React hydrates */}
        <script dangerouslySetInnerHTML={{ __html: `try{var d=localStorage.getItem('dj_theme_v1')==='dark';if(d){document.body.style.background='#0F0F0F';var m=document.querySelector('meta[name="apple-mobile-web-app-status-bar-style"]');if(m)m.content='black';}}catch(e){}` }} />
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
