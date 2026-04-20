

# Works Redesign — Snap-Lock Split View + Mobile Story Cards

## Goals
1. **Desktop**: Split-pane where the right detail pane "locks" in place (sticky) while only the left list scrolls. Selected project's full content + uncropped image fills the available right-pane space.
2. **Mobile**: Fix the hidden title/initial-text bug and make browsing fun with a horizontal swipeable "story card" carousel.
3. Preserve current aesthetic (glass surface, cyan accent, JetBrains Mono / ChocoCooky, status badges, StatusRotator, DrawerCarousel).

---

## Desktop — Sticky Snap-Lock Split

### Layout
```text
┌────────────────────────────────────────────────────────────────┐
│  < Works />                                                    │
├────────────────────────┬───────────────────────────────────────┤
│ LEFT: scroll snap list │ RIGHT: sticky detail (locked)         │
│  ┌──────────────────┐  │  ┌─────────────────────────────────┐  │
│  │ ▣ Project A   ●  │  │  │  [ FULL UNCROPPED IMAGE ]       │  │
│  │   short blurb    │◀─┤  │   object-contain, fills h-1/2   │  │
│  └──────────────────┘  │  ├─────────────────────────────────┤  │
│  ┌──────────────────┐  │  │  Title (ChocoCooky 36-44px)     │  │
│  │ ▣ Project B   ●  │  │  │  status · date · stack          │  │
│  └──────────────────┘  │  │  Full description (scrolls if   │  │
│  ┌──────────────────┐  │  │  it overflows the bottom half)  │  │
│  │ ▣ Project C   ●  │  │  │  [ Live Demo ] [ Source Code ]  │  │
│  └──────────────────┘  │  └─────────────────────────────────┘  │
└────────────────────────┴───────────────────────────────────────┘
```

### Implementation details
- Container: `flex md:gap-4`, fixed height `h-[calc(100vh-8rem)]` (or `min-h-[760px]`), `overflow-hidden` on the outer split.
- **Left pane** (`w-[42%]`):
  - `overflow-y-auto`, `scroll-snap-type: y mandatory`.
  - Each card wrapper: `scroll-snap-align: start scroll-snap-stop: always`.
  - Cards become **horizontal compact rows** (thumbnail 96×96 left, title + 2-line blurb + status badge right). Removes the cropped 32-h tile look that competes with the right pane.
  - Selected card gets cyan left border (`border-l-2 border-[var(--color-accent)]`) + lifted background.
- **Right pane** (`w-[58%]`):
  - `position: sticky; top: 0; align-self: flex-start;` so it locks visually while the left list scrolls.
  - Layout split vertically: top 50% = image, bottom 50% = scrollable content.
  - Image uses `object-contain` inside a flex container with `bg-slate-900/40` letterbox so screenshots are never cropped regardless of aspect ratio. DrawerCarousel gets a new `fit="contain"` prop and `h-full` mode.
  - Bottom half: independent `overflow-y-auto` with cyan thin scrollbar. Title, status, date, full description, full stack tags, action buttons.
- **Auto-scroll on select**: when user clicks a left card, scroll its element into view with `scrollIntoView({ block: 'start', behavior: 'smooth' })`.
- **Keyboard**: ↑ / ↓ navigate between projects, Esc unselects.

### DrawerCarousel updates
Add `fit` prop (`'contain' | 'cover'`) and `heightClass` prop. Default `h-56` for current call sites; right pane uses `h-full object-contain`.

---

## Mobile — Swipeable Story Cards

The current mobile bug: a long `project.title` plus the rotating status badge wraps and pushes the description below the fold; the image (160px) takes most of the first viewport. Fix + redesign.

### New layout: horizontal snap carousel
```text
   ←  swipe  →
┌──────────────────────────┐
│  Project A     ● active  │  ← title in its own row, never pushed
│  ──────────────────────  │
│  [ image · 16:9 cover ]  │  h-44, contain mode for screenshots
│                          │
│  First 40 words of desc… │
│  read more →             │
│                          │
│  #tag #tag #tag          │
│  [Live]  [Source]        │
│                          │
│  ● ○ ○ ○   1 / 4         │
└──────────────────────────┘
```

- Outer wrapper: `flex overflow-x-auto snap-x snap-mandatory` with each card `min-w-full snap-center`.
- Touch-action `pan-x` so vertical page scroll still works between cards.
- Title sits **above** the image on its own line (full width) so it can never be clipped by the badge. Status badge moves to the top-right corner of the card header row.
- Image height fixed `h-44`, uses `object-cover` for landscape screenshots, `object-contain` if `image.aspectMode === 'contain'` (optional metadata hint, default cover).
- Description: 40-word truncation kept; "read more →" opens existing detail overlay.
- Bottom dot indicator + `1 / N` counter — tap a dot to jump.
- Optional: native scrollbar hidden via `scrollbar-width: none`.

### Why a swipeable carousel is the "fun" part
- One project per screen → focused reading, no long scroll.
- Swipe gesture matches phone-native expectations.
- Snap indicators give a sense of progression ("3 of 7 projects").

---

## Shared / Cleanup
- Add memory note recording the new Works structure.
- Remove the bottom "click any card to inspect" footer line on mobile (it's only relevant on desktop now); keep on desktop.
- Keep existing `MobileProjectCard` API but rebuild internals (still receives `project`, `index`, `inView`, `onOpenDetail`).
- Mobile detail overlay (`mobileSelected`) untouched — opened by "read more".

---

## Files Modified

| File | Change |
|------|--------|
| `src/components/works/Works.jsx` | Rebuild desktop split (sticky right, snap-scroll left, compact list rows). Rebuild `MobileProjectCard` as full-width snap card; wrap mobile section in horizontal snap carousel with dot pager. Add keyboard nav + scrollIntoView on select. Update `DrawerCarousel` with `fit` + `heightClass` props. |
| `src/index.css` | Add `.no-scrollbar` utility for the mobile horizontal carousel (hide native scrollbar). |
| `mem://features/works-layout` | New memory: documents desktop sticky split + mobile snap carousel pattern. |
| `mem://index.md` | Add reference to the new memory file (preserve all existing content). |

## Do Not Touch
StatusRotator behavior, status colors, project data shape, useProjects hook, mobile detail overlay component, ChocoCooky font, glass overlay treatment, section heading.

