import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Persian FontKit Demo - Next.js 15",
  description: "Demonstration of persian-fontkit with Next.js App Router",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fa" dir="rtl">
      <head>
        {/* Preload optimized Persian fonts */}
        <link
          rel="preload"
          href="/fonts/optimized/vazir-400.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/optimized/vazir-700.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
