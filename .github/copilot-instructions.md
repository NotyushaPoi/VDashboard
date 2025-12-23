# VDashboard - AI Coding Agent Instructions

## Project Overview
**VDashboard** is a modern streaming platform showcasing favorite streamers with their playlists, anime watchlists, and live stream links. Built with Next.js 16.1.1, featuring full Dark Mode support and responsive design.

## Tech Stack
- **Framework**: Next.js 16.1.1 (App Router)
- **Language**: TypeScript 5 (strict mode)
- **Styling**: Tailwind CSS 4 + PostCSS
- **Theming**: next-themes 0.4.6 (Dark Mode)
- **Package Manager**: pnpm
- **Linting**: ESLint 9 (Next.js config)

## Project Structure
```
vdashboard/
├── app/
│   ├── page.tsx                    # Homepage with carousel
│   ├── layout.tsx                  # Root layout (theme provider)
│   ├── globals.css                 # Tailwind imports
│   ├── components/
│   │   ├── Navbar.tsx             # Navigation + theme toggle
│   │   ├── Carousel.tsx           # Auto-rotating streamer carousel
│   │   ├── ThemeProvider.tsx      # next-themes wrapper
│   │   ├── ThemeToggle.tsx        # Light/Dark mode button
│   │   ├── CopyButton.tsx         # Copy-to-clipboard button
│   │   └── LyricsModal.tsx        # Modal for displaying lyrics
│   ├── lib/
│   │   ├── types.ts               # Type definitions (Streamer, Playlist, etc)
│   │   └── utils.ts               # Data loading from JSON
│   └── streamer/
│       ├── [id]/
│       │   ├── page.tsx           # Dynamic streamer detail page
│       │   └── not-found.tsx      # 404 for invalid streamer
│       └── components/
│           └── TabPanel.tsx       # Tabs for playlists/animes
├── public/
│   ├── data/
│   │   └── streamers.json         # Master data (6 streamers with songs/animes)
│   └── images/
│       └── streamers/             # Avatar & banner image directory
├── package.json
├── tsconfig.json
├── next.config.ts
└── README_VDASHBOARD.md           # User-facing docs
```

## Data Structure (`public/data/streamers.json`)

```typescript
interface Song {
  name: string;
  artist: string;
  genre: string;
  lyrics: string;        // Can be hardcoded or fetched from API
  url: string;          // External music/anime link
}

interface Playlist {
  name: string;
  songs: Song[];
}

interface Anime {
  name: string;
  episodes: number;
  status: "在看" | "已完成" | "计划看";
  url: string;
}

interface Streamer {
  id: number;
  name: string;                 // e.g., "希罗Kirara"
  bilibiliId: string;          // Bilibili UID for stats API
  liveUrl: string;             // https://www.bilibili.com/[id]
  avatar: string;              // /images/streamers/name-avatar.jpg
  banner: string;              // /images/streamers/name-banner.jpg
  bio: string;                 // Short intro
  description: string;         // Long description
  fans: string;                // Formatted followers (e.g., "5.2万")
  playlists: Playlist[];
  animes: Anime[];
}
```

## Key Development Patterns

### Data Loading
- **Server-side**: `lib/utils.ts` reads `public/data/streamers.json` using `fs.readFile()`
- **Caching**: In-memory cache on first load to avoid repeated file reads
- **Static generation**: All streamer pages pre-rendered at build time via `generateStaticParams()`

### Dark Mode Implementation
- Uses `next-themes` with `class` strategy
- HTML root element gets `dark` class automatically
- Persists to localStorage, respects system preference
- All components use `dark:` Tailwind prefix

### Component Patterns
```tsx
// Client component with interactivity
"use client";
import { useState } from "react";

export function InteractiveComponent() {
  const [state, setState] = useState("");
  return <div>{state}</div>;
}

// Server component (default)
export async function ServerComponent() {
  const data = await getStreamersData();
  return <div>{data.streamers.length}</div>;
}

// Dynamic routes
export async function generateStaticParams() {
  const streamers = await getAllStreamers();
  return streamers.map(s => ({ id: s.id.toString() }));
}
```

## Critical User Flows

### 1. Homepage
- Displays carousel of all 6+ streamers (auto-rotates every 5s)
- Click carousel image → navigate to `/streamer/[id]`
- Grid cards below with quick stats (playlist count, anime count, follower count)

### 2. Streamer Detail Page
- **Banner section**: Large gradient placeholder, click link opens live stream
- **Info section**: Avatar, name, bio, follow stats, action buttons
- **Tab panel**: Switch between "歌单" (playlists) and "追番" (animes)
- **Song row**: Name (clickable link), artist, genre, [歌词 button], [复制 button]
- **Lyrics modal**: Click "歌词" button → modal pops up with full lyrics text
- **Copy functionality**: Click "复制" → copies song/anime name to clipboard

### 3. Dark Mode Toggle
- Located in Navbar (top-right)
- Sun/Moon icon indicator
- Persists across page reloads

## Code Conventions

### File Naming
- Components: PascalCase (`Carousel.tsx`, `TabPanel.tsx`)
- Utils/hooks: camelCase (`utils.ts`, `hooks.ts`)
- Styling: lowercase (`globals.css`)
- Dynamic routes: `[id]` folder convention

### Imports
- Always use path alias: `import { X } from "@/app/lib/types"`
- Client components must have `"use client"` at top
- Type imports: `import type { Streamer } from "@/app/lib/types"`

### TypeScript Strictness
- All props typed with `interface`
- All async functions have explicit return types
- No implicit `any` - strict mode enforced

### Tailwind Usage
```tsx
// Dark mode example
<div className="bg-white dark:bg-gray-800 text-black dark:text-white">
  Content
</div>

// Responsive example
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
  Cards
</div>
```

## Common Tasks

### Add a New Streamer
1. Edit `public/data/streamers.json`
2. Add new object to `streamers` array with unique `id` > 6
3. Fill in all required fields (playlists, animes, links)
4. Run `pnpm build` to verify (generates static page)

### Update Playlist/Animes
1. Modify `playlists` or `animes` array in streamer object
2. Change is instant in dev mode (hot reload)
3. Rebuild in production: `pnpm build`

### Modify Styling
- Global: Edit `app/globals.css`
- Component-level: Add Tailwind classes directly in JSX
- Dark mode: Always add `dark:` variant for contrast

### Replace Placeholder Images
1. Save JPG/PNG to `public/images/streamers/`
2. Update `avatar` and `banner` paths in JSON
3. Recommended sizes: Avatar 200x200, Banner 1200x300

## Architecture Decisions

### Why Static Generation?
- All 6 streamer pages pre-built at compile time
- Instant page loads (no server runtime)
- GitHub Pages / S3 deployment friendly
- Data updates require rebuild (by design)

### Why JSON for Data?
- Simple version control with Git
- No database setup needed
- Easy manual editing
- Can be replaced with API later without code changes

### Why Tailwind?
- Rapid styling without custom CSS
- Built-in Dark Mode support
- Responsive design breakpoints
- No CSS bloat (purged unused classes)

## Integration Points

### B站 API (Optional)
- Endpoint: `https://api.bilibili.com/x/relation/stat?vmid={uid}`
- Currently: Hardcoded "加载中..." placeholder
- Can integrate via API Routes or scheduled script (see CUSTOMIZATION.md)

### External Links
- All music/anime links point to external services
- Open in new tab (target="_blank")

### Deployment
- Vercel (recommended): Auto-deploys on git push
- Self-hosted: `pnpm build && pnpm start`
- Export static: `next export` (limited functionality)

## Testing Checklist

Before committing:
- [ ] `pnpm lint` passes
- [ ] `pnpm build` succeeds (no errors)
- [ ] All 6+ streamer pages render correctly
- [ ] Dark/Light mode toggle works
- [ ] Carousel auto-rotates and manual controls work
- [ ] Copy buttons show "已复制 ✓" feedback
- [ ] Lyrics modal opens/closes properly
- [ ] Mobile responsive (<640px, 640-1024px, >1024px)
- [ ] All external links work (no 404s)

## Useful Documentation

- **README_VDASHBOARD.md**: User guide & deployment
- **DEVELOPMENT.md**: Dev setup, debugging, performance
- **CUSTOMIZATION.md**: Image/data updates, Bilibili integration

## Version Info
- Next.js 16.1.1
- React 19.2.3
- TypeScript 5.x
- Tailwind 4.x
- next-themes 0.4.6

