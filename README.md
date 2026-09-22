# KŌKAI — Digital Voyages

KŌKAI is a cinematic one-page digital experience for an independent creative studio. It presents the studio as a place "between signal and silence" — dark, editorial, film-like — and walks a visitor from intro to manifesto, selected work, method, a live signal monitor, and contact in a single scroll.

No backend. No router. All state lives in the browser (React state + URL hash for the active voyage).

## Overview

**Concept:** a portfolio-as-voyage. Six stations (`index / manifesto / voyages / method / signal / contact`) form one continuous narrative: arrive, read the position, browse four works, see how the studio works, play with a living interface, then start a conversation.

**Visual direction:** near-black void (`#070708`) against warm paper (`#f1eee8`), vermillion signal accents, oversized Playfair Display headlines, mono metadata labels, film grain over everything, and a large ambient orb with orbital rings behind the hero.

**Intended user experience:** slow and deliberate. A 000→100 calibrating intro, smooth scroll between sections, motion that reacts to pointer and scroll position, and a contact flow that feels like sending a transmission. Reduced-motion users get the same content without the animation.

## Features

- **Intro overlay with 000→100 progress:** full-screen `IntroOverlay` counts 000–100 over ~1.2s with an eased `requestAnimationFrame` loop, a `CALIBRATING THE HORIZON` bar, then slides up (`translateY(-100%)`). Reduced-motion users skip to a short fade.
- **Fixed header and scroll-spy navigation:** `FixedHeader` stays pinned with wordmark, numbered desktop links, and an availability pill. An `IntersectionObserver` with `rootMargin: '-40% 0px -55% 0px'` tracks the visible section and highlights the active link (`aria-current="page"`).
- **Cinematic hero:** full-viewport `#index` section with giant background `KŌKAI` word, `TOKYO — YEKATERINBURG` meta row, Playfair headline ("We build worlds between *signal* and silence"), two CTAs, and a `SCROLL TO ENTER` indicator.
- **Canvas/WebGL-inspired ambient orb:** `AmbientOrb` renders a layered planet (CSS radial gradients + rim light + noise) with a 2D-canvas particle field (70 orbiting dots) on top. Canvas is sized with `devicePixelRatio` (capped at 2) and pauses when the hero leaves the viewport or the tab is hidden.
- **Orbital rings:** inline SVG ellipses rotate with `orbRot` / `orbRotR` keyframes and carry `IMAGE / CODE / SOUND / MOTION` mono labels.
- **Pointer parallax:** hero `pointermove` eases a target/actual offset (`px += (tx - px) * 0.06`) that shifts the orb center, particle drift, and highlight position (`--hx` / `--hy`).
- **Scroll-linked motion:** `scrollY` offsets the orb stage (`translate(-50%, calc(-50% + …))`), sinks the particle center, and drives the process timeline progress plus the global page-progress rail.
- **Word-by-word statement reveal:** the manifesto sentence ("Technology is not the spectacle. The feeling is.") splits into words; an `IntersectionObserver` (threshold 0.35) adds `.visible` and each word fades up with a 70ms stagger (`blur(8px)` → `blur(0)`).
- **Interactive voyages selector:** left `role="listbox"` with four `role="option"` buttons (SŌMA / NAMI / KURO / HANA); click or focus selects; the right preview cross-fades (`.voyage-stage.active`). Active selection is deep-linked via `#voyage-<id>` with `history.replaceState`, and restored from `window.location.hash` on load.
- **SŌMA, NAMI, KURO, and HANA visual previews:** pure CSS/SVG scenes — SŌMA (warm organic blobs + wave-line SVG), NAMI (horizontal flow lines + indigo blob), KURO (18 animated equalizer bars), HANA (drifting petals + botanical line SVG). Each shows keywords, subtitle, description, category/year tags, and its accent color.
- **Keyboard navigation for voyages:** the listbox handles `ArrowDown`/`ArrowRight` (next), `ArrowUp`/`ArrowLeft` (previous, wrapping), `Enter` (announces the voyage via toast), `Escape` (blur). A hint line reads `USE ↑ ↓ TO NAVIGATE — ENTER TO OPEN`.
- **Process timeline:** `LISTEN / FRAME / COMPOSE / RELEASE` steps beside a vertical rail; scroll position fills the vermillion progress line and activates steps (`translateX(8px)` + marker dot).
- **Animated signal monitor:** `#signal` section with a 2D-canvas waveform (grid + glowing stroke), live `SIGNAL %` and `FREQUENCY Hz` readouts jittered on an 80ms interval, and pointer-driven distortion (`distort.current` bends the wave near the cursor).
- **AMBIENT, TENSION, and RESONANCE modes:** segmented `aria-pressed` buttons switch `SIGNAL_CONF` — ambient (432Hz / 68% / LISTENING / mist-blue), tension (587Hz / 86% / HEIGHTENED / vermillion), resonance (528Hz / 77% / ALIGNED / green). Each mode changes color, wave speed/amplitude/jag, and status label.
- **Pause/resume signal behavior:** `Pause signal` / `Resume signal` toggle (`aria-pressed`) freezes the tick interval and waveform advance, removes glow (`shadowBlur = 0`), and flips status to `PAUSED`.
- **Contact modal:** `ContactModal` (`role="dialog" aria-modal="true"`) with name, email, project kind, budget pills, and details fields. Opens from hero or contact section, locks body scroll, focuses the name field, closes on backdrop click, Cancel, or Escape, and returns focus to the trigger.
- **Client-side form validation:** on submit, name ≥ 2 chars, email regex (`^[^\s@]+@[^\s@]+\.[^\s@]+$`), details ≥ 10 chars. Errors render inline with `aria-invalid`, `aria-describedby`, and `role="alert"`. `noValidate` disables native bubbles so the custom messages are the source of truth.
- **Success state:** valid submit swaps the form for `TRANSMISSION COMPLETE / Message received`, fires a toast, and resets the fields on close.
- **Mobile navigation overlay:** under 900px the desktop nav hides and a `MENU` pill opens a full-screen dialog (`#nav-overlay`) with staggered Playfair links, focus moved inside, Tab focus-trapped, and Escape/body-lock handling.
- **Custom cursor on pointer devices:** after the intro, `CustomCursor` shows a vermillion dot + trailing ring + mode label (`MOVE / ENTER / OPEN / CLOSE`). It lerps (`0.16` / `0.1`) via `requestAnimationFrame`, reads the nearest `[data-cursor]` ancestor, hides on `pointer: coarse`, and applies `body.fine-pointer * { cursor: none }` only on fine pointers.
- **Fixed progress rail:** right-edge `nav[aria-label="Page progress"]` with six numbered buttons and a vermillion fill whose height grows with page scroll (`140 + progress * 120` px). Hidden on mobile.
- **Grain overlay:** fixed full-screen `div.grain-overlay` with an inline SVG `feTurbulence` data-URI, `opacity: 0.035`, `mix-blend-mode: screen`, `pointer-events: none`.
- **Reduced-motion support:** `useReducedMotion()` mirrors `prefers-reduced-motion`, toggles `body.reduce-motion`, short-circuits the intro, freezes particle drift/wave advance/orbit rotation, and CSS `@media (prefers-reduced-motion: reduce)` plus `body.reduce-motion` rules collapse all transitions/animations and force `.word-reveal` / `.reveal` visible.
- **Responsive layout:** fluid `clamp()` type, `--pad-x` / `--max-w` tokens, tablet range (768–1199px) narrows grids and orb, ≤900px swaps to the menu button, ≤767px stacks all grids to one column, docks the orb inline at 300px, and hides the rail and orbit labels.
- **Accessibility behavior:** skip link, semantic landmarks (`header / nav / main / section / footer`), labelled sections, listbox/option semantics with `aria-activedescendant`, dialog semantics with focus management, labelled form fields with error associations, `aria-live` regions for preview/monitor/toasts, `focus-visible` outlines, 44px+ touch targets, and touch-safe pointer handlers (`pointermove` with coarse-pointer guards).

## Tech Stack

What is actually in this repo (see `package.json`, `src/`, `index.html`):

- **React 18.3.1** (`react`, `react-dom`) — all UI is function components + hooks (`useState`, `useEffect`, `useMemo`, `useRef`, `useCallback`). Entry is `src/main.tsx` with `React.StrictMode`.
- **TypeScript 5.5.3** — strict mode (`strict: true`, `noFallthroughCasesInSwitch`), `jsx: react-jsx`, `noEmit`. Union types model voyages, signal modes, and section ids.
- **Vite 5.4.0** (`vite`, `@vitejs/plugin-react`) — dev server on `:5173`, production bundling, `vite-env.d.ts` references `vite/client`.
- **CSS (no framework)** — one hand-written stylesheet (`src/index.css`, ~340 lines): custom properties, flex/grid layouts, keyframes, responsive queries, reduced-motion overrides. No Tailwind, no component library, no chart library.
- **Canvas 2D** — `canvas.getContext('2d')` in two places: hero particle orb and signal waveform monitor. No WebGL, no Three.js.
- **SVG** — orbital rings/labels, SŌMA wave paths, HANA botanical drawing, and film-grain `feTurbulence` data-URIs. All inline or CSS-embedded.
- **IntersectionObserver** — hero visibility gating, statement word-reveal, generic `useReveal`, footer giant-word reveal, and global scroll-spy.
- **requestAnimationFrame** — intro counter easing, orb particle loop, signal waveform loop, custom-cursor lerp loop. Intervals (`80ms` signal tick, toast auto-dismiss) complement it; there is no audio.
- **Browser-local state only** — React state + `window.location.hash` (`#voyage-<id>`) persisted via `history.replaceState`. No backend, no fetch, no router, no `localStorage`.
- **Google Fonts** — `@import` in `src/index.css`: `DM Mono` (labels/meta), `Manrope` (body/UI), `Playfair Display` (editorial headlines), with system-font fallbacks.

## Project Structure

Real layout of this repository:

```text
KŌKAI/
├── index.html          # HTML shell: <div id="root">, module script to /src/main.tsx, meta + title
├── package.json        # name, scripts (dev/build/preview/typecheck/lint), react + vite deps
├── package-lock.json   # locked dependency tree
├── tsconfig.json       # strict TS config, jsx react-jsx, include: ["src"]
├── vite.config.ts      # vite + @vitejs/plugin-react, dev server port 5173
├── .gitignore          # node_modules, dist/build, logs, env/secrets, editor/OS, caches
├── README.md           # this file
├── dist/               # generated by `npm run build` (ignored by git, not committed)
└── src/
    ├── App.tsx         # the entire experience: all sections, overlays, modal, cursor, toasts
    ├── main.tsx        # React entry: createRoot + StrictMode + index.css import
    ├── index.css       # design system + all component/section/responsive/motion styles
    └── vite-env.d.ts   # vite client types reference
```

- **`src/App.tsx`** (~937 lines): single-file app. Defines `VoyageId / SignalMode / SectionId` types, `VOYAGES / NAV / RAIL / STEPS / SIGNAL_CONF` data, hooks (`useReducedMotion`, `useReveal`, `scrollToId`), and components (`IntroOverlay`, `FixedHeader`, `AmbientOrb`, `HeroSection`, `StatementSection`, `VoyagePreview`, `VoyagesSection`, `ProcessSection`, `SignalSection`, `ContactModal`, `ContactSection`, `Footer`, `ProgressRail`, `NavigationOverlay`, `CustomCursor`, `ToastLayer`, `GrainOverlay`) composed by `App` with scroll-spy, page progress, voyage state, menu/modal state, and toasts.
- **`src/index.css`**: design tokens + every visual rule (intro, header, hero, orb, statement, voyages, process, signal, contact, footer, rail, overlay, modal, cursor, toasts, reveal helpers, responsive, reduced motion).
- **`index.html`**: minimal shell; the app mounts into `#root`.
- **`package.json`**: scripts and dependency manifest (see Installation / Verification).
- **`dist/`**: production output (`index.html` + hashed `assets/`) created by `vite build`. It is git-ignored and never committed here.

There is no `public/` directory in this snapshot; static assets are inline (SVG data-URIs) or loaded from Google Fonts CDN.

## Installation

Prerequisites: Node.js 18+ and npm.

```bash
npm install
```

## Development

```bash
npm run dev
```

Starts the Vite dev server (configured port **5173**):

```text
http://localhost:5173/
```

Hot reload is on. The active voyage deep-link (`#voyage-soma`, `#voyage-nami`, …) survives reloads.

## Production Build

```bash
npm run build
```

Runs `tsc --noEmit && vite build`. Output goes to `dist/` (clean static files ready to serve: `dist/index.html` plus hashed JS/CSS in `dist/assets/`). Preview it locally with:

```bash
npm run preview
```

## Verification

All three commands exist in `package.json` and pass on a clean checkout:

```bash
npm run typecheck
npm run lint
npm run build
```

- `typecheck` → `tsc --noEmit`
- `lint` → `tsc --noEmit` (type-level lint; no ESLint config in this repo)
- `build` → `tsc --noEmit && vite build`

## Interaction Guide

- **Desktop navigation:** click a numbered header link (Index / Voyages / Method / Signal / Contact) to smooth-scroll; the active section glows vermillion in the header and the right progress rail.
- **Mobile menu:** tap `MENU` (visible ≤900px) → full-screen overlay → tap a large link to jump; `CLOSE ✕` or `Escape` dismisses. Focus is trapped while open.
- **Voyage selector:** click (or Tab-focus) a `SŌMA / NAMI / KURO / HANA` row to swap the preview panel. The URL updates to `#voyage-<id>`; sharing that URL restores the same voyage.
- **Voyage keyboard controls:** focus the voyage list, then `↑`/`↓` (or `←`/`→`) to cycle with wrap-around, `Enter` to announce the current voyage as a toast, `Escape` to leave the list.
- **Signal modes:** press `AMBIENT` / `TENSION` / `RESONANCE` to retune frequency, signal %, status word, wave color/speed/shape. Each switch fires a toast (`Signal mode — <mode>`).
- **Pause/resume:** press `Pause signal` to freeze the waveform and readouts (`STATUS: PAUSED`); press `Resume signal` to restart. Moving the pointer across the waveform bends it while active.
- **Contact form:** press `Begin a conversation` (hero or contact section) → fill name / email / kind / budget / details → `Send inquiry`. Inline errors explain fixes; valid submit shows `TRANSMISSION COMPLETE` with a `Close` button.
- **Escape key:** closes the topmost layer — contact modal first, then mobile menu. The voyage list uses `Escape` to blur instead.
- **Reduced-motion behavior:** with `prefers-reduced-motion: reduce`, the intro shortens, orb/wave/cursor animation halts, orbit SVG rotation stops, scroll becomes instant (`scroll-behavior: auto`), and all reveals render in their final state.

## Design System

- **Primary colors:** `--void #070708` (page), `--void-soft #0d0d10` (signal section), `--ink #111116` (preview base), `--paper #f1eee8` (light text / contact paper), `--paper-muted #b7b2aa`, `--paper-dim #77736d`, `--vermillion #e65d3c` (signal/CTA/active), `--vermillion-soft #ff8b68`, `--indigo #6f76ba` (NAMI), `--mist-blue #8da9c7` (ambient mode), `--gold #c8a36a`, `--success #b7e58a` (resonance/available). Voyage accents: SŌMA `#e65d3c`, NAMI `#6f76ba`, KURO `#8da9c7`, HANA `#b7e58a`.
- **Typography:** `Manrope` — body, UI, wordmark; `Playfair Display` — hero, statement, section, preview, overlay, contact, footer headlines; `DM Mono` — all labels, meta, counts, timeline indices, monitor readouts, rail, toasts. Headlines use `clamp()` fluid sizes (e.g. hero `2.6rem → 5.2rem`).
- **Easing:** `--ease-main: cubic-bezier(0.16, 1, 0.3, 1)` (hovers, reveals, modal, toasts), `--ease-slow: cubic-bezier(0.22, 1, 0.36, 1)` (scroll cue, giant footer word). Intro exit is `transform .9s var(--ease-main)`.
- **Responsive breakpoints:** `768–1199px` tablet (tighter padding, narrower grids, smaller orb); `≤900px` menu swap (desktop nav off, `MENU` pill on, availability text hidden); `≤767px` mobile (single-column grids, inline 300px orb, hidden rail, reduced section padding). Base tokens: `--header-h: 84px` (68px mobile), `--pad-x: 48px` (32px tablet, 20px mobile), `--max-w: 1440px`.
- **Visual principles:** darkness with one warm light; hairline borders (`rgba(241,238,232,.08/.16)`); pill buttons and 2–6px cards; generous whitespace (120px section padding, 80px mobile); motion always eased and interruptible; grain unifies every surface; 44px minimum touch targets.

## Accessibility

- **Semantic landmarks:** `header`, `nav` (primary / menu / footer / progress), `main#main`, labelled `section`s, `footer`, plus a `Skip to content` link.
- **Keyboard navigation:** all actions are native buttons/links; voyage listbox supports arrows + Enter + Escape; Tab order is logical; mobile overlay traps Tab while open.
- **Focus handling:** `:focus-visible` vermillion outline; modal moves focus to the first field and returns it to the trigger on close; menu moves focus inside; `aria-activedescendant` tracks the voyage option.
- **Labels:** icon-only or terse controls carry `aria-label`s (wordmark, availability, menu, cursor-agnostic CTAs, dismiss buttons); form fields use real `<label>`s; budget pills and mode buttons use `aria-pressed`; decorative layers use `aria-hidden`.
- **Dialog semantics:** both overlays use `role="dialog" aria-modal="true"` with labelled titles; backdrop click and `Escape` dismiss; body scroll locks (`body.locked`) while open.
- **Reduced motion:** `prefers-reduced-motion` media query + `body.reduce-motion` class + `useReducedMotion()` hook gate every animation loop and reveal; content never depends on motion to be readable.
- **Touch behavior:** 44px+ targets, `pointer: coarse` disables the custom cursor and restores native cursors, pointer handlers are passive where possible, layouts collapse to single column with no horizontal scroll (`overflow-x: hidden`).

## Deployment

`npm run build` emits plain static files, so any static host works. No server config is required.

- **GitHub Pages:** build, then serve `dist/` (e.g. via the `peaceiris/actions-gh-pages` action or `gh-pages` branch). For a project site, set Vite `base` to `/<repo>/` if assets 404.
- **Vercel:** import the repo, framework preset `Vite`, build command `npm run build`, output dir `dist`.
- **Netlify:** build command `npm run build`, publish directory `dist`. No functions or redirects needed.
- **Any static host:** upload `dist/` to Cloudflare Pages, S3 + CloudFront, nginx, etc. and serve `index.html` for `/`.

No deployment config is committed here — add only what your chosen host needs.

## License

Personal/portfolio work — all rights reserved unless a `LICENSE` file is added later. Contact the studio before reusing the design, copy, or code.
