import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "phidl — Phinime, Phikor, Phioskop",
  description:
    "Anime, manga, manhwa, film bioskop, dan drakor dalam satu tempat. Tanpa bayar, tanpa iklan, tanpa batasan.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <head>
        <link
          rel="preload"
          as="font"
          type="font/woff2"
          href="/fonts/Switzer-Variable.woff2"
          crossOrigin=""
        />
        <link
          rel="preload"
          as="font"
          type="font/woff2"
          href="/fonts/PPPangaia-Light.woff2"
          crossOrigin=""
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
