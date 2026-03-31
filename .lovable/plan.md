

# Portfolio Redesign v3 — Implementation Plan

## Build Fix (Prerequisite)
The build fails because Lovable expects a `build:dev` script in the root `package.json`. Add `"build:dev": "cd frontend && npm run build"` to resolve this before any other work.

---

## Phase 1: Structural Changes

### 1. Fix root `package.json` build script
Add `"build:dev"` script pointing to the frontend build.

### 2. Reorder sections in `App.jsx`
Change render order to: **Hero → About → Projects → ContentHub → Contact**. Lazy-load all below-fold sections. Remove standalone `BlogFeed` and `YouTubeFeed` imports.

### 3. Create `ContentHub.jsx`
New tabbed container component with three tabs: `< GitHub />`, `< Writing />`, `< Videos />`. Each tab lazy-imports its respective component. GitHub tab is default. Tab labels in ChocoCooky at 28px+. Active tab: cyan underline. Includes a `TabSkeleton` fallback (3 pulsing cards).

### 4. Remove `<GitHubStats />` from `About.jsx`
Line 184 currently renders it inside About. Remove that import and usage.

---

## Phase 2: Visual & Typography Refinements

### 5. Hero (`Content.jsx`) updates
- Replace bio text with: *"I build things end to end — fintech wallets, campus marketplaces, Linux tools. Based in Adamawa, Nigeria. Always shipping."*
- Bio font: JetBrains Mono, `text-sm`, `leading-relaxed`, `text-slate-300`
- Add local radial-gradient scrim behind the left text column only (CSS pseudo-element)
- Ensure ChocoCooky usage is 28px+ (current hero name is fine at 3xl+)

### 6. Today card (`Today.jsx`) — surface refinement only
- Change card background to `rgba(18, 26, 42, 0.55)` with `border: 1px solid rgba(66, 188, 188, 0.25)` and `backdrop-filter: blur(12px)`
- Keep all dimensions identical

### 7. About (`About.jsx`) visual cleanup
- Section wrapper: add `bg-black/50` overlay
- Skill card borders: `border-cyan-400/20` (remove orange)
- Remove decorative blobs (lines 189-190) and SVG grid pattern (lines 193-207)
- Glassmorphism: reduce to `bg-black/20 backdrop-blur-md`
- Heading: `< About Me />` format in ChocoCooky at 36px

### 8. Works (`Works.jsx`) visual cleanup
- Mobile card height: 280px below 767px
- Card border: `border-white/8` default, `hover:border-cyan-400/35`
- Tech tags: `bg-cyan-400/8 text-cyan-400/65 text-xs font-mono px-2 py-0.5 rounded`
- Carousel dots: `w-2.5 h-2.5`
- Remove decorative blobs (lines 581-582) and SVG grid (lines 585-617)
- Glassmorphism: reduce to `bg-black/20 backdrop-blur-md`

### 9. Contact (`Contact.jsx`) visual cleanup
- Social buttons: `border-white/10 hover:border-cyan-400/45`
- Email: add click-to-copy with inline "✓ Copied" fade (1500ms)
- Remove decorative blobs (lines 237-238) and SVG grid (lines 241-255)
- Glassmorphism: reduce to `bg-black/20 backdrop-blur-md`

### 10. GitHub Stats color unification
- All `StatCard` accent colors → `#22d3ee` (cyan). Remove green, amber, purple accents
- Remove emoji icons from stat cards
- Private repo: replace 🔒 with `[private]` text

### 11. Blog/YouTube visual tweaks
- BlogFeed: enforce `aspect-video object-cover` on thumbnails; tag style update
- YouTubeFeed: replace `YouTubeBadge` with monochrome `▶` glyph; remove red accent lines

---

## Phase 3: Performance & Cleanup

### 12. Navbar active state
- Active link: `text-cyan-400` with `border-b-2 border-cyan-400` (remove pill/bg treatment)
- Mobile hamburger: ensure 44x44px touch target

### 13. Scroll snap mobile disable
Add CSS rule to disable `scroll-snap-type` below 767px.

### 14. Animation efficiency
- Add `viewport={{ once: true }}` to all Framer Motion `whileInView` triggers
- Audit `useInView` hooks: change `triggerOnce: false` to `true` where appropriate (About section heading, Works section heading)
- Cap `staggerChildren` at 0.08

### 15. Dead code & console.log removal
- Remove all `console.log` from `BlogFeed.jsx`, `VideoBackground.jsx`
- Remove commented-out form JSX from `Contact.jsx`
- Clean up unused imports

### 16. CSS updates (`index.css`)
- Add mobile scroll-snap disable rule
- Add hero scrim utility class
- Reduce global glassmorphism from `bg-black/40 backdrop-blur-xl` to `bg-black/20 backdrop-blur-md`

---

## Files Summary

| File | Action |
|------|--------|
| `package.json` (root) | Add `build:dev` script |
| `App.jsx` | Reorder sections, lazy-load, add ContentHub |
| `ContentHub.jsx` | **Create** — tabbed container |
| `Content.jsx` | Bio rewrite, scrim, font enforcement |
| `Today.jsx` | Surface treatment only |
| `About.jsx` | Remove GithubStats, blobs, grid; reduce glass opacity |
| `Works.jsx` | Mobile height, borders, remove blobs/grid |
| `Contact.jsx` | Click-to-copy email, remove blobs/grid, border fix |
| `GithubStats.jsx` | Unify colors to cyan, remove emoji |
| `BlogFeed.jsx` | Thumbnail normalization, remove console.logs |
| `YoutubeFeed.jsx` | Monochrome badge, remove red accents |
| `Navbar.jsx` | Active link underline style |
| `index.css` | Mobile snap disable, glass reduction |

---

## Do Not Touch
Video background, loading screen, "Lycan-Xx says hi" footer, ChocoCooky font files, 3D flip animation, status badge system, data fetching/caching logic, Speed Dial, Resume button.

