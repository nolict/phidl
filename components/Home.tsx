"use client";

import { useEffect, useRef } from "react";
import Spiral from "./Spiral";
import GuildWheel from "./GuildWheel";
import Totem from "./Totem";
import Stats from "./Stats";
import SiteFooter from "./SiteFooter";
import {
  C,
  CT,
  HEADLINE,
  S2_BODY,
  S2_LINES,
  S4_LEAD,
  S4_LINES,
  S4_PARA,
  S5_ROWS,
  S5_SUB,
  TAGLINE,
} from "../lib/content";

const V = {
  voice: "_voice_bknov_3",
  headRow: "_headRow_bknov_210",
  colL: "_colL_bknov_27",
  colR: "_colR_bknov_28",
  phoneStage: "_phoneStage_bknov_211",
  phoneM: "_phoneM_bknov_213",
  sheetClip: "_sheetClip_bknov_89",
  modal: "_modal_bknov_100",
  handle: "_handle_bknov_119",
  dots: "_dots_bknov_126",
  dot: "_dot_bknov_126",
  dotOn: "_dotOn_bknov_132",
  mHead: "_mHead_bknov_140",
  mSub: "_mSub_bknov_149",
  stage: "_stage_bknov_155",
  mic: "_mic_bknov_168",
  micGlyph: "_micGlyph_bknov_183",
  mCaption: "_mCaption_bknov_188",
  pills: "_pills_bknov_193",
  pill: "_pill_bknov_193",
  bodyRow: "_bodyRow_bknov_212",
  bodyL: "_bodyL_bknov_69",
  bodyR: "_bodyR_bknov_70",
};

const ss = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

function Chapter({ label, chapter, tone = "dark", style, className }: { label: string; chapter: string; tone?: "dark" | "light"; style?: React.CSSProperties; className?: string }) {
  return (
    <div
      className={`${CT.colontitle} ${tone === "light" ? CT.light : CT.dark} ${className ?? ""}`}
      style={style}
      aria-hidden
    >
      <span>{label}</span>
      <span className={CT.right}>{chapter}</span>
    </div>
  );
}

export default function Home() {
  const root = useRef<HTMLDivElement>(null);
  const progress = useRef(0);
  const s5 = useRef<HTMLElement>(null);
  const s5list = useRef<HTMLDivElement>(null);
  const totem = useRef<HTMLDivElement>(null);
  const guilds = useRef<HTMLDivElement>(null);
  const foot = useRef<HTMLDivElement>(null);
  const pill = useRef<HTMLButtonElement>(null);
  const crests = useRef<(HTMLImageElement | null)[]>([]);
  const crestIdx = useRef(0);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    let raf = 0;
    // layout is static; measure once instead of reading offsets every frame (forced reflow)
    const L = { totem: 0, s5: 0, s5h: 0, rows: [] as number[], g: 0, gh: 0, foot: 0 };
    const measure = () => {
      const sy = window.scrollY;
      const top = (n: HTMLElement | null) =>
        n ? n.getBoundingClientRect().top + sy : 0;
      L.totem = top(totem.current);
      L.s5 = top(s5.current);
      L.s5h = s5.current?.offsetHeight ?? 0;
      L.rows = s5list.current
        ? [...s5list.current.children].map((r) => r.getBoundingClientRect().top + sy)
        : [];
      L.g = top(guilds.current);
      L.gh = guilds.current?.offsetHeight ?? 0;
      L.foot = top(foot.current);
    };
    measure();
    const mo = new ResizeObserver(measure);
    mo.observe(el);
    document.fonts?.ready.then(measure);

    const tick = () => {
      raf = requestAnimationFrame(tick);
      const h = window.innerHeight;
      const y = window.scrollY;
      const a = y / h;
      progress.current = a;

      el.style.setProperty("--ink", String(ss(1.9, 2.6, a)));
      el.style.setProperty("--inkfill", String(ss(1.9, 2.6, a)));
      el.style.setProperty("--dgrow", String(ss(2.1, 2.45, a)));
      el.style.setProperty("--hl", String(ss(2.3, 2.72, a)));

      let b = 0;
      if (totem.current) {
        b = ss(L.totem - h * 0.42, L.totem - h * 0.06, y);
      }
      const collapse = ss(0.52, 0.82, b);
      el.style.setProperty("--treveal", String(ss(0.8, 1, b)));
      el.style.setProperty("--dreveal", String(ss(0.9, 1, b)));
      el.style.setProperty("--totemscale", String(1 - 0.5 * ss(7.9, 9.1, a)));
      el.style.setProperty("--totemlag", String(ss(7.9, 9.1, a)));
      el.style.setProperty("--phone", String(ss(2.2, 2.65, a) * (1 - ss(0.46, 0.74, b))));

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

      if (guilds.current && foot.current) {
        const gTop = L.g;
        const gH = L.gh;
        const n = (h - (gTop - y)) / h;
        const i = Math.min(1, Math.max(0, n));
        el.style.setProperty("--g8off", String(1 - i));
        el.style.setProperty("--g8rot", String(1 - i));
        el.style.setProperty("--g8par", String(Math.min(1, Math.max(0, (y + h - gTop) / (h + gH)))));
        if (i > 0.995 && foot.current) {
          el.classList.add(C.footerOpen, C.footLive);
        }
        const t = (L.foot - y) / h;
        el.style.setProperty("--g8hl", String(ss(1.05, 0.6, t)));
        el.style.setProperty("--g8morph", String(ss(0.52, 0.12, t)));
      }

      if (pill.current && foot.current) {
        const t = Math.max(1, L.foot - h);
        el.style.setProperty("--pillx", String(Math.min(1, Math.max(0, y / t))));
        pill.current.classList.toggle(C.waitPillOn, y > h * 0.15);
      }

      el.style.setProperty("--afade", String(Math.min(1, Math.max(0, (h - L.s5) / h))));
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      mo.disconnect();
    };
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      crestIdx.current = (crestIdx.current + 1) % 5;
      crests.current.forEach((img, i) => {
        if (!img) return;
        img.style.opacity = String(Number(i === crestIdx.current));
        img.style.transform = i === crestIdx.current ? "translateY(0)" : "translateY(45%)";
      });
    }, 1400);
    return () => clearInterval(id);
  }, []);

  let delay = 0;
  const scrollToFoot = () =>
    window.scrollTo({ top: document.documentElement.scrollHeight, behavior: "smooth" });

  return (
    <div ref={root} className={`home-root ${C.page}`}>
      <div className={C.scene}>
        <Spiral progress={() => progress.current} />
      </div>

      <header className={C.hero}>
        <div className={C.scrim} aria-hidden>
          <div className={`${C.blur} ${C.b1}`} />
          <div className={`${C.blur} ${C.b2}`} />
          <div className={C.grad} />
        </div>
        <nav className={C.nav}>
          <button
            className={C.logoBtn}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            aria-label="Grail — back to top"
          >
            <img className={C.logo} src="/Logo.svg" alt="Grail" />
          </button>
          <p className={C.tagline}>{TAGLINE}</p>
          <button className={C.cta} onClick={scrollToFoot}>
            Join Waitlist
          </button>
        </nav>
        <h1 className={C.headline} aria-label={HEADLINE}>
          {HEADLINE.split(" ").map((w, wi, all) => (
            <span key={wi} className={C.word}>
              {[...w].map((ch, ci) => {
                const c = (
                  <span
                    key={ci}
                    className={C.letter}
                    style={{ animationDelay: `${delay++ * 0.045}s` }}
                  >
                    {ch}
                  </span>
                );
                return c;
              })}
              {wi < all.length - 1 ? <span className={C.space} /> : null}
            </span>
          ))}
        </h1>
      </header>

      <section className={C.section2}>
        <Chapter label="About Problem" chapter="Chapter 01" />
        <div className={C.s2inner}>
          <div className={C.s2head} aria-hidden>
            {S2_LINES.map((l, i) => (
              <div key={i} className={C.s2line} style={{ marginLeft: l.ml }}>
                {l.t}
              </div>
            ))}
          </div>
          <p className={C.s2body}>{S2_BODY}</p>
        </div>
      </section>

      <section className={C.section3} />

      <div className={`${C.clock}`} aria-hidden>
        <span className={C.clockNum}>
          {["47", "59", "59"].map((pair, g) => (
            <span key={g}>
              {g > 0 && <span className={C.clockColon}>:</span>}
              <span className={C.clockGroup}>
                {[0, 1].map((n) => (
                  <span key={n} className={C.clockDigit}>
                    {pair[n]}
                  </span>
                ))}
              </span>
            </span>
          ))}
        </span>
      </div>
      <img
        className={C.phone}
        src="/accept-phone.webp"
        alt=""
        aria-hidden
        width={643}
        height={1306}
        loading="lazy"
        decoding="async"
      />

      <section className={C.section4}>
        <div className={`${C.acceptOverlay} ${C.desktopOnly}`} aria-hidden>
          <Chapter label="About Timer" chapter="Chapter 02" tone="light" />
          <h2 className={C.s4head}>
            {S4_LINES.map((line, li) => (
              <span key={li} className={C.s4line}>
                {line.flatMap((chunk, ci) =>
                  [...chunk].map((ch, i) => (
                    <span
                      key={`${ci}-${i}`}
                      className={C.s4word}
                      style={{ "--i": delay++ } as React.CSSProperties}
                    >
                      {ch}
                    </span>
                  )),
                )}
              </span>
            ))}
          </h2>
          <div className={C.inkReveal}>
            <div className={C.s4body}>
              <p className={C.s4lead}>{S4_LEAD}</p>
              <p className={C.s4para}>{S4_PARA}</p>
            </div>
          </div>
          <div className={C.s4divider} />
        </div>
      </section>

      <section ref={s5} className={C.section5}>
        <Chapter
          label="About Journey"
          chapter="Chapter 03"
          tone="light"
          style={{ opacity: "clamp(0, (0.8 - var(--vreveal, 0)) / 0.2, 1)" }}
        />
        <div className={C.s5inner}>
          <h2 className={C.s5head}>
            <span className={C.s5headLine}>
              It starts as one
              {" "}
              <span className={C.s5questWrap}>
                <span className={C.s5crest} aria-hidden>
                  {["tempers", "brotherhood-of-tale", "keepers-of-time", "seeker-of-forsaken", "wind-shifters"].map((slug, i) => (
                    <img
                      key={slug}
                      ref={(el) => {
                        crests.current[i] = el;
                      }}
                      src={`/patterns/${slug}-160.webp`}
                      alt=""
                      width={160}
                      height={158}
                      loading="lazy"
                      decoding="async"
                      style={{
                        opacity: Number(i === 0),
                        transform: i === 0 ? "translateY(0)" : "translateY(45%)",
                      }}
                    />
                  ))}
                </span>
                &nbsp;quest.
              </span>
            </span>
            <span className={C.s5headLine}>It rarely stays that way.</span>
          </h2>
          <p className={C.s5sub}>{S5_SUB}</p>
          <div className={C.s5list} ref={s5list}>
            {S5_ROWS.map((row, i) => (
              <div key={i} className={C.s5row}>
                <div className={C.s5left}>
                  <div>
                    <p className={C.s5chanceLabel}>A chance</p>
                    <p className={C.s5chance}>{row.chance}</p>
                  </div>
                  <p className={C.s5num}>{String(i + 1).padStart(2, "0")}</p>
                </div>
                <img
                  className={C.s5photo}
                  src={`/story/0${i + 1}.jpg`}
                  alt=""
                  width={800}
                  height={1000}
                  loading="lazy"
                  decoding="async"
                />
                <p className={C.s5desc}>{row.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={V.voice}>
        <Chapter label="About Voice Feedback" chapter="Chapter 04" tone="light" />
        <div className={V.headRow}>
          <div className={V.colL} aria-hidden>
            <span>Tell</span>
            <span>future</span>
            <span>self</span>
          </div>
          <div className={V.colR} aria-hidden>
            <span>And</span>
            <span>seekers</span>
            <span>after</span>
          </div>
        </div>
        <div className={V.phoneStage}>
          <img className={V.phoneM} src="/accept-phone.webp" alt="" width={643} height={1306} loading="lazy" decoding="async" />
          <div className={V.sheetClip}>
            <div className={V.modal}>
              <div className={V.handle} aria-hidden />
              <div className={V.dots} aria-hidden>
                <span className={V.dotOn} />
                <span className={V.dot} />
              </div>
              <p className={V.mHead}>Say it out loud.</p>
              <p className={V.mSub}>While it&apos;s fresh. Thirty seconds is enough.</p>
              <div className={V.stage}>
                <button className={V.mic} aria-label="Record">
                  <span className={V.micGlyph} aria-hidden />
                </button>
              </div>
              <p className={V.mCaption}>Hold to speak. Release to keep it.</p>
              <div className={V.pills}>
                <span className={V.pill}>Easy</span>
                <span className={V.pill}>Hard</span>
              </div>
            </div>
          </div>
        </div>
        <div className={V.bodyRow}>
          <p className={V.bodyL}>
            The quest fades by tomorrow. What you felt right after doing it doesn&apos;t. Say it out
            loud while it&apos;s fresh, thirty seconds or three minutes, and you&apos;ve got it
            forever.
          </p>
          <p className={V.bodyR}>
            Before you start, hear what other people said about this one. After you&apos;re done,
            leave yours for whoever gets it next. Same quest, a hundred different nights.
          </p>
        </div>
      </section>

      <div ref={totem} className={C.totemWrap}>
        <div className={C.totemPin}>
          <Totem />
        </div>
        <div className={C.totemHold} aria-hidden />
      </div>

      <div className={C.statsWrap}>
        <div className={C.statsPin}>
          <Stats embedded />
        </div>
      </div>

      <div ref={guilds} className={C.guildsWrap}>
        <GuildWheel />
      </div>

      <div ref={foot} className={C.footWrap}>
        <div className={C.footPin}>
          <SiteFooter />
        </div>
      </div>

      <button
        ref={pill}
        className={C.waitPill}
        onClick={scrollToFoot}
        aria-label="Join Waitlist"
      >
        <span className={C.pillMark} aria-hidden />
        <span className={C.pillBtn}>Join Waitlist</span>
      </button>
    </div>
  );
}
