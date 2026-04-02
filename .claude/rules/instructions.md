# General Instructions

## Key Principles

- **All code is TypeScript** — no `.jsx`, no deferred conversion
- **Static export** — no SSR, no server actions, all data fetching is client-side via Firebase
- **Czech only** — no i18n system, hardcoded Czech labels
- **Dark, atmospheric design** (public app) — see `frontend-react.md` for design tokens and visual patterns

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