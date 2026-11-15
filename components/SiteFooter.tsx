"use client";

import { useState } from "react";
import { EMAIL_MSG } from "../lib/content";

const Z = {
  footer: "_footer_jyv7u_1",
  topbar: "_topbar_jyv7u_20",
  lead: "_lead_jyv7u_43",
  pitch: "_pitch_jyv7u_44",
  formZone: "_formZone_jyv7u_45",
  bottom: "_bottom_jyv7u_47",
  tile: "_tile_jyv7u_87",
  tileMark: "_tileMark_jyv7u_129",
  emailInput: "_emailInput_jyv7u_165",
  line: "_line_jyv7u_170",
  inputWrap: "_inputWrap_jyv7u_205",
  ph: "_ph_jyv7u_19",
  phOff: "_phOff_jyv7u_256",
  bubbleWrap: "_bubbleWrap_jyv7u_279",
  bubble: "_bubble_jyv7u_279",
  bubbleLeft: "_bubbleLeft_jyv7u_340",
  bubbleText: "_bubbleText_jyv7u_396",
  enterBtn: "_enterBtn_jyv7u_411",
  bigDone: "_bigDone_jyv7u_447",
  caption: "_caption_jyv7u_458",
  bcol: "_bcol_jyv7u_505",
  bcenter: "_bcenter_jyv7u_513",
  bright: "_bright_jyv7u_518",
  dim: "_dim_jyv7u_521",
  wordmark: "_wordmark_jyv7u_525",
  mail: "_mail_jyv7u_530",
  legal: "_legal_jyv7u_535",
};

type State = "idle" | "typing" | "done" | "dupe";

const MAILBOXES = new Set(
  "gmail.googlemail.icloud.me.mac.hotmail.outlook.live.msn.yahoo.ymail.proton.protonmail.pm.gmx.aol.mail.web.t-online.yandex.zoho.fastmail.hey.seznam.wp.o2.orange.free.ukr.bluewin.libero.freenet.posteo.tutanota.tuta.email.inbox".split(
    ".",
  ),
);

function problem(v: string): string | null {
  if (!v) return null;
  if (/\s/.test(v)) return EMAIL_MSG.space[0];
  if ((v.match(/@/g) ?? []).length > 1) return EMAIL_MSG.multiat[0];
  const at = v.indexOf("@");
  if (at === -1) return v.length < 3 ? null : EMAIL_MSG.noat[0];
  const local = v.slice(0, at);
  const domain = v.slice(at + 1);
  if (!domain) return EMAIL_MSG.atonly[0];
  if (!domain.includes(".")) return domain.length > 2 ? EMAIL_MSG.nodot[0] : null;
  const [, tld] = domain.split(/\.(?=[^.]+$)/);
  if (!tld || tld.length < 2) return EMAIL_MSG.nodot[0];
  const word = local.replace(/[^a-z]/gi, "");
  if (local.length > 2 && (!/[aeiou]/i.test(word) || /(.)\1\1/.test(local))) return EMAIL_MSG.mash[0];
  if (!/^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(v)) return EMAIL_MSG.invalid[0];
  return null;
}

export default function SiteFooter() {
  const [value, setValue] = useState("");
  const [state, setState] = useState<State>("idle");
  const tip = problem(value);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (tip || state === "done" || state === "dupe") return;
    const key = `grail:${value.toLowerCase()}`;
    if (localStorage.getItem(key)) setState("dupe");
    else {
      localStorage.setItem(key, "1");
      setState("done");
    }
  };

  return (
    <footer className={Z.footer}>
      <div className={Z.topbar}>
        <span>Get In Early</span>
        <span>Chapter 08</span>
      </div>
      <div className={Z.tile} aria-hidden>
        <span className={Z.tileMark} />
      </div>
      <p className={Z.lead}>Stop meaning to. Start doing.</p>
      <p className={Z.pitch}>
        We&apos;re still building Grail, and we&apos;re letting the first group in when it&apos;s
        ready. Leave your email and you&apos;ll be near the front of the line.
      </p>
      <div className={Z.formZone}>
        {state === "done" || state === "dupe" ? (
          <>
            <p className={Z.bigDone}>{state === "done" ? "You're in." : "Already in."}</p>
            <p className={Z.caption}>
              {state === "done" ? "We'll email you when the gates open." : "This email is on the list."}
            </p>
          </>
        ) : (
          <form onSubmit={submit} noValidate>
            <div className={Z.inputWrap}>
              <input
                className={Z.emailInput}
                type="email"
                autoComplete="email"
                aria-label="Email"
                value={value}
                onChange={(e) => {
                  setValue(e.target.value);
                  setState("typing");
                }}
              />
              <span className={`${Z.ph} ${value ? Z.phOff : ""}`} aria-hidden>
                your@email.com
              </span>
              <span className={Z.line} aria-hidden />
              <div className={Z.bubbleWrap} aria-live="polite" style={{ left: "50%" }}>
                {tip && (
                  <div className={`${Z.bubble} ${Z.bubbleLeft}`}>
                    <span className={Z.bubbleText}>{tip}</span>
                  </div>
                )}
              </div>
            </div>
            <button type="submit" className={Z.enterBtn} aria-label="Join the waitlist">
              ↵
            </button>
          </form>
        )}
        <p className={Z.caption}>Early access · No card, no spam</p>
      </div>
      <div className={Z.bottom}>
        <div className={`${Z.bcol} ${Z.dim}`}>
          <span className={Z.wordmark}>Grail</span>
        </div>
        <div className={Z.bcenter}>
          <span>Real Life Happens Offline</span>
        </div>
        <div className={`${Z.bcol} ${Z.bright}`}>
          <a className={Z.mail} href="mailto:grail@denormalized.co">
            grail@denormalized.co
          </a>
          <a className={Z.legal} href="/terms">
            Terms
          </a>
        </div>
      </div>
    </footer>
  );
}
