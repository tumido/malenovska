# Malenovska.cz

Czech-language event management platform for LARP/roleplay events. Supports multiple events with registration, legends, races, rules, galleries, and an admin dashboard.

## Quick Reference

```bash
# Development
npm run dev          # Next.js dev server with Turbopack
npm run dev:local    # Dev server with emulators (NEXT_PUBLIC_USE_EMULATORS=true)

# Checks
npx tsc --noEmit     # TypeScript (root project)
npm run lint         # ESLint
next build           # Static export build
cd functions && npx tsc --noEmit  # TypeScript (functions)

# Firebase Emulators
npm run emulators         # Start with persistent data (import/export)
npm run emulators:fresh   # Start with clean state
npm run emulators:dump    # Dump production Firestore + Storage to emulator-data/
npm run emulators:seed    # Seed emulators from dump (rewrites Storage URLs to localhost)

# Deploy
npm run deploy:hosting    # Deploy hosting only
npm run deploy:functions  # Deploy Cloud Functions only
npm run deploy:rules      # Deploy Firestore rules only
npm run deploy            # Deploy everything
```

## Architecture

- **Framework**: Next.js 16+ with App Router, static export (`output: "export"`)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS v4 with `@theme inline` tokens
- **Backend**: Firebase 12 (Firestore, Auth, Storage) — modular v9+ API
- **Data fetching**: `react-firebase-hooks` in `"use client"` components — all client-side, no SSR
- **Dynamic routes**: `app/[eventId]/` with `generateStaticParams()` returning placeholder params; Firebase Hosting SPA rewrite (`** → /index.html`) serves the shell
- **Admin**: `app/admin/` route segment — auth-gated via Firebase Auth, same build/deploy as public app
- **Cloud Functions**: `functions/` directory — TypeScript, Node 22, Firebase Functions v7 (gen 2). Firestore-triggered functions for email confirmations and Discord notifications
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
| `firebase.json` | Hosting, functions, emulators config |
| `functions/src/index.ts` | Cloud Functions entry — 3 Firestore-triggered functions |
| `functions/src/templates.ts` | Email template rendering with `{{variable}}` substitution |
| `functions/src/email.ts` | Gmail OAuth2 email sending via nodemailer |
| `functions/src/discord.ts` | Discord webhook notifications |
| `scripts/firestore-dump.mjs` | Dump production Firestore to JSON |
| `scripts/firestore-seed.mjs` | Seed Firestore emulator (rewrites Storage URLs) |
| `scripts/storage-dump.mjs` | Download production Storage files |
| `scripts/storage-seed.mjs` | Upload files to Storage emulator |

## Rules

Detailed coding guidelines are in `.claude/rules/`:
- `frontend-react.md` — Tech stack, component patterns, Tailwind guidelines, design system
- `instructions.md` — Debugging with MCP tools
