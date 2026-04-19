
## Plan

A focused refactor across 7 areas. Two new JSON files, one new shared icon mapping, and edits to ~6 components. No backend changes.

### 1. Icon library swap → Hugeicons
- Add `hugeicons-react` (free, distinctive multi-style set).
- Create `src/utils/iconMap.jsx` exporting a small set of named icons we actually use (Github04, LinkedIn02, Twitter, Discord, Linux, ShieldEnergy, FlaskTube, Code, ServerStack02, Chrome, Reactjs, Tailwindcss, GitBranch, Clock04, ArrowExpand, Cancel01, ArrowLeft02, ArrowRight02, ExternalLink, Image01, FloppyDisk, Add01, Delete02, Edit02, Upload04, Tag01, Box01, Alert02, etc.).
- Replace `react-icons/fa`, `react-icons/si`, `react-icons/vsc`, `react-icons/tb` imports across: `About.jsx`, `Works.jsx`, `SocialLinks.jsx`, `SpeedDial.jsx`, `Admin.jsx`. Keep `react-icons` installed (BlogFeed/YoutubeFeed don't use it; nothing else breaks).

### 2. About section refactor
- Rename heading: `< About Me />` → `< Who Am I />`.
- Delete the right-hand "Identity card" column entirely (Currently card + Philosophy card + their tags).
- Convert the Bio (about.md) card to span the **full width** (`lg:col-span-5`), and append the 5 hashtag badges (`#linux #oss #backend #infosec #chemistry`) as a footer row inside about.md, just below the bio blocks.
- Tech Arsenal section stays unchanged.

### 3. Experience → editable + JSON-driven
- Create `src/components/experience/experience.json` with two arrays: `experiences` and `education` (move existing hardcoded data verbatim).
- Refactor `Experience.jsx` to import this JSON instead of inline arrays.
- Extend `Admin.jsx` with a tab switcher at the top: **Projects | Experience**. Reuse the same card-list + edit-form pattern. Form fields: role/degree, org/institution, type, workType, period, periodShort, duration, location, status, color, branch, commitHash, description, bullets[], tags[], plus an `isEducation` toggle.
- Admin reads/writes via the existing `/api` pattern → add `${API_URL}/experience` GET/POST. (`admin-server.js` already serves projects from JSON; we'll mirror it for experience.json.)

### 4. Mobile Works "Read more"
- In `MobileProjectCard`, truncate `project.description` to first 40 words; if longer, append `…` and a "Read more →" button.
- Clicking "Read more" calls a new `onOpenDetail(project)` prop bubbled to `Works`, which sets a `mobileSelected` state and renders the existing `DetailDrawer` inside a full-screen `motion.div` overlay (fixed inset-0, dark backdrop, close button) — same component already used on desktop.

### 5. GitHub stats: hide private repo names
- In `GithubStats.jsx` "Top Repos" list, when `repo.isPrivate`, render only `[private repo]` (no name leak). Keep commit count visible.

### 6. Scaling & layout pass (the big one)
Establish a consistent type scale and tighten mobile/desktop spacing.

**Type scale (CSS variables in `src/index.css`):**
```text
--fs-display:  clamp(32px, 5.2vw, 56px)   /* hero name, section titles */
--fs-h2:       clamp(24px, 3.6vw, 36px)   /* sub-headings */
--fs-h3:       clamp(16px, 2vw, 20px)     /* card titles */
--fs-body:     clamp(13px, 1.4vw, 15px)   /* body paragraphs */
--fs-meta:     clamp(10px, 1.1vw, 12px)   /* meta / mono labels */
--fs-tag:      clamp(9px, 1vw, 10px)
```
Apply across About, Works, Experience, ContentHub, Today.

**Content Hub (GitHub / Writing / Videos):**
- Standardize all three feeds to `max-w-5xl mx-auto` (currently `max-w-4xl`) so they fill the hub container instead of looking pinched.
- Drop the redundant inner `glass-card` wrappers + duplicated section headings on each tab (parent already has heading + glass). Keeps tabs visually unified.
- StatCard value font: `text-2xl md:text-3xl` (currently `text-3xl` everywhere → too big on mobile).
- Top Repos rows: stack metadata on `<sm` breakpoint, remove horizontal overflow risk.
- Blog/YouTube grids: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3` with `gap-4 md:gap-5`, equal heights via `h-full` on cards.

**Works cards:**
- Desktop wall: switch grid breakpoint logic — when drawer open, keep `grid-cols-1`; when closed, use `grid-cols-2 xl:grid-cols-3` so cards aren't oversized on wide screens.
- Card thumbnail height: `h-32 md:h-36` (was `h-36`).
- Card title: `text-sm md:text-base` (was 16px hard-coded).
- Mobile cards: padding `p-4` (was `p-5`), description uses 40-word truncation (item #4).
- Detail drawer title: drop hard-coded 36-44px → use `--fs-h2`.

**Experience mobile:**
- Reduce card padding `p-5 → p-4`, role title `16px → 15px`, period line spacing tightened.
- Spine offset on mobile reduced from `w-5` → `w-4` so cards get more horizontal room.
- Wrap mobile container in `pl-3 pr-3` (was `pl-2 pr-1` — asymmetric).

**Today card centering on mobile:**
- In `Content.jsx`, change the right column wrapper from `w-full sm:w-[80%] md:w-1/3 mt-20 md:mt-0` to `w-full md:w-1/3 mt-20 md:mt-0 flex justify-center`.
- In `Today.jsx`, change `w-[95vw] sm:w-[400px] mx-auto` → `w-full max-w-[360px] sm:max-w-[400px] mx-auto` so it centers cleanly inside the parent flex column at every breakpoint.

### Files touched
```text
NEW    src/utils/iconMap.jsx
NEW    src/components/experience/experience.json
EDIT   src/index.css                          (type-scale vars)
EDIT   src/components/about/About.jsx         (heading, remove identity col, tags into about.md)
EDIT   src/components/experience/Experience.jsx (load JSON, mobile spacing)
EDIT   src/components/works/Works.jsx         (mobile read-more, drawer overlay, grid breakpoints, type sizes)
EDIT   src/components/github/GithubStats.jsx  (hide private names, max-w, font sizes)
EDIT   src/components/blog/BlogFeed.jsx       (max-w, drop inner heading, grid)
EDIT   src/components/youtube/YoutubeFeed.jsx (max-w, drop inner heading, grid)
EDIT   src/components/content/ContentHub.jsx  (slight container width tweak)
EDIT   src/components/content/Today.jsx       (mobile centering)
EDIT   src/components/content/Content.jsx     (right column wrapper centering)
EDIT   src/components/socials/SocialLinks.jsx (icon swap)
EDIT   src/components/speedDial/SpeedDial.jsx (icon swap)
EDIT   src/pages/Admin.jsx                    (icon swap + Experience editor tab)
EDIT   admin-server.js                        (GET/POST /api/experience)
EDIT   package.json                           (+ hugeicons-react)
```

### Out of scope / not changing
- Backend auth, deployment configs, Cloudinary flow.
- ContentHub tab structure, Hero hero-text-col styling.
- Anything in `_deploy/` or `functions/`.
