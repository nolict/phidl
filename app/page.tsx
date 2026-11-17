import Home from "../components/Home";
import { APPS, SITE, TAGLINE } from "../lib/content";

const ld = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${SITE}/#site`,
      url: SITE,
      name: "phidl",
      inLanguage: "id-ID",
      description: TAGLINE,
    },
    {
      "@type": "ItemList",
      name: "Aplikasi phidl",
      itemListElement: APPS.map((a, i) => ({
        "@type": "ListItem",
        position: i + 1,
        item: {
          "@type": "SoftwareApplication",
          name: a.name,
          description: a.desc,
          applicationCategory: "EntertainmentApplication",
          operatingSystem: "Android",
          inLanguage: "id-ID",
          offers: { "@type": "Offer", price: "0", priceCurrency: "IDR" },
          ...(a.href ? { downloadUrl: a.href } : {}),
        },
      })),
    },
  ],
};

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }}
      />
      <Home />
    </>
  );
}