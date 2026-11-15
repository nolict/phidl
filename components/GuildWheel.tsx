"use client";

import { useEffect, useRef, useState } from "react";
import { GUILD_BODY, GUILD_HEAD, GUILD_LEAD, GUILD_LIST } from "../lib/content";

const X = {
  guilds: "_guilds_194d4_3",
  topbar: "_topbar_194d4_18",
  wheel: "_wheel_194d4_34",
  guildName: "_guildName_194d4_49",
  spoke: "_spoke_194d4_62",
  crest: "_crest_194d4_67",
  shader: "_shader_194d4_99",
  shaderBlur: "_shaderBlur_194d4_108",
  sb1: "_sb1_194d4_117",
  sb2: "_sb2_194d4_123",
  shaderGrad: "_shaderGrad_194d4_129",
  cover: "_cover_194d4_135",
  kicker: "_kicker_194d4_145",
  in: "_in_194d4_158",
  headWrap: "_headWrap_194d4_162",
  head: "_head_194d4_162",
  leadWord: "_leadWord_194d4_233",
  leadLetter: "_leadLetter_194d4_236",
  leadStack: "_leadStack_194d4_206",
  lead: "_lead_194d4_206",
  blurbBody: "_blurbBody_194d4_244",
};

const N = 10;
const SPEED = 4;
const DRAG = 0.05;
const MAXV = 110;
const SIGMA = 26;
const FADE = 16;
const norm = (a: number) => (((a % 360) + 540) % 360) - 180;

export default function GuildWheel() {
  const section = useRef<HTMLElement>(null);
  const wheel = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLParagraphElement>(null);
  const crests = useRef<(HTMLSpanElement | null)[]>([]);
  const [seen, setSeen] = useState(false);
  const reduced = useRef(false);

  useEffect(() => {
    reduced.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const el = section.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setSeen(e.isIntersecting), { threshold: 0.12 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const w = wheel.current;
    const lab = label.current;
    if (!w || !lab) return;
    const pointer = { x: 0, y: 0, on: false };
    const onMove = (e: PointerEvent) => {
      pointer.x = e.clientX;
      pointer.y = e.clientY;
      pointer.on = true;
    };
    const onLeave = () => (pointer.on = false);
    window.addEventListener("pointermove", onMove);
    document.addEventListener("pointerleave", onLeave);

    let raf = 0;
    let spin = 15;
    let lastY = window.scrollY;
    let velocity = 0;
    let last = performance.now();
    const offs = new Array(N).fill(0);

    const tick = () => {
      raf = requestAnimationFrame(tick);
      const now = performance.now();
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (!seen) {
        lastY = window.scrollY;
        return;
      }
      const y = window.scrollY;
      const raw = dt > 0 ? (y - lastY) / dt : 0;
      lastY = y;
      velocity += (raw - velocity) * Math.min(1, dt * 6);
      const boost = Math.max(-MAXV, Math.min(MAXV, velocity * DRAG));
      if (!reduced.current) spin += (SPEED + boost) * dt;

      const r = w.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const rw = r.width / 2;
      const rh = rw * 1.04;
      w.style.transform = `rotate(${spin}deg)`;

      const dx = pointer.x - cx;
      const dy = pointer.y - cy;
      const dist = Math.hypot(dx, dy);
      const ang = (Math.atan2(dx, -dy) * 180) / Math.PI;

      let best = 0;
      let bestAbs = 1e9;
      let bestAng = 0;
      for (let i = 0; i < N; i++) {
        const own = norm((i * 360) / N + 15 + spin);
        if (Math.abs(own) < bestAbs) {
          bestAbs = Math.abs(own);
          best = i;
          bestAng = own;
        }
        let push = 0;
        if (pointer.on) {
          const d = norm(ang - own);
          const g = Math.exp(-((d / SIGMA) ** 2));
          const along = dist * Math.cos((d * Math.PI) / 180);
          push = Math.max(-0.09 * rw, Math.min(0.13 * rw, (along - rw) * 1.8)) * g;
        }
        offs[i] += (push - offs[i]) * Math.min(1, dt * 7);
        const rad = (own * Math.PI) / 180;
        const radial = (rw * rh) / Math.hypot(rh * Math.sin(rad), rw * Math.cos(rad));
        const y2 = radial - rw + offs[i];
        const c = crests.current[i];
        if (c) c.style.transform = `translate(-50%, calc(-50% + ${(-y2).toFixed(1)}px))`;
      }

      const fade = Math.max(0, 1 - Math.abs(SPEED + boost) / 80);
      const op = Math.max(0, Math.min(1, 1 - (bestAbs - 6) / FADE)) * fade;
      lab.style.opacity = op.toFixed(2);
      lab.textContent = GUILD_LIST[best % GUILD_LIST.length].name;
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
    };
  }, [seen]);

  return (
    <section ref={section} className={`${X.guilds} ${seen ? X.in : ""}`}>
      <div className={X.topbar}>
        <span>About Guilds</span>
        <span>Chapter 07</span>
      </div>
      <div ref={wheel} className={X.wheel} aria-hidden>
        {Array.from({ length: N }, (_, i) => (
          <div key={i} className={X.spoke} style={{ transform: `rotate(${(i * 360) / N + 15}deg)` }}>
            <span
              className={X.crest}
              ref={(el) => {
                crests.current[i] = el;
              }}
            >
              <img
                src={GUILD_LIST[i % GUILD_LIST.length].pattern}
                srcSet={`${GUILD_LIST[i % GUILD_LIST.length].pattern.replace(".webp", "-160.webp")} 160w, ${GUILD_LIST[i % GUILD_LIST.length].pattern} 845w`}
                sizes="(max-width: 768px) 16vw, 12.15vw"
                alt=""
                width={845}
                height={836}
                loading="lazy"
                decoding="async"
              />
            </span>
          </div>
        ))}
      </div>
      <p ref={label} className={X.guildName} aria-hidden />
      <div className={X.shader} aria-hidden>
        <div className={`${X.shaderBlur} ${X.sb1}`} />
        <div className={`${X.shaderBlur} ${X.sb2}`} />
        <div className={X.shaderGrad} />
      </div>
      <div className={X.cover} aria-hidden />
      <p className={X.kicker}>Join a guild. Or start one.</p>
      <div className={X.headWrap} data-guild-title>
        <h2 className={X.head}>
          {GUILD_HEAD.join(" ")
            .split(" ")
            .map((w, wi, all) => (
              <span key={wi} className={X.leadWord}>
                {[...w].map((ch, ci) => (
                  <span key={ci} className={X.leadLetter} style={{ "--i": wi } as React.CSSProperties}>
                    {ch}
                  </span>
                ))}
                {wi < all.length - 1 ? " " : null}
              </span>
            ))}
        </h2>
      </div>
      <div className={X.leadStack}>
        <p className={X.lead}>
          {GUILD_LEAD.split(" ").map((w, wi, all) => (
            <span key={wi} className={X.leadWord}>
              {[...w].map((ch, ci) => (
                <span key={ci} className={X.leadLetter} style={{ "--i": wi + ci } as React.CSSProperties}>
                  {ch}
                </span>
              ))}
              {wi < all.length - 1 ? " " : null}
            </span>
          ))}
        </p>
        <p className={X.blurbBody}>{GUILD_BODY}</p>
      </div>
    </section>
  );
}
