# Malenovska.cz

Czech-language event management platform for LARP/roleplay events. Supports multiple events with registration, legends, races, rules, galleries, and an admin dashboard.

## Project Status

**Active migration** from a Yarn workspaces monorepo (React + MUI + Webpack) to Next.js 16+ with Tailwind CSS v4, TypeScript, and static export. See `~/.claude/plans/distributed-dazzling-grove.md` for the full plan.

Old code lives in `apps/` (reference during porting). New code is being built at the repo root as a Next.js app.

## Quick Reference

```bash
# Development
npm run dev          # Next.js dev server with Turbopack

# Checks
npx tsc --noEmit     # TypeScript
npm run lint         # ESLint
next build           # Static export build

# Firebase
firebase serve       # Local hosting preview
firebase deploy      # Deploy to production
```

## Architecture

- **Static export** (`output: "export"`) — no SSR, no server actions
- **Client-side data** — all Firestore fetching via `react-firebase-hooks` in `"use client"` components
- **Dynamic routes** — `app/[eventId]/` with `generateStaticParams()` returning `[]`; Firebase Hosting SPA rewrite (`** → /index.html`) serves the shell
- **Czech only** — no i18n, hardcoded Czech labels

## Key Files

| File | Purpose |
|------|---------|
| `app/globals.css` | Tailwind v4 theme, custom utilities, design tokens |
| `lib/firebase.ts` | Firebase init, Firestore instance |
| `lib/types.ts` | TypeScript interfaces for Firestore documents |
| `next.config.ts` | Static export, unoptimized images, trailing slash |
| `firebase.json` | Hosting config (public + admin targets) |

## Rules

Detailed coding guidelines are in `.claude/rules/`:
- `frontend-react.md` — Tech stack, component patterns, Tailwind guidelines, design system
- `instructions.md` — Migration protocol, debugging with MCP tools