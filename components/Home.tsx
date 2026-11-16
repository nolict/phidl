"use client";

import { useEffect, useRef, useState } from "react";
import Spiral from "./Spiral";
import {
  APPS,
  APPS_HEAD,
  APPS_SUB,
  BRAND,
  C,
  HEADLINE,
  S2_BODY,
  S2_LINES,
  TAGLINE,
  TG,
} from "../lib/content";

const ss = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

export default function Home() {
  const root = useRef<HTMLDivElement>(null);
  const progress = useRef(0);
  const s5 = useRef<HTMLElement>(null);
  const s5list = useRef<HTMLDivElement>(null);
  const intro = useRef<HTMLElement>(null);
  const apps = useRef<HTMLDivElement>(null);
  const pill = useRef<HTMLButtonElement>(null);
  // live apps fetch their latest release; version-named assets need the API
  const [releases, setReleases] = useState<Record<string, { url: string; ver: string }>>({});

  useEffect(() => {
    const repos: Record<string, string> = {
      Phinime: "nolict/phinime-release",
      Phioskop: "artsbymat/phioskop-release",
    };
    Object.entries(repos).forEach(([name, repo]) => {
      fetch(`https://api.github.com/repos/${repo}/releases/latest`)
        .then((r) => r.json())
        .then((d) => {
          const apk = (d.assets || []).find((a: { name: string }) => a.name.endsWith(".apk"));
          const ver = (d.tag_name || "") as string;
          if (apk) setReleases((p) => ({ ...p, [name]: { url: apk.browser_download_url, ver } }));
        })
        .catch(() => {});
    });
  }, []);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    let raf = 0;
    const L = { s5: 0, s5h: 0, rows: [] as number[] };
    // layout is static; measure once instead of reading offsets every frame (forced reflow)
    const measure = () => {
      const sy = window.scrollY;
      L.s5 = (s5.current?.getBoundingClientRect().top ?? 0) + sy;
      L.s5h = s5.current?.offsetHeight ?? 0;
      L.rows = s5list.current
        ? [...s5list.current.children].map((r) => r.getBoundingClientRect().top + sy)
        : [];
    };
    measure();
    const mo = new ResizeObserver(measure);
    mo.observe(el);
    document.fonts?.ready.then(measure);

    const tick = () => {
      raf = requestAnimationFrame(tick);
      const h = window.innerHeight;
      const y = window.scrollY;
      progress.current = y / h;

      if (s5.current) {
        const bottom = L.s5 + L.s5h - y;
        const into = Math.min(1, Math.max(0, (h - (L.s5 - y)) / h));
        const out = Math.min(1, Math.max(0, (h - bottom) / h));
        el.style.setProperty("--vreveal", String(out));
        el.style.setProperty("--s5off", String(Math.min(1, 1 - into + out)));
        el.style.setProperty("--s5rot", String(1 - into - out));
      }

      if (s5list.current) {
        const rows = s5list.current.children;
        for (let i = 0; i < rows.length; i++) {
          const rt = L.rows[i] - y;
          const p = Math.min(1, Math.max(0, (h * 0.9 - rt) / (h * 0.45)));
          (rows[i] as HTMLElement).style.setProperty("--rp", String(p));
        }
      }

      pill.current?.classList.toggle(C.waitPillOn, y > h * 0.15);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      mo.disconnect();
    };
  }, []);

  // entrance classes are one-shot animations; reveal them when scrolled into view
  useEffect(() => {
    const targets: [HTMLElement | null, string][] = [
      [intro.current, C.in],
      [apps.current, C.s5in],
    ];
    const io = new IntersectionObserver(
      (es) =>
        es.forEach((e) => e.isIntersecting && e.target.classList.add(targets.find(([n]) => n === e.target)![1])),
      { threshold: 0.25 },
    );
    targets.forEach(([n]) => n && io.observe(n));
    return () => io.disconnect();
  }, []);

  let delay = 0;
  const scrollToApps = () => {
    s5.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div ref={root} className={`home-root ${C.page}`}>
      <div className={C.scene}>
        <Spiral progress={() => progress.current} />
      </div>

      <header className={C.hero}>
        <nav className={C.nav}>
          <button
            className={C.logoBtn}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            aria-label={`${BRAND} — back to top`}
          >
            <span
              className={C.logo}
              style={{
                fontFamily: "PP Pangaia, Georgia, serif",
                fontSize: 24,
                lineHeight: "24px",
                height: 24,
                textTransform: "uppercase",
                letterSpacing: "-.01em",
              }}
            >
              {BRAND}
            </span>
          </button>
          <p className={C.tagline}>{TAGLINE}</p>
          <button className={C.cta} onClick={scrollToApps}>
            Unduh
          </button>
        </nav>
        <h1 className={C.headline} aria-label={HEADLINE}>
          {HEADLINE.split(" ").map((w, wi, all) => (
            <span key={wi} className={C.word}>
              {[...w].map((ch, ci) => (
                <span
                  key={ci}
                  className={C.letter}
                  style={{ animationDelay: `${delay++ * 0.045}s` }}
                >
                  {ch}
                </span>
              ))}
              {wi < all.length - 1 ? <span className={C.space} /> : null}
            </span>
          ))}
        </h1>
      </header>

      <section ref={intro} className={C.section2}>
        <div className={C.s2inner}>
          <div className={C.s2head} aria-hidden>
            {S2_LINES.map((l, i) => (
              <div key={i} className={C.s2line} style={{ marginLeft: l.ml }}>
                {l.t}
              </div>
            ))}
          </div>
          <p className={C.s2body}>{S2_BODY}</p>
          <a className="tgjoin" href={TG} target="_blank" rel="noreferrer">
            Join komunitas di Telegram
            <span aria-hidden>↗</span>
          </a>
        </div>
      </section>

      <section ref={s5} className={C.section5}>
        <div ref={apps} className={C.s5inner}>
          <h2 className={C.s5head}>
            {APPS_HEAD.map((line) => (
              <span key={line} className={C.s5headLine}>
                {line}
              </span>
            ))}
          </h2>
          <p className={C.s5sub}>{APPS_SUB}</p>
          <div ref={s5list} className={`${C.s5list} dlrow-grid`}>
            {APPS.map((a) => {
              const rel = releases[a.name];
              const href = rel?.url ?? a.href;
              return (
              <div key={a.name} className={`${C.s5row} dlrow`}>
                <div className="dlrow-top">
                  <div className="appmark" aria-hidden>
                    {a.logo ? <img src={a.logo} alt="" /> : <span>{a.initial}</span>}
                  </div>
                  <span className={`dl-chip${href ? " dl-chip-on" : ""}`}>{a.status}</span>
                </div>
                <p className={C.s5chance}>{a.name}</p>
                <p className="dlrow-desc">{a.desc}</p>
                <div className="dlrow-tags">
                  {a.tags.map((t) => (
                    <span key={t}>{t}</span>
                  ))}
                </div>
                <div className="dlrow-foot">
                  <span className="dlrow-meta">
                    {href ? `APK · v${rel?.ver.replace(/^v/, "") ?? "?"}` : "Belum dirilis"}
                  </span>
                  {href ? (
                    <a className="dlcta" href={href} target="_blank" rel="noreferrer">
                      Unduh APK
                      <span aria-hidden>↓</span>
                    </a>
                  ) : (
                    <span className="dlcta dlcta-off">Segera hadir</span>
                  )}
                </div>
              </div>
              );
            })}
          </div>
        </div>
      </section>

      <button
        ref={pill}
        className={C.waitPill}
        onClick={scrollToApps}
        aria-label="Unduh APK"
      >
        <span className={C.pillBtn}>Unduh</span>
      </button>
    </div>
  );
}
