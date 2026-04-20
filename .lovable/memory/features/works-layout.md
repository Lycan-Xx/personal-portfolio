---
name: Works section layout
description: Desktop sticky split-view + mobile horizontal snap carousel pattern for the Works section
type: feature
---
# Works layout

## Desktop (md+)
- Two-pane split inside `border border-[var(--color-accent)]/15` rounded container.
- Height: `calc(100vh - 12rem)`, min 700px, max 900px.
- LEFT (`w-[42%]`): vertical scroll list with `scrollSnapType: y mandatory`. Each item is a compact horizontal row (80×80 thumb + title + 2-line blurb + status badge). Selected item gets cyan left border (`border-l-2`) + raised bg.
- RIGHT (`w-[58%]`): locked detail pane rendering `DetailDrawer`. Contains the carousel (object-contain, letterboxed) + scrollable content area.
- Auto-scrolls left list to selected via `scrollIntoView({ block: 'nearest' })`.
- Keyboard: ↑/↓ navigate projects, Esc clears selection.

## Mobile (<md)
- Horizontal snap carousel: `flex overflow-x-auto snap-x snap-mandatory` with each card `snap-center w-full`.
- Hidden native scrollbar via `.no-scrollbar` utility (defined in `src/index.css`).
- Title sits **above** the image (separate row) so the rotating status badge can never push it below the fold.
- Image fixed `h-44`, `object-cover` by default (or `object-contain` if `project.imageFit === 'contain'`).
- 40-word description truncation with "read more →" button that opens existing mobile detail overlay (`mobileSelected` state).
- Below carousel: dot pager + `N / total` counter. Tapping a dot scrolls to that project.

## DrawerCarousel API
`<DrawerCarousel images title autoPlay fit heightClass />`
- `fit`: `'contain' | 'cover'` (default `'contain'`)
- `heightClass`: tailwind height class (default `'h-56'`)

## Do not touch
StatusRotator behavior, status colors, project data shape, useProjects hook, mobile detail overlay (`DetailDrawer` reuse), ChocoCooky font, glass overlay treatment, section heading.