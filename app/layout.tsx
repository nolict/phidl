import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Grail: Real-world quests, every day",
  description:
    "Grail pulls you out of autopilot with one real-world quest a day. Grow four stats: Strength, Intellect, Charisma, Wisdom. When you graduate, your subscription cancels itself.",
  icons: { icon: "/Fav.svg" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
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
