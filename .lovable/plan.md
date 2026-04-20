

# Performance & Layout Consistency Pass

## Goal
Make the portfolio noticeably snappier on mid-range devices without changing the look. The video background stays. The dark glass aesthetic stays. We attack the *invisible* costs: redundant background layers, framer-motion overuse, observer churn, and one botched icon migration.

---

## A. Performance fixes (impact-ranked)

### A1. Kill the duplicate background layer
`Home.jsx` mounts `<AnimatedBackground />` (50 framer-motion dots animating forever) AND `App.jsx` mounts `<VideoBackground />`. Both run continuously, both are `fixed inset-0`. The dots are invisible against the video anyway.
- **Remove** `<AnimatedBackground />` from `Home.jsx`. Keep `VideoBackground` as the sole background.
- Estimated win: ~50 active framer-motion timelines killed, fewer composited layers.

### A2. Reduce `backdrop-blur` paint cost
`backdrop-blur-md` is a per-frame paint over the video — extremely expensive on weaker GPUs. Currently used in `Works`, `ContentHub`, `About`, `Experience`, `Contact` glass surfaces (all stacked over the video).
- Replace `backdrop-blur-md` with `backdrop-blur-sm` on section glass overlays (still gives the frosted look, ~3× cheaper).
- Keep the `bg-black/50` solid overlay (which is what actually carries the readability — blur is mostly aesthetic).
- Drop the second redundant overlay div in `ContentHub` (line 39) — already has `bg-black/20` + blur on line 38; one is enough.

### A3. Works: collapse per-card observers
`Works.jsx` lines 668–686 creates one `IntersectionObserver` per project (N observers). The result (`visibleCards` Set) is computed but **never read** anywhere. Dead weight.
- Delete the `visibleCards` state, the `cardRefs` observer effect, and the unused `isVisible` prop on `ProjectCard`.
- Use the existing single `gridInView` from `useInView` for the only thing that actually matters.

### A4. DrawerCarousel: stop work when off-screen
The drawer carousel runs a 4 s `setInterval` even when its parent is off-screen (mobile cards autoplay is already off — good). The desktop right pane carousel and `CardThumbnail` (rotates on hover) are fine. But `preloadImages` runs on every `images` change and creates `new Image()` objects unconditionally.
- Wrap autoplay interval in a check: pause when `document.hidden` (Page Visibility API). One-line listener.
- Memo the preload to only run once per unique image set.

### A5. Framer-motion: lighten entrance animations
Many components use `initial → animate` with stagger on every list item. After the first paint these create layout work but add no value. The plan's project memory already says "max stagger 0.08s" — Works does `i * 0.06` but capped at 8 (good). About/Experience/Contact stagger isn't capped.
- Cap all map-stagger delays to `Math.min(i, 6) * 0.06` in `About.jsx`, `Experience.jsx`, `Contact.jsx`.
- Replace `motion.div` with plain `div` for purely decorative wrappers that animate just once with `opacity 0→1` (use a single CSS class `.animate-fade-in-up` already defined in `index.css`).

### A6. Finish the abandoned icon migration in `About.jsx`
About still imports `react-icons/fa`, `/si`, `/vsc`, `/tb` — pulls in the entire icon font bundle (~heavy chunk). The earlier migration claimed completion but missed this file.
- Swap About's icons to `lucide-react` per the established mapping in the prior plan (Atom, Wind, Database, Terminal, ShieldCheck, Wrench, FlaskConical, Zap, Code2, etc.).
- Then `react-icons` is only referenced by `Admin.jsx` (route-split, not on the home bundle) — no further home-bundle bloat.

### A7. AnimatedBackground component itself
After A1 it's unused on the home route. Still imported by `Home.jsx`. Remove the import. Leave the file in place (zero cost when unused) in case it's referenced elsewhere.

### A8. Shared `useInView` thresholds
Several components use `threshold: 0.1`. With sections at `min-h-screen`, that's a lot of pixels to wait for. Drop to `0.05` everywhere for consistency (matches what ContentHub/Works already do) so first-paint animations trigger sooner — perceived perf win.

---

## B. Layout consistency review

Audited every section against the project memory rules. Findings + fixes:

### B1. Section container width inconsistency
- About: `max-w-[86rem]`
- Experience: `max-w-[86rem]`
- Works: `max-w-[90rem]` ← outlier
- ContentHub: `max-w-[86rem]`
- Contact: needs verification

**Fix**: Standardize all sections to `max-w-[86rem]`. Works at 90rem creates a noticeably wider block that breaks the column rhythm when scrolling.

### B2. Section padding inconsistency
- About / Experience / ContentHub / Contact: `py-16 sm:py-20`
- Works: `py-20 sm:py-32` ← outlier (2× the vertical breathing room of others)

**Fix**: Bring Works in line: `py-16 sm:py-20`.

### B3. Inner padding inconsistency
- ContentHub: `p-6 md:p-10`
- Works: `p-8 md:p-12` ← outlier

**Fix**: Standardize to `p-6 md:p-10` so the glass cards feel like the same component family.

### B4. Section heading size drift
- ContentHub: `text-3xl md:text-4xl` (Tailwind classes — ~30/36 px)
- Works: `clamp(36px, 6vw, 52px)` (much bigger)
- About: needs check
- Experience: needs check

**Fix**: Use one rule everywhere — `style={{ fontFamily: 'ChocoCooky', fontSize: 'clamp(32px, 4.5vw, 44px)' }}` and remove the Tailwind size classes. This keeps headings in the same visual weight tier across sections (still big, but no longer 52 px on Works vs 36 px on Hub).

### B5. Footer "Lycan-Xx" badge
Currently `fixed bottom-4 right-4 z-50`. Speed Dial is also bottom-right. Verify they don't overlap on mobile (Speed Dial is bigger and takes precedence). If overlap exists, move the badge to `bottom-4 left-4`.

### B6. Today card mobile centering — verify
Per last fix, wrapper is `flex justify-center md:justify-start`. Confirmed in code; no change needed.

---

## C. Files Modified

| File | Change |
|------|--------|
| `src/pages/Home.jsx` | Remove `AnimatedBackground` import & render |
| `src/components/works/Works.jsx` | Remove dead per-card observers + `visibleCards`; drop unused `isVisible` prop; container `max-w-[90rem]→86rem`; padding `py-20 sm:py-32→py-16 sm:py-20`, `p-8 md:p-12→p-6 md:p-10`; heading `clamp(36px,6vw,52px)→clamp(32px,4.5vw,44px)`; carousel autoplay pauses when `document.hidden` |
| `src/components/content/ContentHub.jsx` | `backdrop-blur-md→sm`; remove redundant 2nd overlay div; heading style unified |
| `src/components/about/About.jsx` | Swap react-icons → lucide-react (Atom, Wind, Database, Terminal, ShieldCheck, Wrench, FlaskConical, Zap, Code2); `backdrop-blur-md→sm`; cap stagger; heading style unified |
| `src/components/experience/Experience.jsx` | `backdrop-blur-md→sm`; cap stagger; heading style unified |
| `src/components/contact/Contact.jsx` | `backdrop-blur-md→sm`; cap stagger; heading style unified; verify width = 86rem |
| `src/app/App.jsx` | If "Lycan-Xx" overlaps SpeedDial on mobile, move to `bottom-4 left-4` |

## Do Not Touch
VideoBackground, LoadingScreen, ChocoCooky font, status badge logic, StatusRotator, DrawerCarousel image transition (cosmetic core), data fetching/caching layers, scroll-snap rules, mobile detail overlay, the Works snap-lock split layout itself, `experience.json`, `projects.json`.

