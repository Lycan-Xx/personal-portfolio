

# Portfolio Layout & Readability Analysis + Fix Plan

## Issues Found

### 1. Experience Section — Dark/Unreadable Text
The Experience detail panel uses colors that are nearly invisible against the dark glass background:
- **`text-slate-600`** and **`text-slate-700`** appear throughout (lines 307, 335, 339, 368, 371-374, 429, 589-590) — these are extremely dark grays on a dark background
- Commit hash text: `text-slate-600` / `text-[var(--color-accent)]/50` (line 335-338)
- Period/duration/location meta: `text-[9px] text-slate-600` (lines 368-374)
- Nav counter: `text-[9px] text-slate-700` (line 429)
- Branch map period text: `text-[8px] text-slate-600` (line 307)
- Desktop panel header subtitle: `text-[8.5px] text-slate-700` (line 589)

### 2. Works Section — Unreadable Text
Similar problem with overly dark text:
- Card description: `text-[9px] text-slate-500` (line 281) — borderline readable
- Date/time: `text-[8px] text-slate-700` (lines 306-307) — nearly invisible
- Drawer date: `text-[9px] text-slate-600` (line 428)
- Drawer commit hash: `text-[9px] text-slate-700` (line 394)
- Footer text: `text-[9px] text-slate-700` (line 846-847)

### 3. Section Size Inconsistency
All sections use `min-h-screen` which is correct, but the visual weight varies because:
- **About** has a dense 5-column grid with bio accordion + identity cards + tech stack grid — visually heavy
- **Experience** has a clean 2-panel layout — balanced
- **Works** has a card wall + drawer — visually heavy
- **ContentHub** has minimal content (just tabs + sub-component) — feels lighter
- **Contact** has form + socials — moderate

The `max-w-[86rem]` container is consistent across sections, which is good. The inconsistency is mainly perceived due to varying internal padding and content density.

### 4. ChocoCooky Below 28px Minimum
Several violations of the 28px minimum rule:
- **Experience** role title: `fontSize: 'clamp(18px, 2.5vw, 26px)'` (line 356) — min 18px
- **Experience** mobile card title: `fontSize: '15px'` (line 495)
- **Works** card title: `fontSize: "13px"` (line 272) — severely undersized
- **Works** mobile card title: `fontSize: "16px"` (line 529)
- **Works** drawer title: `fontSize: "clamp(18px, 2vw, 22px)"` (line 421)
- **About** tech category label: `fontSize: '18px'` (line 141)
- **About** trait values: `fontSize: '26px'` (line 226)

---

## Fix Plan

### Fix 1: Experience — Brighten All Dark Text
Replace all `text-slate-600` with `text-slate-400` and all `text-slate-700` with `text-slate-500` throughout Experience.jsx. This brings text from ~25-35% visibility to ~50-60% visibility against the dark glass background.

Specific changes:
- Line 307: `text-slate-600` → `text-slate-400`
- Lines 335, 339: `text-slate-600/500` → `text-slate-400/text-slate-400`
- Lines 368, 371, 374: `text-slate-500/600` → `text-slate-400`
- Line 429: `text-slate-700` → `text-slate-500`
- Lines 589-590: `text-slate-700` → `text-slate-500`

### Fix 2: Works — Brighten All Dark Text
Same treatment across Works.jsx:
- Line 281 card description: `text-slate-500` → `text-slate-400`
- Lines 306-307 date: `text-slate-700` → `text-slate-500`
- Line 394 commit hash: `text-slate-700` → `text-slate-500`
- Line 428 drawer date: `text-slate-600` → `text-slate-400`
- Lines 846-847 footer: `text-slate-700` → `text-slate-500`

### Fix 3: Enforce ChocoCooky 28px Minimum
All ChocoCooky instances must render at 28px or above:
- **Experience** detail panel title (line 356): `clamp(18px, 2.5vw, 26px)` → `clamp(28px, 3vw, 32px)`
- **Experience** mobile card title (line 495): `15px` → `clamp(28px, 5vw, 32px)` (or switch to JetBrains Mono at 13px if 28px is too large for a mobile card — ask user)
- **Works** ProjectCard title (line 272): `13px` → switch to `fontFamily: "JetBrains Mono"` at 13px (too small for ChocoCooky, use mono instead)
- **Works** mobile card title (line 529): `16px` → switch to JetBrains Mono at 14px
- **Works** drawer title (line 421): `clamp(18px, 2vw, 22px)` → `clamp(28px, 3vw, 32px)`
- **About** tech category label (line 141): `18px` → `28px`
- **About** trait values (line 226): `26px` → `28px`

### Fix 4: ContentHub Visual Weight
Add a `bg-black/50` overlay (matching About, Experience, Contact) to ContentHub so all sections have consistent depth:
- Line 38 in ContentHub.jsx: add a second overlay div `<div className="absolute inset-0 bg-black/50 rounded-none md:rounded-3xl" />`

### Fix 5: Section Padding Consistency
All sections already use `py-16 sm:py-20 px-0 md:px-4` — this is consistent. No change needed.

---

## Files Modified

| File | Changes |
|------|---------|
| `Experience.jsx` | Brighten ~10 text color classes; fix ChocoCooky min sizes |
| `Works.jsx` | Brighten ~6 text color classes; fix ChocoCooky min sizes on cards |
| `About.jsx` | Bump tech category label and trait values to 28px minimum |
| `ContentHub.jsx` | Add bg-black/50 overlay for visual consistency |

