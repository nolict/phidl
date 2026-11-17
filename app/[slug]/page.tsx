import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { APPS, SITE, TG } from "../../lib/content";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return APPS.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const app = APPS.find((a) => a.slug === slug);
  if (!app) return {};
  return {
    title: app.seo.title,
    description: app.seo.desc,
    alternates: { canonical: `/${app.slug}` },
    openGraph: {
      type: "article",
      url: `${SITE}/${app.slug}`,
      title: app.seo.title,
      description: app.seo.desc,
      images: [app.logo ?? "/web-app-manifest-512x512.png"],
    },
    twitter: {
      card: "summary_large_image",
      title: app.seo.title,
      description: app.seo.desc,
      images: [app.logo ?? "/web-app-manifest-512x512.png"],
    },
  };
}

export default async function AppPage({ params }: Props) {
  const { slug } = await params;
  const app = APPS.find((a) => a.slug === slug);
  if (!app) notFound();
  const others = APPS.filter((a) => a.slug !== slug);

  const ld = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: app.name,
    description: app.desc,
    applicationCategory: "EntertainmentApplication",
    operatingSystem: "Android",
    inLanguage: "id-ID",
    url: `${SITE}/${app.slug}`,
    offers: { "@type": "Offer", price: "0", priceCurrency: "IDR" },
    ...(app.href ? { downloadUrl: app.href } : {}),
  };

  return (
    <main className="apkpage">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <div className="apkpage-wrap">
        <a className="apkback" href="/">
          ← phidl
        </a>
        <div className="dlrow-top">
          <div className="appmark" aria-hidden>
            {app.logo ? <img src={app.logo} alt="" /> : <span>{app.initial}</span>}
          </div>
          <span className={`dl-chip${app.href ? " dl-chip-on" : ""}`}>{app.status}</span>
        </div>
        <h1 className="apkpage-h1">{app.seo.h1}</h1>
        <div className="dlrow-tags">
          {app.tags.map((t) => (
            <span key={t}>{t}</span>
          ))}
        </div>
        {app.href ? (
          <a className="dlcta" href={app.href} target="_blank" rel="noreferrer">
            Unduh {app.name} APK
            <span aria-hidden>↓</span>
          </a>
        ) : (
          <a className="dlcta" href={TG} target="_blank" rel="noreferrer">
            Info rilis di Telegram
            <span aria-hidden>↗</span>
          </a>
        )}
        <p className="apkpage-meta">
          {app.href ? "Android · APK · gratis · tanpa iklan" : "Android · belum tersedia"}
        </p>
        {app.seo.body.map((p) => (
          <p key={p.slice(0, 24)} className="apkpage-p">
            {p}
          </p>
        ))}
        <h2 className="apkpage-h2">Aplikasi lain</h2>
        <ul className="apkpage-list">
          {others.map((o) => (
            <li key={o.slug}>
              <a href={`/${o.slug}`}>{o.name}</a> — {o.desc}
            </li>
          ))}
        </ul>
        <p className="apkpage-p">
          <a href="/">Semua aplikasi phidl</a>
        </p>
      </div>
    </main>
  );
}