import type { Metadata, Viewport } from "next";
import { SITE } from "../lib/content";
import "./globals.css";

const DESC =
  "Download APK Phinime, Phioskop, dan Phikor — nonton anime, drakor, dan film bioskop gratis di Android. Tanpa iklan, tanpa langganan, langsung dari repo.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: {
    default: "phidl — Download APK Anime, Drakor & Film Gratis Tanpa Iklan",
    template: "%s | phidl",
  },
  description: DESC,
  keywords: [
    "download apk anime",
    "apk anime gratis",
    "nonton anime tanpa iklan",
    "apk drakor",
    "download apk drakor",
    "nonton drakor gratis",
    "apk film bioskop",
    "nonton film gratis tanpa langganan",
    "aplikasi streaming gratis android",
    "phinime apk",
    "phioskop apk",
    "phikor apk",
    "phidl",
  ],
  applicationName: "phidl",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: SITE,
    siteName: "phidl",
    locale: "id_ID",
    title: "phidl — Download APK Anime, Drakor & Film Gratis",
    description: DESC,
    images: [{ url: "/web-app-manifest-512x512.png", width: 512, height: 512, alt: "phidl" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "phidl — Download APK Anime, Drakor & Film Gratis",
    description: DESC,
    images: ["/web-app-manifest-512x512.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
};

export const viewport: Viewport = {
  themeColor: "#0b0b0c",
  width: "device-width",
  initialScale: 1,
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