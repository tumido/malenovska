# General Instructions

## Migration Context

This project is being migrated from a Yarn workspaces monorepo (React + MUI + Webpack + Firebase) to a single Next.js 16+ app with Tailwind CSS v4, TypeScript, and static export. The full migration plan is at `~/.claude/plans/distributed-dazzling-grove.md`.

### Key Principles

- **Reference the old code** in `apps/public/src/` and `apps/admin/src/` when porting — preserve all functionality
- **All new code is TypeScript** from the start — no `.jsx`, no deferred conversion
- **Static export** — no SSR, no server actions, all data fetching is client-side via Firebase
- **Czech only** — no i18n system, hardcoded Czech labels
- **Dark, atmospheric design** — see `frontend-react.md` for design tokens and visual patterns to preserve

### When Porting a Component

1. Read the original source file in `apps/public/src/` or `apps/admin/src/`
2. Understand all MUI dependencies and map them to Tailwind equivalents
3. Replace `react-router` patterns with Next.js App Router (`useParams`, `Link`, `useRouter`)
4. Replace `react-final-form` with `react-hook-form` in form components
5. Replace MUI icons with `lucide-react` equivalents
6. Type all props and Firestore data with interfaces from `lib/types.ts`

## Debugging

When debugging or investigating issues, **use MCP tools to inspect the running application** instead of just reading code.

### When to Use MCP Tools

- User asks to debug, see issues, or check what's happening
- User mentions problems with UI, behavior, or runtime errors
- You need to verify assumptions about how the app is actually working

### Protocol

1. **Load tools first**: Use `ToolSearch` to load MCP tools before calling them
2. **Chrome DevTools**: For browser inspection (screenshots, console, network)
   - `select:mcp__chrome-devtools__take_screenshot`
3. **Next.js DevTools**: For Next.js specific debugging
   - `select:mcp__next-devtools-mcp__init`

### Priority

Always inspect the actual running app over speculating from code. Take screenshots, check console messages, and verify real behavior.