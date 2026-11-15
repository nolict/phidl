# Grail clone — findings log

Target: https://grail-app.com (Vite + React SPA). Clone stack: Next.js 15 App Router + TypeScript.

## Rules
- Commit messages: Conventional Commits, English, no scope (e.g. `feat: add totem selector`).
- Log every discovery here the moment it is made. No findings kept only in chat.
- CSS is reused verbatim from the target (module-hashed class names), so DOM class names must match the maps below.
- No new dependencies unless the effect truly needs it.

## Assets (already downloaded, `public/`)
- fonts: `fonts/Switzer-Variable.woff2` (UI), `fonts/PPPangaia-Light.woff2` (display)
- `Logo.svg`, `arrow.svg`, `grail-mark.svg`, `loader-mark.svg`, `accept-phone.webp`
- `patterns/*.webp` (5 guild emblems 845x836 + `-160.webp` thumbs, 4 `stats-bg-{str,int,char,wis}.webp`)
- `story/01..05.jpg`, `mobile/deck-hero.webp`, `mobile/forge.webp`
- CSS: `styles/base.css` (fonts + reset), `styles/home.css` (all page modules) copied from `/assets/index-B4wO6xrz.css` and `/assets/HomePage-B7z74ohK.css`.

## Home page section order (from `HomePage-SelUD7Yz.js`)
1. loader overlay (`Jn`) + spiral `three.js` scene (`tt` = `$e`, memo)
2. `header.hero` — nav (logo, tagline, Join Waitlist), h1 letter-staggered, scrim blurs
3. `section2` Chapter 01 About Problem — pinned staggered lines + body
4. `section3` — empty spacer (vine)
5. `section4` Chapter 02 About Timer — accept overlay, clock 48h, word reveal, ink reveal
6. `section5` Chapter 03 About Journey — headline + 5 "chance" rows with photos
7. Chapter 04 voice (`_t`) — phone mockup, mic, vine garden canvas
8. Chapter 05 totem (`wt`) — 3D totem stage + 6 pills (Chapter 05) 
9. Chapter 06 stats (`Ht`) — goo canvas + 4 stat tiles
10. Chapter 07 guilds (`tn`) — rotating crest wheel, mouse distortion
11. footer (`Pn`) — email waitlist with live validation bubbles

## Scroll choreography
All motion is CSS vars written by one scroll handler. Port the formulas, CSS does the rest:
`--pillx --vsheet --vout --forge --vcard --deckout --treveal --dreveal --ink --inkfill --dgrow --hl --phone --rp --vreveal --afade --s5off --s5rot --totemscale --totemlag --g8off --g8rot --g8hl --g8morph --g8par`
Smoothstep helper: `$(a,b,x)=t*t*(3-2t)` with `t=clamp((x-a)/(b-a))`.
Key thresholds on global progress `a = scroll/innerHeight`: ink 1.9→2.6, dgrow 2.1→2.45, hl 2.3→2.72, phone 2.2→2.65, totemscale 7.9→9.1.

## Token / module maps (class names must stay identical)
- page/hero/sections: `bwga5` map (`Q` in bundle). e.g. `_hero_bwga5_173`, `_s2line_bwga5_214`, `_s5row_...`, `_footPin_bwga5_594`.
- voice: `bknov`, totem: `1pamk` (`J`), stats: `10nox` (`Y`), guilds: `194d4` (`X`), footer: `jyv7u`, loader: `o5e3l`, colontitle: `1ghgf`.

## Text content (verbatim from bundle)
- h1: `Reclaim your life`; tagline: `One real-world quest a day. Four stats that go up when you do things out in the world.`
- Ch01 lines: `Everyone's out` / `living. You're` / `watching them do it` / `on a screen.` (marginLeft 42.4/25.1/17/42.4 vw)
- Ch01 body: "Same week, over and over, until you can't tell them apart. ..."
- Ch02: `Quest accepted.` / `Clock’s running.`, lead + para (48h rationale), clock 48:00:00
- Ch03 head: `It starts as one quest.` + `It rarely stays that way.` + 5 chances list
- Ch04: `Tell future self` / `And seekers after`
- Ch05: six totems Duck/Knight, Cat/Witcher, Bear/Bard, Rat/Paladin, Frog/Mage, Penguin/Thief (3D `/3d/*-web.glb`)
- Ch06: four stats STR 52 WIS 64 INT 76 CHA 88, colors: STR #ff6b4a, WIS #4ecb8a, INT #5b8def, CHA (guild Wind Shifters)
- Ch07: guilds Tempers/Brotherhood/Keepers/Seekers/Wind Shifters; head lines `Pick your guilds.` `They define` `your quests`
- Footer email validation messages (noat/atonly/nodot/space/multiat/mash/invalid) copied into `lib/content.ts`.

## Perf fixes (v1.1)
- All three.js / WebGL loops pause via IntersectionObserver when offscreen; before this, spiral + totem GLB + totem fbm backdrop rendered forever, which read as "memory leak" jank around Chapter 06.
- `useScrollDriver` (Home.tsx) measures section offsets once (`measure()` + ResizeObserver + `document.fonts.ready`); per-frame `offsetTop`/`getBoundingClientRect` reads were causing a forced reflow every frame.
- Spiral entrance is a 3D intro (`intro` 0→1 over 1.6s): cards fly out from centre, staggered `abs(rel)/mid*0.45`, scale 0.55→1. Canvas fade is only 0.2s so the intro reads, not a double fade.

## Build notes (learned the hard way)
- TypeScript must be v5; Next 15.5 rejects TS7 ("native compiler, no JS compiler API").
- `next.config.ts` fails to load on this combo → use `next.config.mjs`.
- `@/*` path alias did not resolve in this setup → components use relative imports (`../lib/content`).
- CSS side-effect import needs `types/globals.d.ts` with `declare module "*.css"`.
- Site body sets `overflow:hidden` (custom scroller). Clone overrides to `overflow-y:auto` in `app/globals.css` and drives the same CSS vars from native scroll.

## Decisions
- Reuse target CSS files instead of rewriting styles (fastest path to pixel parity, and class names are hashed so no collisions).
- Port effects by driving the same CSS custom properties from a single `useScrollDriver` hook.
- Totem models are meshopt-compressed GLB; needs `meshopt_decoder` + `GLTFLoader`.
- Dev: `npm run dev` → http://localhost:3000. Build passes.

## Status / gaps (v1)
Ported: hero + spiral card helix (three.js, same shaders/constants), hero letter stagger, Ch01 pinned lines, Ch02 clock + ink overlay, Ch03 chance rows, Ch04 phone sheet (static), Ch05 totem (GLB + fbm backdrop shader + selector), Ch06 stats with counters, Ch07 guild wheel (scroll velocity + pointer push), footer waitlist with live email validation.
Not ported yet: loader intro, vine-garden canvas, peel/forge transition, goo canvas, per-bubble text physics, Lenis smoothing, mobile (`--vsheet`) variants.
