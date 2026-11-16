# phidl — findings log

Site: APK download page for the phidl apps (Phinime, Phikor, Phioskop). Layout/animation lifted from the grail-app.com clone (Vite + React SPA); stack Next.js 15 App Router + TypeScript.

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
- `posters/01..12.jpg` — trending film covers pulled from TMDB's popular page (`media.themoviedb.org/t/p/w500`, `curl -L` is required, plain URL 301s). Static files, no runtime API, no key. Refresh with a new scrape when the row goes stale.
- CSS: `styles/base.css` (fonts + reset), `styles/home.css` (all page modules) copied from `/assets/index-B4wO6xrz.css` and `/assets/HomePage-B7z74ohK.css`.

## Page order (current build)
1. `scene` — spiral `three.js` helix, cards are film posters (`Spiral.tsx`)
2. `header.hero` — nav (phidl wordmark, tagline, Download), h1 letter-staggered, scrim blurs
3. `section2` Chapter 01 About — 4 staggered lines + body, `_in` class added by IntersectionObserver
4. `section5` Chapter 02 Apps — headline + 3 download cards (`dlrow` grid: logo, status chip, tags, full-width APK button)
5. floating Download pill (scrolls to the Chapter 02 cards)

Dropped: footer download block (`SiteFooter.tsx` deleted), stats counters (`Stats.tsx` deleted), footer bottom row, chapter labels (`CT` map gone from `lib/content.ts`). Page ends at the Chapter 02 download cards.

## Download links
Telegram community: `TG` in `lib/content.ts` → `https://t.me/phidl`, rendered as the blue `.tgjoin` button under the Chapter 02 cards.
- Phinime: `APK` = `REPO/latest/download/app-release.apk` — stable, always newest.
- Phioskop: asset is version-named (`Phioskop-vX.Y.Z.apk`), so no stable URL. `Home.tsx` fetches the GitHub API once and swaps the button href to the latest `.apk`. Fallback href is the releases page (`APK_PK`). Breaks if the repo goes private or the asset naming changes.
- App order (card grid): Phinime, Phioskop, Phikor.

## Scroll choreography
All motion is CSS vars written by one scroll handler. Port the formulas, CSS does the rest:
`--pillx --vsheet --vout --forge --vcard --deckout --treveal --dreveal --ink --inkfill --dgrow --hl --phone --rp --vreveal --afade --s5off --s5rot --totemscale --totemlag --g8off --g8rot --g8hl --g8morph --g8par`
Smoothstep helper: `$(a,b,x)=t*t*(3-2t)` with `t=clamp((x-a)/(b-a))`.
Key thresholds on global progress `a = scroll/innerHeight`: ink 1.9→2.6, dgrow 2.1→2.45, hl 2.3→2.72, phone 2.2→2.65, totemscale 7.9→9.1.

## Token / module maps (class names must stay identical)
- page/hero/sections: `bwga5` map (`Q` in bundle). e.g. `_hero_bwga5_173`, `_s2line_bwga5_214`, `_s5row_...`, `_footPin_bwga5_594`.
- voice: `bknov`, totem: `1pamk` (`J`), stats: `10nox` (`Y`), guilds: `194d4` (`X`), footer: `jyv7u`, loader: `o5e3l`, colontitle: `1ghgf`.

## Text content (current, `lib/content.ts`)
- brand `phidl`; repo `https://github.com/nolict/phinime-release/releases` (Phinime = live, `releases/latest`)
- h1 `Three apps, no store`; tagline `Phinime for anime, Phikor for films, Phioskop for cinema. Direct APK builds, straight from the repo.`
- Ch01 lines `No store.` / `No account,` / `no region lock,` / `no waiting.` (marginLeft 42.4/25.1/17/0 vw)
- Ch02 `Take one.` / `Or take` / `all three.`; apps Phinime (live, `#ffcdff`), Phikor (`#e7c9a4`), Phioskop (`#a4d6e7`), both `Coming soon`
- Ch03 counters: apps 3, available 1, in the oven 2, store cut 0
- Ch05 totem (`/3d/*-web.glb`), Ch04 voice sheet, guild wheel, clock/ink overlay: components deleted, CSS still shipped (dead weight, ~90 kB of the copied stylesheet)

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

## Status / gaps
Live: hero + spiral (poster cards), Ch01 lines, app rows with download link, stat counters, footer links, floating pill. `npx tsc --noEmit` clean, `npm run build` passes (244 kB first load).
Dropped on purpose: loader intro, totem 3D, voice/phone sheet, clock + ink overlay, guild wheel, waitlist form/validation, goo canvas, vine garden, peel/forge, Lenis.
Not verified: visuals/FPS in a real browser (no headless chrome on this box); `.s5photo` badge and footer tile are inline-styled to stay inside the copied CSS.
Placeholders to change when real numbers exist: stat values, app descriptions.
