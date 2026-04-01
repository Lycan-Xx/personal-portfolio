# Portfolio Project Architecture

A comprehensive breakdown of the personal portfolio's component structure, data flow, and architecture.

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Credits & Attribution](#credits--attribution)
3. [Directory Structure](#directory-structure)
4. [Core Application Entry Points](#core-application-entry-points)
5. [Components Guide](#components-guide)
6. [Content Hub](#content-hub)
7. [Admin Panel](#admin-panel)
8. [Data & Configuration](#data--configuration)
9. [Utility Functions](#utility-functions)
10. [External Services](#external-services)
11. [Technology Stack](#technology-stack)
12. [Environment Variables](#environment-variables)
13. [Available Scripts](#available-scripts)

---

## Credits & Attribution

This project is a heavily modified version of the original portfolio template created by **Jo Lienhoop**. While the original project served as the foundation, this version has been transformed significantly with new features, architecture, and design changes.

### Original Inspiration

- **Jo Lienhoop** - Creator of the original React portfolio template that served as the foundation for this project.
- **Cody Bennett** - For the inspiration and ideas that helped shape this portfolio.

### Additional Inspiration & References

- **Mark Tan** - For design inspiration
- **Bloggify** - [github-calendar](https://github.com/Bloggify/github-calendar)
- **gruberjsje** - [react-github-calendar](https://github.com/grubersjoe/react-github-calendar)

### Technology Credits

This project uses the following open-source technologies:

- [React](https://reactjs.org) - UI framework
- [Vite](https://vitejs.dev) - Build tool
- [Tailwind CSS](https://tailwindcss.com) - Styling
- [Framer Motion](https://www.framer.com/motion/) - Animations
- [Material-UI (MUI)](https://material-ui.com) - Component library
- [Express](https://expressjs.com) - Backend server
- [Cloudinary](https://cloudinary.com) - Image management & hosting

---

## Project Overview

This is a **React-based personal portfolio** built with Vite, featuring:

- **Theme System**: Light/dark mode with glassmorphism UI
- **Content Management**: Projects managed via local JSON with Admin Panel
- **Animations**: Framer Motion for scroll-triggered animations
- **Styling**: Tailwind CSS + custom CSS variables
- **Content Hub**: Unified section for GitHub stats, Blog posts, and YouTube videos
- **Admin Panel**: Full CRUD operations for projects with Cloudinary image uploads
- **Blog Integration**: Aggregates posts from Medium and Dev.to
- **YouTube Integration**: Displays latest videos from your channel
- **GitHub Integration**: Enhanced stats with contribution streaks and top repositories

---

## Directory Structure

```
portfolio/
├── admin-server.js           # Express backend for admin API
├── Dockerfile                # Docker container configuration
├── package.json              # Project dependencies
├── vite.config.js            # Vite configuration
├── tailwind.config.cjs      # Tailwind CSS configuration
├── .env.example             # Environment variables template
├── docs/
│   ├── ADMIN_SETUP_GUIDE.md # Admin panel setup guide
│   └── CLOUDFLARE_DEPLOYMENT.md # Deployment guide
├── functions/                # Cloudflare Pages Functions
│   └── api/
│       ├── github/graphql.js # GitHub GraphQL proxy
│       └── youtube/videos.js # YouTube API proxy
├── public/
│   └── favicon.ico          # Site favicon
└── src/
    ├── index.jsx             # React entry point
    ├── index.css             # Global styles
    ├── app/
    │   ├── App.jsx           # Root component with routing
    │   └── HelmetMeta.js     # SEO metadata management
    ├── components/
    │   ├── LoadingScreen.jsx # Initial loading experience
    │   ├── ErrorBoundary.jsx # Error handling wrapper
    │   ├── about/            # About section with skills
    │   ├── background/       # Animated & video backgrounds
    │   ├── blog/             # Blog feed integration
    │   ├── contact/          # Contact form & social links
    │   ├── content/          # Hero content & live clock
    │   ├── github/           # GitHub stats & contributions
    │   ├── nav/              # Navigation bar
    │   ├── resume/           # Resume download button
    │   ├── socials/          # Social media links
    │   ├── speedDial/       # Theme toggle button
    │   ├── theme/            # Theme provider & themes
    │   ├── works/            # Project showcase with flip cards
    │   └── youtube/         # YouTube video feed
    ├── hooks/
    │   ├── usePerformance.js # Device performance detection
    │   └── useProjects.js    # Project data fetching
    ├── pages/
    │   ├── Home.jsx          # Home page wrapper
    │   ├── Admin.jsx         # Admin panel (localhost only)
    │   └── PageNotFound.js  # 404 page
    ├── settings/
    │   ├── resume.json       # Resume data
    │   └── settings.json     # Theme colors
    ├── utils/
    │   ├── cloudinaryConfig.js # Cloudinary upload utility
    │   ├── dateHelpers.js   # Date formatting
    │   ├── getName.js       # Name extraction
    │   └── getRandomDirection.js # Animation direction
    └── assets/
        └── fonts/
            └── Chococooky.woff # Custom font
```

---

## Core Application Entry Points

### [`src/index.jsx`](src/index.jsx:1)
The entry point that renders the React application into the DOM.

### [`src/app/App.jsx`](src/app/App.jsx:21)
**Root Component** - orchestrates the entire application:
- Wraps everything in `LoadingScreen` for initial load
- Uses `CustomThemeProvider` for theme context
- Implements lazy loading for About, Contact, and VideoBackground
- Renders Navbar, Home, Works, ContentHub, Contact sections
- Routes to Admin panel at `/admin` path (localhost only)
- Contains a floating footer greeting "Lycan-Xx says hi... 👾"

---

## Components Guide

### 🔄 Loading & Initialization

#### [`LoadingScreen.jsx`](src/components/LoadingScreen.jsx:1)
**Purpose**: Shows animated loading screen on first visit
- Displays bouncing cyan cubes animation
- Shows progress bar (0-90% simulated, then 100%)
- Skips on return visits (checks localStorage `portfolio-visited`)
- Minimum 2s display, max 4s fallback

#### [`ErrorBoundary.jsx`](src/components/ErrorBoundary.jsx:1)
**Purpose**: Catches React errors and prevents app crashes
- Displays fallback UI on component errors
- Wraps main app sections

---

### 📍 Navigation

#### [`Navbar.jsx`](src/components/nav/Navbar.jsx:1)
**Purpose**: Fixed navigation bar with smooth scroll links
- Items: Home, Projects, About, Contact
- Mobile hamburger menu with slide-down panel
- Glassmorphism background that appears on scroll
- Active state highlighting with cyan border

---

### 🏠 Content & Hero

#### [`Content.jsx`](src/components/content/Content.jsx:1)
**Purpose**: Main hero section with name, title, and description
- Displays "Mohammad Bello (Sani)" in custom font (ChocoCooky)
- Rotating job titles (Developer, Chemist, Technician)
- Responsive layout: stacks on mobile, side-by-side on desktop

#### [`Today.jsx`](src/components/content/Today.jsx:1)
**Purpose**: Live clock card with typewriter effect
- Real-time clock (HH:mm:ss) updating every second
- Date display with colored parts (Day=orange, Date=cyan)
- Typewriter greeting: "Welcome! You're in [time-of-day] mode"
- Time-of-day messages: "Midnight Code Crunch", "AM Coffee & Code", etc.

---

### 👤 About Section

#### [`About.jsx`](src/components/about/About.jsx:1)
**Purpose**: About section with skills and tech stack
- Personal bio paragraph
- Skills cards (Web Dev, Linux Admin, Security, Chemistry, Repair)
- Tech stack icons (React, JS, HTML, Tailwind, MongoDB, etc.)
- Includes GitHubStats component

---

### 💻 GitHub Integration (Enhanced)

#### [`GithubStats.jsx`](src/components/github/GithubStats.jsx:1)
**Purpose**: Displays comprehensive GitHub statistics
- Fetches from GitHub GraphQL API via proxy
- Shows contribution calendar with streaks (current + longest)
- Displays total contributions, monthly commits
- Lists top repositories by commit count
- Shows merged PRs count
- Caches results for 12 hours using localStorage
- Falls back to cached data on network errors

---

### 📝 Blog Integration

#### [`BlogFeed.jsx`](src/components/blog/BlogFeed.jsx:1)
**Purpose**: Aggregates blog posts from Medium and Dev.to
- Fetches from both platforms via RSS feeds
- Filterable by source (All, Medium, Dev.to)
- Displays post thumbnails, titles, dates, reading time
- Tags/categories support
- 6-hour cache with localStorage fallback
- Links to full articles on external platforms

---

### 🎬 YouTube Integration

#### [`YoutubeFeed.jsx`](src/components/youtube/YoutubeFeed.jsx:1)
**Purpose**: Displays latest videos from YouTube channel
- Fetches via YouTube Data API
- Featured latest video (larger card)
- Secondary videos in grid layout
- 3-hour cache with localStorage
- Shows video thumbnails, titles, dates
- Links to watch on YouTube

---

### 🖼️ Projects Showcase

#### [`Works.jsx`](src/components/works/Works.jsx:1)
**Purpose**: Interactive project cards with flip animation
- Fetches from local JSON via `useProjects` hook
- 3D flip card on click (front: image + summary, back: details)
- Image carousel for projects with multiple screenshots
- Windows 8 tile motion inspired animations
- Status badges: Active, Dormant, Experimental, Archived
- Featured badge for highlighted projects
- Links to live demo and source code

---

### 📬 Contact Section

#### [`Contact.jsx`](src/components/contact/Contact.jsx:1)
**Purpose**: Contact information and social links
- Displays email and location
- Includes SocialLinks component

#### [`SocialLinks.jsx`](src/components/socials/SocialLinks.jsx:1)
**Purpose**: Social media profile links
- LinkedIn, GitHub, Twitter, Discord
- Shows username and opens profile in new tab
- Copy-to-clipboard functionality

---

### 🎨 Theme System

#### [`ThemeProvider.jsx`](src/components/theme/ThemeProvider.jsx:1)
**Purpose**: Context provider for light/dark theme
- Respects system preference (prefers-color-scheme)
- Persists choice in localStorage
- Provides `theme` and `toggleTheme` to consumers

#### [`Themes.js`](src/components/theme/Themes.js:1)
**Purpose**: MUI theme configuration
- Creates LightTheme and DarkTheme with MUI
- Reads colors from `settings.json` (primary, secondary, black, white)
- Custom typography settings

#### [`SpeedDial.jsx`](src/components/speedDial/SpeedDial.jsx:1)
**Purpose**: Theme toggle button (sun/moon icon)
- Fixed position bottom-left
- Shows tooltip on mobile

---

### 🖼️ Backgrounds

#### [`AnimatedBackground.jsx`](src/components/background/AnimatedBackground.jsx:1)
**Purpose**: Fallback animated background
- Animated gradient + random floating dots
- Used as fallback when VideoBackground fails

#### [`VideoBackground.jsx`](src/components/background/VideoBackground.jsx:1)
**Purpose**: Main video background
- Lazy loads video only when scrolled into view
- Skips on slow connections (2g) or data-saver mode
- Video from Cloudinary CDN
- Dark overlay for readability

---

### 📄 Resume

#### [`Resume.jsx`](src/components/resume/Resume.jsx:1)
**Purpose**: Download resume button
- Links to Google Drive PDF
- Opens in new tab

---

## Content Hub

### [`ContentHub.jsx`](src/components/content/ContentHub.jsx:1)
**Purpose**: Unified tabbed section combining GitHub, Writing, and Videos
- Tabbed interface: `< GitHub />`, `< Writing />`, `< Videos />`
- Lazy loads each section for performance
- Glassmorphism container design
- Single section for all external content integrations

---

## Admin Panel

### [`Admin.jsx`](src/pages/Admin.jsx:1)
**Purpose**: Full CRUD admin panel for managing portfolio projects

**Access Control**:
- Only accessible from localhost (127.0.0.1)
- Displays "Access Denied" message for remote connections

**Features**:
- Project list with search/filter
- Create new projects
- Edit existing projects
- Delete projects with confirmation
- Image upload to Cloudinary with progress indicator
- Add images via URL (Cloudinary validation)
- Drag-and-drop image reordering
- Tag management
- Featured toggle
- Display order control
- Status management (Active, Dormant, Experimental, Archived)

**Form Fields**:
- Title, Description
- Status (dropdown)
- Featured (checkbox)
- Display Order (number)
- Tags (add/remove)
- Live Link, Repo Link
- Images (upload or URL)

---

## Backend API

### [`admin-server.js`](admin-server.js:1)
**Purpose**: Express.js backend server for admin operations and API proxies

**Endpoints**:

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/projects` | Get all projects |
| POST | `/api/projects/add` | Add new project |
| PUT | `/api/projects/:id` | Update project |
| DELETE | `/api/projects/:id` | Delete project |
| POST | `/api/github/graphql` | GitHub GraphQL proxy |
| GET | `/api/youtube/videos` | YouTube API proxy |
| GET | `/health` | Health check |

**Security**: All project endpoints restricted to localhost

---

## Custom Hooks

### [`useProjects.js`](src/hooks/useProjects.js:1)
**Purpose**: Fetches projects from local JSON file
- Returns: `{ projects, loading, error, refetch }`

### [`usePerformance.js`](src/hooks/usePerformance.js:1)
**Purpose**: Detects device capabilities
- Returns `true` if:
  - No reduced-motion preference
  - Device has >4GB RAM
  - Data-saver is OFF

---

## Data & Configuration

### [`settings.json`](src/settings/settings.json:1)
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

### [`resume.json`](src/settings/resume.json:1)
Contains basic info: name, title, description, jobs

### [`projects.json`](src/components/works/projects.json:1)
Portfolio projects stored as JSON array with fields:
- id, title, description
- status (active/dormant/experimental/archived)
- featured (boolean)
- displayOrder
- tags (array)
- link, repo
- images (array)
- completedDate

---

## Utility Functions

| File | Purpose |
|------|---------|
| `getName.js` | Extracts first/last name from resume.json |
| `dateHelpers.js` | Formats dates for display |
| `getRandomDirection.js` | Random animation direction for carousel |
| `cloudinaryConfig.js` | Cloudinary upload with progress tracking |

---

## External Services

| Service | Purpose |
|---------|---------|
| **Cloudinary** | Image hosting & uploads for projects |
| **YouTube Data API** | Video feed integration |
| **Medium/Dev.to RSS** | Blog post aggregation |
| **GitHub GraphQL** | Contribution data & stats |

---

## Technology Stack

- **React 18** - UI framework
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **Express** - Backend server
- **React Intersection Observer** - Scroll detection
- **React Scroll** - Smooth scrolling
- **date-fns** - Date formatting
- **SweetAlert2** - Beautiful alerts
- **React Icons** - Icon library

---

## Environment Variables

Create `.env` file in project root:

```env
# GitHub Integration
VITE_GITHUB_TOKEN=your-github-personal-access-token

# Cloudinary (for Admin Panel image uploads)
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_upload_preset

# Blog Integration (optional)
VITE_MEDIUM_HANDLE=@your-medium-username
VITE_DEVTO_HANDLE=your-devto-username
VITE_RSS2JSON_KEY=your-rss2json-api-key

# YouTube Integration (optional)
VITE_YOUTUBE_CHANNEL_ID=your-channel-id
VITE_YOUTUBE_HANDLE=@your-youtube-handle
VITE_YOUTUBE_API_KEY=your-youtube-api-key
```

---

## Available Scripts

In the project directory, you can run:

### `npm install`

Installs all dependencies.

### `npm run dev`

Starts the frontend development server with hot reload.
The app will be available at [http://localhost:5173](http://localhost:5173).

### `npm run build`

Builds the frontend for production to the `frontend/dist` folder.

### `npm run preview`

Preview the production build locally.

### `npm run admin-server`

Starts the Express backend server for admin API.
The server will run on [http://localhost:3001](http://localhost:3001).

### `npm run dev:admin`

Runs both frontend and admin server concurrently using concurrently.

### `npm run deploy`

Builds and deploys to GitHub Pages (configured in package.json).

### `npm run analyze`

Builds with bundle analysis for performance optimization.

---

## Docker Support

The project includes a `Dockerfile` for containerized deployment:

```bash
# Build the image
docker build -t portfolio .

# Run the container
docker run -p 3000:3000 portfolio
```

---

## Cloudflare Deployment

See [`docs/CLOUDFLARE_DEPLOYMENT.md`](docs/CLOUDFLARE_DEPLOYMENT.md) for detailed deployment instructions to Cloudflare Pages.

---

## Admin Setup

See [`docs/ADMIN_SETUP_GUIDE.md`](docs/ADMIN_SETUP_GUIDE.md) for detailed instructions on setting up the admin panel, Cloudinary, and project management.

---

*Last updated: April 2026*
