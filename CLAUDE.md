# Malenovska.cz

Czech-language event management platform for LARP/roleplay events. Supports multiple events with registration, legends, races, rules, galleries, and an admin dashboard.

## Quick Reference

```bash
# Development
npm run dev          # Vite + React Router dev server
npm run dev:local    # Dev server with emulators (VITE_USE_EMULATORS=true)

# Checks
npx tsc --noEmit     # TypeScript (root project)
npm run lint         # ESLint
npm run build        # Production build (SPA to build/client/)
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

- **Framework**: Vite + React Router v7 (framework mode, `ssr: false` — SPA)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS v4 with `@theme inline` tokens
- **Backend**: Firebase 12 (Firestore, Auth, Storage) — modular v9+ API
- **Data fetching**: `react-firebase-hooks` — all client-side, no SSR
- **Routing**: File-based route config in `app/routes.ts` using `route()`, `layout()`, `index()` helpers; `app/routes/` directory for route components
- **Admin**: `app/routes/admin/` — auth-gated via Firebase Auth, same build/deploy as public app
- **Cloud Functions**: `functions/` directory — TypeScript, Node 22, Firebase Functions v7 (gen 2). Firestore-triggered functions for email confirmations and Discord notifications
- **Czech only** — no i18n, hardcoded Czech labels

## Key Files

| File                          | Purpose                                                                 |
| ----------------------------- | ----------------------------------------------------------------------- |
| `app/root.tsx`                | HTML shell (fonts, meta, scripts, `<Outlet />`)                         |
| `app/routes.ts`               | Route config (layouts, routes, catch-all 404)                           |
| `app/app.css`                 | Tailwind v4 theme, custom utilities, design tokens                      |
| `app/routes/admin-layout.tsx` | Admin auth gate + shell                                                 |
| `app/routes/event-layout.tsx` | Event shell (nav, header, footer)                                       |
| `vite.config.ts`              | Vite config with React Router + tsconfig paths plugins                  |
| `react-router.config.ts`      | React Router config (`ssr: false`)                                      |
| `lib/firebase.ts`             | Firebase init, Firestore instance                                       |
| `lib/types.ts`                | TypeScript interfaces for Firestore documents                           |
| `lib/admin-firestore.ts`      | Admin CRUD helpers, deferred file upload (`registerPendingUpload` → `processPendingUploads` on save) |
| `contexts/AuthContext.tsx`    | Firebase Auth context for admin                                         |
| `components/admin/`           | Admin components (DataTable, FormLayout, FormFields, AdminMapInner, etc.) |
| `firebase.json`               | Hosting, functions, emulators config                                    |
| `functions/src/index.ts`      | Cloud Functions entry — 3 Firestore-triggered functions                 |
| `functions/src/templates.ts`  | Email template rendering with `{{variable}}` substitution               |
| `functions/src/email.ts`      | Gmail OAuth2 email sending via nodemailer                               |
| `functions/src/discord.ts`    | Discord webhook notifications                                           |
| `scripts/firestore-dump.mjs`  | Dump production Firestore to JSON                                       |
| `scripts/firestore-seed.mjs`  | Seed Firestore emulator (rewrites Storage URLs)                         |
| `scripts/storage-dump.mjs`    | Download production Storage files                                       |
| `scripts/storage-seed.mjs`    | Upload files to Storage emulator                                        |

## Rules

Detailed coding guidelines are in `.claude/rules/`:

- `frontend-react.md` — Tech stack, component patterns, Tailwind guidelines, design system
- `instructions.md` — Debugging with MCP tools
