# Malenovska.cz

Czech-language event management platform for LARP/roleplay events. Supports multiple events with registration, legends, races, rules, galleries, and an admin dashboard.

## Quick Reference

```bash
# Development
npm run dev          # Next.js dev server with Turbopack

# Checks
npx tsc --noEmit     # TypeScript
npm run lint         # ESLint
next build           # Static export build

# Firebase
firebase deploy      # Deploy to production
```

## Architecture

- **Framework**: Next.js 16+ with App Router, static export (`output: "export"`)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS v4 with `@theme inline` tokens
- **Backend**: Firebase 12 (Firestore, Auth, Storage) — modular v9+ API
- **Data fetching**: `react-firebase-hooks` in `"use client"` components — all client-side, no SSR
- **Dynamic routes**: `app/[eventId]/` with `generateStaticParams()` returning placeholder params; Firebase Hosting SPA rewrite (`** → /index.html`) serves the shell
- **Admin**: `app/admin/` route segment — auth-gated via Firebase Auth, same build/deploy as public app
- **Czech only** — no i18n, hardcoded Czech labels

## Key Files

| File | Purpose |
|------|---------|
| `app/globals.css` | Tailwind v4 theme, custom utilities, design tokens |
| `app/admin/layout.tsx` | Admin auth gate + shell |
| `lib/firebase.ts` | Firebase init, Firestore instance |
| `lib/types.ts` | TypeScript interfaces for Firestore documents |
| `lib/admin-firestore.ts` | Admin CRUD helpers (create, update, delete with subcollection handling) |
| `contexts/AuthContext.tsx` | Firebase Auth context for admin |
| `components/admin/` | Admin-specific components (DataTable, FormLayout, FormFields, etc.) |
| `next.config.ts` | Static export, unoptimized images, trailing slash |
| `firebase.json` | Hosting config — single target, `out/` directory |

## Rules

Detailed coding guidelines are in `.claude/rules/`:
- `frontend-react.md` — Tech stack, component patterns, Tailwind guidelines, design system
- `instructions.md` — Debugging with MCP tools
