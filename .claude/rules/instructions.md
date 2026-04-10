# General Instructions

## Key Principles

- **All code is TypeScript** — no `.jsx`, no deferred conversion
- **SPA mode** — no SSR, no server actions, all data fetching is client-side via Firebase
- **Czech only** — no i18n system, hardcoded Czech labels
- **Dark, atmospheric design** (public app) — see `frontend-react.md` for design tokens and visual patterns

## Dev Server

**NEVER start the dev server.** Do not run `npm run dev`, `npm run dev:local`, or any command that starts a development server. The dev server is always already running on `http://localhost:5173`. Just use MCP tools to navigate to it directly.

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

### Priority

Always inspect the actual running app over speculating from code. Take screenshots, check console messages, and verify real behavior.
