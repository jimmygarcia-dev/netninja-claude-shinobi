# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

"Shinobi" is a Next.js 15 blog application built as a starter project for learning AI-assisted development with Claude Code. The app reads posts from a Hygraph GraphQL endpoint and renders them through the Next.js App Router.

## Development Commands

```bash
npm run dev        # next dev with --turbopack (http://localhost:3000)
npm run build      # next build
npm run start      # next start (after build)
npm run lint       # next lint
npm run test       # vitest (single run)
npm run test:ui    # vitest --ui

# Run a single test file or test pattern
npx vitest src/components/ui/Button/Button.test.tsx
npx vitest -t "calls onClick when clicked"
```

## Environment

Create `.env.local` with the Hygraph endpoint used by the blog fetchers:

```
HYGRAPH_ENDPOINT=https://...
```

This variable is referenced in `src/app/blog/page.tsx` and `src/app/blog/[slug]/page.tsx` via `process.env.HYGRAPH_ENDPOINT!`. Both pages also set `next: { revalidate: 3600 }` for hourly ISR.

## Architecture

- **App Router** (`src/app/`) — server components by default. `src/app/page.tsx` and `src/app/preview/page.tsx` opt into the client with `"use client"`.
  - `/` — landing page linking to `/blog` and `/preview`
  - `/blog` — server-rendered list; `getPosts()` calls Hygraph with `GET_BLOG_POSTS`
  - `/blog/[slug]` — server-rendered post; `getSinglePost()` calls Hygraph with `GET_SINGLE_POST`, sanitizes the HTML, and falls back to `notFound()` when the post is missing
  - `/preview` — client component showcasing the design system
- **Components** (`src/components/`) — feature components like `BlogSidebar` and `DarkModeToggle`, plus a UI kit under `src/components/ui/<Name>/<Name>.tsx` paired with a colocated `.test.tsx`.
- **Library** (`src/lib/`)
  - `queries.ts` — GraphQL query strings (`GET_BLOG_POSTS`, `GET_SINGLE_POST`)
  - `types.ts` — `BlogPost` interface shared by pages and components
  - `sanitize.ts` — wraps DOMPurify on a JSDOM window; `sanitizeHTML()` is required before injecting Hygraph HTML into the page via `dangerouslySetInnerHTML`

## Styling & Theming

`src/app/globals.css` defines the theme. `:root` and `:root.dark` set CSS variables (`--background`, `--foreground`, `--primary`, `--secondary`, `--accent`, `--muted`, `--success`, `--warning`, `--danger`, `--info`, `--surface`, `--border`); Tailwind's `@theme` block exposes them as `bg-primary`, `text-foreground`, etc. The dark variant is toggled by adding/removing the `dark` class on `document.documentElement` — see `DarkModeToggle.tsx`. Body uses Rubik; `h1`/`h2` use Merriweather.

## Testing

Vitest runs under JSDOM (`vitest.config.mts`) with `src/test/setup.ts` wiring up `@testing-library/jest-dom` matchers. Follow the colocated pattern: put `<Name>.test.tsx` next to the component (see `src/components/ui/Button/`). Tests use `afterEach(cleanup)` from `@testing-library/react` to avoid cross-test DOM bleed.

## Conventions

- When adding a new page to `src/app/`, also add a link to it from the header in `src/app/layout.tsx` so the new route is discoverable from every page.