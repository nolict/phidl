"use client";

import { useEffect, useRef, useState } from "react";
import { STATS, STATS_BODY } from "../lib/content";

const Y = {
  stats: "_stats_10nox_14",
  embedded: "_embedded_10nox_26",
  head: "_head_10nox_66",
  headMask: "_headMask_10nox_82",
  headLine: "_headLine_10nox_88",
  in: "_in_10nox_92",
  body: "_body_10nox_99",
  labels: "_labels_10nox_120",
  label: "_label_10nox_120",
  labelName: "_labelName_10nox_164",
  labelCount: "_labelCount_10nox_169",
  grid: "_grid_10nox_203",
  tile: "_tile_10nox_213",
  tileFill: "_tileFill_10nox_222",
  tileLabel: "_tileLabel_10nox_233",
  tileName: "_tileName_10nox_255",
  tileCount: "_tileCount_10nox_262",
};

const BG: Record<string, string> = {
  STR: "/patterns/stats-bg-str.webp",
  INT: "/patterns/stats-bg-int.webp",
  CHA: "/patterns/stats-bg-char.webp",
  WIS: "/patterns/stats-bg-wis.webp",
};

export default function Stats({ embedded = true }: { embedded?: boolean }) {
  const ref = useRef<HTMLElement>(null);
  const [seen, setSeen] = useState(false);
  const [counts, setCounts] = useState(STATS.map(() => 0));

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setSeen(true), {
      threshold: 0.35,
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!seen) return;
    const start = performance.now();
    let raf = 0;
    const run = () => {
      const t = Math.min(1, (performance.now() - start) / 1600);
      const e = 1 - (1 - t) ** 3;
      setCounts(STATS.map((s) => Math.round(s.value * e)));
      if (t < 1) raf = requestAnimationFrame(run);
    };
    raf = requestAnimationFrame(run);
    return () => cancelAnimationFrame(raf);
  }, [seen]);

  return (
    <section
      ref={ref}
      className={`${Y.stats} ${embedded ? Y.embedded : ""} ${seen ? Y.in : ""}`}
    >
      <div className="_colontitle_1ghgf_1 _dark_1ghgf_21" aria-hidden>
        <span>About Stats</span>
        <span className="_right_1ghgf_18">Chapter 06</span>
      </div>
      <h2 className={Y.head}>
        <span className={Y.headMask}>
          <span className={Y.headLine}>Every quest</span>
        </span>
        <span className={Y.headMask}>
          <span className={Y.headLine}>lands somewhere.</span>
        </span>
      </h2>
      <p className={Y.body}>{STATS_BODY}</p>
      <ul className="sr-only">
        {STATS.map((s) => (
          <li key={s.key}>
            {s.label}, from {s.guild}.
          </li>
        ))}
      </ul>
      <div className={Y.grid}>
        {STATS.map((s, i) => (
          <div key={s.key} className={Y.tile}>
            <div
              className={Y.tileFill}
              style={
                {
                  backgroundImage: `url(${BG[s.key]})`,
                  "--target": `${s.value}%`,
                } as React.CSSProperties
              }
            />
            <div className={Y.tileLabel}>
              <span className={Y.tileName}>{s.label}</span>
              <span className={Y.tileCount}>{counts[i]}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
