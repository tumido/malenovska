# Frontend Development

You are an expert frontend engineer specializing in React, TypeScript, and Tailwind CSS. Apply these patterns and principles when working on this codebase.

## Tech Stack

- **Framework**: Vite + React Router v7 (framework mode, `ssr: false` — SPA)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS v4 with `@theme inline` for custom tokens
- **Fonts**: Google Fonts via `<link>` tags in `root.tsx` (Roboto for display, Open Sans for body)
- **Build**: SPA mode — Vite builds to `build/client/`, served via Firebase Hosting rewrite (`** → /index.html`)
- **Backend**: Firebase 12.x (Firestore, Auth, Storage) — modular v9+ API
- **Data fetching**: `react-firebase-hooks` (client-side, real-time)
- **Forms**: `react-hook-form` for the signup wizard
- **Notifications**: `notistack` for toast feedback
- **Maps**: `react-leaflet` + `leaflet` (`React.lazy()` + `<Suspense>`, no SSR)
- **Icons**: `lucide-react` (tree-shakeable)
- **Markdown**: `markdown-to-jsx`
- **Language**: Czech only (no i18n system)

## Code Style & Patterns

### Component Structure

```tsx
import { useParams } from "react-router";
// Group imports: React/React Router → Internal → Types

export const ComponentName = () => {
  const { eventId } = useParams();
  // Hooks first, then derived state, then handlers

  return (
    <section id="section-id" className="...">
      {/* Semantic HTML with accessibility in mind */}
    </section>
  );
};
```

### File Organization

```plain
app/
├── root.tsx              # HTML shell (fonts, meta, scripts, <Outlet />)
├── routes.ts             # Route config (layouts, routes, catch-all 404)
├── app.css               # Tailwind config + custom utilities
├── env.d.ts              # Vite env type declarations
├── routes/
│   ├── home.tsx          # "/" → redirect to current event
│   ├── choose.tsx        # Event selection page
│   ├── not-found.tsx     # 404 page
│   ├── event-layout.tsx  # Event shell (nav, header, footer)
│   ├── admin-layout.tsx  # Admin auth gate + shell
│   ├── event/
│   │   ├── index.tsx     # Redirect to "legends"
│   │   ├── legends.tsx   # Legend card grid
│   │   ├── legend.tsx    # Single legend detail
│   │   ├── races.tsx     # Race card grid
│   │   ├── race.tsx      # Single race detail
│   │   ├── rules.tsx     # Rules page
│   │   ├── info.tsx      # Map + event details
│   │   ├── contacts.tsx  # Contact info
│   │   ├── gallery.tsx   # Photo gallery
│   │   ├── signup.tsx    # Multi-step wizard
│   │   ├── attendees.tsx # Sortable/searchable table
│   │   └── confirmation.tsx
│   └── admin/
│       ├── login.tsx
│       ├── dashboard.tsx # Stats + pie chart
│       ├── config.tsx    # Active event config
│       ├── events/       # CRUD: list, new, edit
│       ├── legends/      # CRUD: list, new, edit
│       ├── races/        # CRUD: list, new, edit
│       ├── participants/ # List + edit (no create)
│       └── galleries/    # List + new (no edit)
├── components/           # Reusable UI components
│   ├── admin/            # Admin components (DataTable, FormLayout, etc.)
│   └── ...               # Public components
├── contexts/             # React contexts (EventContext, AuthContext)
└── lib/
    ├── firebase.ts       # Firebase init + typed helpers
    ├── types.ts          # Firestore document interfaces
    ├── admin-firestore.ts # Admin CRUD helpers
    ├── useAdminForm.ts   # Shared admin form lifecycle hook
    ├── usePastEvents.ts  # Past-event filtering hook
    ├── schemas.ts        # Zod schemas + publishing requirements
    ├── sorting.ts        # Table sorting comparator
    ├── navigation.ts     # Navigation helpers
    └── date.ts           # Timestamp formatters
public/                   # Static assets (images, favicons)
```

### Routing

Routes are defined in `app/routes.ts` using React Router helpers (`route()`, `layout()`, `index()`). Route components live in `app/routes/`. Layouts use `<Outlet />` from `react-router`.

```tsx
// app/routes.ts
import { type RouteConfig, route, layout, index } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  layout("routes/event-layout.tsx", [
    route(":eventId", "routes/event/index.tsx"),
    route(":eventId/legends", "routes/event/legends.tsx"),
    // ...
  ]),
] satisfies RouteConfig;
```

### Tailwind CSS Guidelines

1. **Use Tailwind v4 `@theme inline`** for custom design tokens:

   ```css
   @theme inline {
     --color-primary: #212121;
     --color-primary-dark: #141414;
     --color-primary-light: #fcf9f7;
     --color-secondary: #ff5722; /* deepOrange[500] */
     --color-secondary-dark: #e64a19; /* deepOrange[700] */
     --color-grey-400: #bdbdbd;
     --color-grey-500: #9e9e9e;
     --font-display: "Roboto", sans-serif;
     --font-body: "Open Sans", sans-serif;
   }
   ```

2. **Prefer Tailwind utilities** over custom CSS classes

3. **Use semantic color names** matching the design system:
   - `bg-primary`, `text-primary-light`, `bg-secondary`, `text-white`, etc.

4. **Responsive design**: Mobile-first with `md:` and `lg:` breakpoints

5. **Use direct utility classes, not arbitrary value syntax**:

   ```tsx
   // Correct
   className = "bg-primary text-white";

   // Avoid
   className = "bg-(--primary) text-(--white)";
   ```

6. **Use Tailwind v4 canonical class names** — non-canonical forms cause diagnostic warnings:

   **Use native values, not bracket syntax** — Tailwind v4 supports arbitrary numeric values directly:
   ```tsx
   // Correct — native v4 syntax
   className="z-70 w-18 opacity-80 top-15"

   // Wrong — unnecessary bracket syntax
   className="z-[70] w-[4.5rem] opacity-[0.8] top-[3.75rem]"
   ```

   **Renamed utilities** — v4 changed several default names:

   | Old (pre-v4) | Canonical (v4) |
   |---|---|
   | `bg-gradient-to-*` | `bg-linear-to-*` |
   | `shadow` | `shadow-sm` |
   | `shadow-sm` | `shadow-xs` |
   | `rounded` | `rounded-sm` |
   | `rounded-sm` | `rounded-xs` |
   | `blur` | `blur-xs` |
   | `ring` | `ring-3` |
   | `drop-shadow` | `drop-shadow-sm` |
   | `inset-shadow` | `inset-shadow-xs` |

   Only use bracket syntax `[...]` when there is genuinely no Tailwind utility for the value (e.g. `min-h-[50vh]`, `bg-[lightgray]`, `text-[0.625rem]`).

7. **Use Tailwind tokens, not raw hex**:

   ```tsx
   // Correct
   className = "bg-primary text-white";

   // Avoid
   className = "bg-[#212121] text-[#fff]";
   ```

### TypeScript Patterns

1. **Always use arrow functions** — `const Foo = () => {}` not `function Foo() {}`, for components, handlers, helpers, and all other functions
2. **Use type guards** for complex union types
3. **Avoid `any`** — use proper types or generics
4. **Use `as const`** for literal type inference when needed
5. **Type Firestore data** — always use interfaces from `@/lib/types` with `useCollectionData<T>` and `useDocumentData<T>`

### Data Fetching Pattern

All pages fetch data at runtime from Firestore. There is no SSR — the app is a Vite SPA with client-side routing.

```tsx
import { useParams } from "react-router";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { query, where, orderBy } from "firebase/firestore";
import { typedCollection } from "@/lib/firebase";
import type { Legend } from "@/lib/types";

const LegendsPage = () => {
  const { eventId } = useParams();
  const [legends, loading, error] = useCollectionData<Legend>(
    query(typedCollection<Legend>("legends"), where("event", "==", eventId), orderBy("publishedAt"))
  );

  if (loading) return <Loading />;
  if (error) return <ErrorState error={error} />;

  return /* render legends */;
};

export default LegendsPage;
```

### Navigation

- Use `Link` from `react-router` with `to` prop (not `href`)
- Use `useNavigate()` for programmatic navigation
- Use `useParams()` for route params (returns `string | undefined`, use `!` assertion when guaranteed)
- Use `useLocation()` for current path
- Use `useSearchParams()` — returns `[URLSearchParams, SetURLSearchParams]` tuple

### Form System (react-hook-form + zod)

**Admin CRUD forms** for races, legends, and galleries use the `useAdminForm` hook (`app/lib/useAdminForm.ts`), which handles the full new/edit lifecycle:

```tsx
import { zodResolver } from "@hookform/resolvers/zod";
import { useAdminForm } from "@/lib/useAdminForm";
import { raceSchema, type RaceFormValues } from "@/lib/schemas";

// New page: no id → creates document with slugified name
const { control, onSubmit, onCancel, isClone } = useAdminForm<RaceFormValues>({
  resolver: zodResolver(raceSchema),
  collection: "races",
  defaultValues: { name: "", event: "", ... },
  slugField: "name",
  basePath: "/admin/races",
});

// Edit page: id from URL → fetches document, populates form
const { id: raceId } = useParams();
const { control, onSubmit, onDelete, onCancel, loading, notFound } = useAdminForm<RaceFormValues>({
  resolver: zodResolver(raceSchema),
  collection: "races",
  defaultValues: {},
  basePath: "/admin/races",
  id: raceId,
});
```

The hook handles: `processPendingUploads`, `createDocument`/`updateDocument`, `DocumentExistsError`, clone-from-existing, delete confirmation, notistack error toasts, and navigation.

**Events** use a different pattern with `EventFormTabs` component and inline `useForm()` (more complex form structure).

Key patterns:
- **Controller wrappers** (`RHFFields.tsx`): `RHFInput`, `RHFSelect`, `RHFToggle`, `RHFCheckbox`, `RHFColor`, `RHFImage`, `RHFFile`, `RHFTextarea`, `RHFEventSelect`, `RHFMarkdown` — needed because FormFields have non-standard `onChange` signatures
- **`shouldUnregister: false`**: required because `FormLayout` unmounts inactive tab content
- **`useFieldArray`**: used for POI and RegistrationExtras arrays in EventFormTabs
- **Number fields**: `NumericInput` helper stores raw string locally while editing, commits number on blur — allows clearing the `0`

**Admin list pages** use `AdminListPage` component (`app/components/admin/AdminListPage.tsx`) — handles Firestore query, event filtering, delete confirmation, DataTable rendering, and "New" button. Each list page only defines its column array.

**Public detail pages** (legend, race) use `DetailPageShell` component (`app/components/DetailPageShell.tsx`) — handles loading skeleton, not-found/event-mismatch guards, page layout, and share dialog.

**Public signup** uses `FormProvider` across wizard steps (different pattern — `register()` instead of Controller).

### Component Patterns

1. **Sections** are self-contained with their own `id` for anchor navigation
2. **Use semantic HTML**: `<section>`, `<header>`, `<footer>`, `<nav>`, `<article>`
3. **Keep components focused** — extract sub-components when logic gets complex

### Styling Conventions

1. **Class order**: Layout -> Spacing -> Sizing -> Typography -> Colors -> Effects

   ```tsx
   className = "flex flex-col gap-4 p-8 text-xl font-bold text-white bg-primary rounded-lg shadow-lg";
   ```

2. **Conditional classes** with template literals:

   ```tsx
   className={`base-classes ${condition ? "active-classes" : "inactive-classes"}`}
   ```

3. **Responsive patterns**:

   ```tsx
   className = "text-2xl md:text-4xl lg:text-6xl";
   ```

4. **Hover/focus states**:

   ```tsx
   className = "transition-colors hover:bg-secondary focus:ring-2";
   ```

## Best Practices

### Do

- Keep components pure and side-effect free when possible
- Prefer `Link` from `react-router` for internal navigation
- Use `target="_blank" rel="external"` for external links
- Add `title` and `aria-*` attributes for accessibility
- Use `React.lazy()` + `<Suspense>` for components that need `window`/DOM (e.g., Leaflet map)
- Handle loading states with `<Loading />` component
- Use `lucide-react` icons — tree-shakeable, ~200B per icon

### Don't

- Don't use inline styles except for truly dynamic values (e.g., dynamic `backgroundColor` on `ColorBadge`)
- Don't create new files unless necessary — prefer editing existing
- Don't add unnecessary abstractions for one-time use
- Don't use `className` string concatenation with `+` — use template literals
- Don't forget to handle loading and error states (every Firestore hook returns `[data, loading, error]`)
- Don't use arbitrary value syntax like `bg-(--primary)` — use `bg-primary` instead
- Don't hardcode raw hex colors — use Tailwind semantic tokens (`bg-primary` not `bg-[#212121]`), except for truly one-off values
- Don't use SSR data fetching — this is an SPA
- Don't use `function` declarations — always use arrow functions (`const fn = () => {}` not `function fn() {}`)

## Design System

### Visual Style

The app has a **dark, atmospheric Material-inspired aesthetic** — not pop art, not minimal. Key characteristics:

- Dark backgrounds with a photographic background image (natural landscape) fading to black via gradient
- Warm accent colors (deep orange) against cool dark surfaces
- Card-based content layout with elevation/shadow for depth
- Semi-transparent overlays with backdrop blur on image headers
- Subtle hover transitions (color shifts, opacity changes)

### Color Palette

| Token | Value | Tailwind Usage | Description |
|-------|-------|---------------|-------------|
| `primary` | `#212121` (grey-900) | `bg-primary`, `text-primary` | Dark backgrounds, header, drawer, text on light |
| `primary-dark` | `#141414` | `bg-primary-dark` | Darker variant for deeper surfaces |
| `primary-light` | `#fcf9f7` (warm off-white) | `bg-primary-light` | Light backgrounds, text on dark |
| `secondary` | `#ff5722` (deepOrange-500) | `bg-secondary`, `text-secondary` | Accent color, CTAs, interactive highlights |
| `secondary-dark` | `#e64a19` (deepOrange-700) | `bg-secondary-dark` | Darker accent for hover/active states |
| `grey-400` | `#bdbdbd` | `text-grey-400` | Footer text, muted content |
| `grey-500` | `#9e9e9e` | `text-grey-500` | Secondary menu text |

**Additional colors used:**
- `#000` / `#0e0a0a` — page background, meta theme-color
- `#fff` — text on dark backgrounds, logo backgrounds
- `rgba(0,0,0,0.3)` — card header image overlays (with backdrop blur)
- `rgba(0,0,0,0.75)` — semi-transparent panel overlays
- `rgba(0,0,0,0.8)` — loading screen background, PageHero gradient base
- `lightgray` — gallery image placeholder

**Loading animation colors** (3-color rotation for spinner):
- `rgb(253, 38, 0)` — red
- `rgb(241, 238, 16)` — yellow
- `rgb(255, 145, 0)` — orange

**Race colors** are dynamic — each race has its own `color` field in Firestore, rendered via inline `backgroundColor` style on `ColorBadge`.

### Fonts

| Token | Font Family | Weights | Usage |
|-------|-------------|---------|-------|
| `display` | Roboto | 700 | Headings, titles |
| `body` | Open Sans | 400, 700 | Body text, UI |

### Key Visual Patterns

1. **PageHero** (`components/PageHero.tsx`): Full-page hero section used at the top of every public page. Two modes:
   - **Full** (default): 40-60vh height with background image, gradient overlay (`from-black/80 via-black/40 to-black/10`), event name with inline Logo SVG
   - **Compact**: Short header (`pt-[10vh] pb-6`), hero image set as fixed full-page background (used for list/dark pages)
   - Props: `title`, `eventName?`, `image?`, `compact?`, `children?`
   - Falls back to `event.heroImage.src` if no `image` prop provided
2. **Page content sections** — standard layout after PageHero:
   - Light content pages: `<section className="-mx-4 bg-primary-light text-primary"><div className="mx-auto max-w-5xl px-6 py-10 lg:px-8 lg:py-14">` (info, contacts, rules)
   - Dark list pages: `<div className="-mx-4 min-h-screen bg-black/80 px-4 pt-8">` (legends, races, gallery, attendees)
3. **Background gradient**: `linear-gradient(to bottom, transparent 80%, #000 100%)` over a fixed background image
4. **Card header overlays**: `rgba(0,0,0,0.3)` with `backdrop-blur-sm` on the bottom of card images
5. **Loading spinner**: 3 concentric spinning circles with offset rotation speeds (2s, 3s, 1.5s), cycling through red/yellow/orange border colors
6. **Form card selection**: Cards with `border-2 border-transparent` that become `border-secondary shadow-xl` when selected, standard shadow when not
7. **Map markers**: Drop shadow via `filter: drop-shadow(8px 8px 8px #000)`
8. **ColorBadge**: Dynamic background color with inverted text using CSS filters (`invert(1) grayscale(1) contrast(9)` with `background-clip: text`)
9. **Logo**: SVG component with configurable `fgColor`/`bgColor` props
10. **Header**: No shadow, smooth margin/width transitions when drawer opens

## Admin Form Components

Base field components in `components/admin/FormFields.tsx`. All support `error?: string` prop (red border + error message below). Used directly only for disabled/read-only fields; otherwise use the RHF wrappers.

| Component | Purpose |
|-----------|---------|
| `InputField` | Text/number/date/time input. Supports `suffix`, `maxLength` (counter), `onBlur` |
| `SelectField` | Dropdown select |
| `ToggleField` | Styled toggle switch with label + description |
| `CheckboxField` | Simple checkbox |
| `ColorField` | Color preset swatches + native color picker |
| `ImageField` | Image preview + drag & drop upload + URL input |
| `FileField` | File preview + drag & drop upload + URL input |
| `TextareaField` | Multiline text |
| `EventSelect` | Event dropdown (wraps SelectField) |

RHF Controller wrappers in `components/admin/RHFFields.tsx` — accept `control` + `name` instead of `value`/`onChange`, auto-pass validation errors:

`RHFInput`, `RHFSelect`, `RHFToggle`, `RHFCheckbox`, `RHFColor`, `RHFImage`, `RHFFile`, `RHFTextarea`, `RHFEventSelect`, `RHFMarkdown`

### File Upload Pattern

`ImageField` and `FileField` support drag & drop and file picker. Uploads are **deferred until save**:

1. On file drop/select → `registerPendingUpload(file)` stores the File, returns a blob URL for local preview
2. On save → `await processPendingUploads(formData)` uploads pending files to Firebase Storage, replaces blob URLs with real download URLs
3. Manually pasted URLs pass through untouched (only `blob:` URLs trigger upload)

All admin edit/new pages must call `processPendingUploads()` before `createDocument`/`updateDocument`.

### Admin Map (`AdminMapInner`)

Interactive map for editing POI locations. Lazy-loaded via `React.lazy()`. Features:
- Draggable markers (drag to update coordinates)
- Double-click to add new POI
- `forwardRef` exposes `getCenter()` for "add at center" button
- Markers use POI `color` field, falling back to cycling red/yellow/orange

## Testing Changes

After making changes, verify:

1. No TypeScript errors (`npx tsc --noEmit`)
2. Linting passes (`npm run lint`)
3. Build succeeds (`npm run build`)
4. Visual check in browser (see @.claude/rules/instructions.md )
5. Responsive behavior at different breakpoints
