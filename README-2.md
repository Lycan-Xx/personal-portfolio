# Portfolio Project Architecture

A comprehensive breakdown of the personal portfolio's component structure, data flow, and architecture.

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Directory Structure](#directory-structure)
3. [Core Application Entry Points](#core-application-entry-points)
4. [Components Guide](#components-guide)
5. [Data & Configuration](#data--configuration)
6. [Utility Functions](#utility-functions)
7. [External Services](#external-services)

---

## Project Overview

This is a **React-based personal portfolio** built with Vite, featuring:
- **Theme System**: Light/dark mode with glassmorphism UI
- **Content Management**: Projects fetched from Sanity CMS
- **Animations**: Framer Motion for scroll-triggered animations
- **Styling**: Tailwind CSS + custom CSS variables
- **Email**: EmailJS for contact form functionality

---

## Directory Structure

```
frontend/src/
├── app/                    # Main app configuration
│   ├── App.jsx             # Root component with lazy loading
│   └── HelmetMeta.js       # SEO metadata management
├── components/             # React components
│   ├── LoadingScreen.jsx   # Initial loading experience
│   ├── about/              # About section with GitHub integration
│   ├── background/         # Animated backgrounds
│   ├── contact/            # Contact form & social links
│   ├── content/            # Hero content & live clock
│   ├── github/             # GitHub contributions calendar
│   ├── nav/                # Navigation bar
│   ├── resume/             # Resume download button
│   ├── socials/            # Social media links
│   ├── speedDial/          # Theme toggle button
│   ├── theme/              # Theme provider & themes
│   └── works/              # Project showcase
├── hooks/                  # Custom React hooks
│   ├── usePerformance.js   # Device performance detection
│   └── useProjects.js      # Sanity CMS data fetching
├── lib/                    # External library configs
│   └── sanity.js           # Sanity client setup
├── pages/                  # Route pages
│   ├── Home.jsx            # Home page wrapper
│   └── PageNotFound.js     # 404 page
├── settings/               # Configuration files
│   ├── resume.json         # Resume data
│   └── settings.json       # Theme colors
└── utils/                  # Helper functions
    ├── dateHelpers.js      # Date formatting
    ├── getName.js          # Name extraction
    └── getRandomDirection.js # Animation direction
```

---

## Core Application Entry Points

### [`frontend/src/index.jsx`](frontend/src/index.jsx:1)
The entry point that renders the React application into the DOM.

### [`frontend/src/app/App.jsx`](frontend/src/app/App.jsx:15)
**Root Component** - orchestrates the entire application:
- Wraps everything in `LoadingScreen` for initial load
- Uses `CustomThemeProvider` for theme context
- Implements lazy loading for About, Contact, and VideoBackground
- Renders Navbar, Home, Works sections
- Contains a floating footer greeting "Lycan-Xx says hi... 👾"

---

## Components Guide

### 🔄 Loading & Initialization

#### [`LoadingScreen.jsx`](frontend/src/components/LoadingScreen.jsx:3)
**Purpose**: Shows animated loading screen on first visit
- Displays bouncing cyan cubes animation
- Shows progress bar (0-90% simulated, then 100%)
- Skips on return visits (checks localStorage `portfolio-visited`)
- Minimum 2s display, max 4s fallback

---

### 📍 Navigation

#### [`Navbar.jsx`](frontend/src/components/nav/Navbar.jsx:12)
**Purpose**: Fixed navigation bar with smooth scroll links
- Items: Home, Projects, About, Contact
- Mobile hamburger menu with slide-down panel
- Glassmorphism background that appears on scroll
- Active state highlighting with cyan border

---

### 🏠 Content & Hero

#### [`Content.jsx`](frontend/src/components/content/Content.jsx:7)
**Purpose**: Main hero section with name, title, and description
- Displays "Mohammad Bello (Sani)" in custom font (ChocoCooky)
- Rotating job titles (Developer, Chemist, Technician)
- Responsive layout: stacks on mobile, side-by-side on desktop

#### [`Today.jsx`](frontend/src/components/content/Today.jsx:4)
**Purpose**: Live clock card with typewriter effect
- Real-time clock (HH:mm:ss) updating every second
- Date display with colored parts (Day=orange, Date=cyan)
- Typewriter greeting: "Welcome! You're in [time-of-day] mode"
- Time-of-day messages: "Midnight Code Crunch", "AM Coffee & Code", etc.

---

### 👤 About Section

#### [`About.jsx`](frontend/src/components/about/About.jsx:87)
**Purpose**: About section with skills and tech stack
- Personal bio paragraph
- Skills cards (Web Dev, Linux Admin, Security, Chemistry, Repair)
- Tech stack icons (React, JS, HTML, Tailwind, MongoDB, etc.)
- Includes GitHubContributions component

---

### 💻 GitHub Integration

#### [`GitHubContributions.jsx`](frontend/src/components/github/GitHubContributions.jsx:164)
**Purpose**: Displays GitHub contribution calendar
- Fetches directly from GitHub GraphQL API (no backend required)
- Requires `VITE_GITHUB_TOKEN` in environment variables
- Shows contribution streaks (current + longest)
- Caches results for 24 hours using localStorage
- Displays contribution heatmap with color coding
- Falls back to cached data on network errors

---

### 🖼️ Projects Showcase

#### [`Works.jsx`](frontend/src/components/works/Works.jsx:335)
**Purpose**: Interactive project cards with flip animation
- Fetches from Sanity CMS via `useProjects` hook
- 3D flip card on click (front: image + summary, back: details)
- Image carousel for projects with multiple screenshots
- Status badges: Active, Dormant, Experimental, Archived
- Featured badge for highlighted projects
- Links to live demo and source code

---

### 📬 Contact Section

#### [`Contact.jsx`](frontend/src/components/contact/Contact.jsx:9)
**Purpose**: Contact information and social links
- Displays email (msbello514@gmail.com) and location (Adamawa, Nigeria)
- Includes SocialLinks component
- Form is currently commented out (using EmailJS service)

#### [`SocialLinks.jsx`](frontend/src/components/socials/SocialLinks.jsx:12)
**Purpose**: Social media profile links
- LinkedIn, GitHub, Twitter, Discord
- Shows username and opens profile in new tab
- Copy-to-clipboard functionality

---

### 🎨 Theme System

#### [`ThemeProvider.jsx`](frontend/src/components/theme/ThemeProvider.jsx:7)
**Purpose**: Context provider for light/dark theme
- Respects system preference (prefers-color-scheme)
- Persists choice in localStorage
- Provides `theme` and `toggleTheme` to consumers

#### [`Themes.js`](frontend/src/components/theme/Themes.js:1)
**Purpose**: MUI theme configuration
- Creates LightTheme and DarkTheme with MUI
- Reads colors from `settings.json` (primary, secondary, black, white)
- Custom typography settings

#### [`SpeedDial.jsx`](frontend/src/components/speedDial/SpeedDial.jsx:6)
**Purpose**: Theme toggle button (sun/moon icon)
- Fixed position bottom-left
- Shows tooltip on mobile

---

### 🖼️ Backgrounds

#### [`AnimatedBackground.jsx`](frontend/src/components/background/AnimatedBackground.jsx:4)
**Purpose**: Fallback animated background
- Animated gradient + random floating dots
- Used as fallback when VideoBackground fails

#### [`VideoBackground.jsx`](frontend/src/components/background/VideoBackground.jsx:3)
**Purpose**: Main video background
- Lazy loads video only when scrolled into view
- Skips on slow connections (2g) or data-saver mode
- Video from Cloudinary CDN
- Dark overlay for readability

---

### 📄 Resume

#### [`Resume.jsx`](frontend/src/components/resume/Resume.jsx:31)
**Purpose**: Download resume button
- Links to Google Drive PDF
- Opens in new tab

---

## Custom Hooks

### [`useProjects.js`](frontend/src/hooks/useProjects.js:5)
**Purpose**: Fetches projects from Sanity CMS
- GROQ query for project data
- Real-time subscription for live updates
- Returns: `{ projects, loading, error, refetch }`

### [`usePerformance.js`](frontend/src/hooks/usePerformance.js:4)
**Purpose**: Detects device capabilities
- Returns `true` if:
  - No reduced-motion preference
  - Device has >4GB RAM
  - Data-saver is OFF

---

## Data & Configuration

### [`settings.json`](frontend/src/settings/settings.json:1)
```json
{
  "colors": {
    "primary": "#42bcbc",   // Cyan
    "secondary": "#ec704c", // Orange
    "black": "#111111",
    "white": "#fafafa"
  }
}
```

### [`resume.json`](frontend/src/settings/resume.json:1)
Contains basic info: name, title, description, jobs

### [`projects.json`](frontend/src/components/works/projects.json:1)
Fallback static projects (when CMS unavailable)

---

## Utility Functions

| File | Purpose |
|------|---------|
| `getName.js` | Extracts first/last name from resume.json |
| `dateHelpers.js` | Formats dates for display |
| `getRandomDirection.js` | Random animation direction for carousel |

---

## External Services

| Service | Purpose |
|---------|---------|
| **Sanity CMS** | Project portfolio content management |
| **EmailJS** | Contact form email sending |
| **Cloudinary** | Video background hosting |
| **GitHub GraphQL** | Contribution data |

---

## Technology Stack

- **React 18** - UI framework
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **MUI** - Component library
- **React Intersection Observer** - Scroll detection
- **React Scroll** - Smooth scrolling
- **date-fns** - Date formatting
- **Sanity Client** - CMS integration

---

## Environment Variables

Create `.env` file in `frontend/`:
```env
REACT_APP_SANITY_PROJECT_ID=your-project-id
REACT_APP_SANITY_DATASET=production
VITE_GITHUB_TOKEN=your-github-pat
```

---

*Generated for portfolio review - last updated March 2026*