# Portfolio — Project Instructions

## Stack
- Next.js 14 App Router, TypeScript
- Supabase (postgres) for all data
- Cloudflare Pages for deployment via `@cloudflare/next-on-pages`
- Next.js Route Handlers (`app/api/`) run as edge functions — no separate Worker needed

## Structure
```
src/
├── app/            pages + API routes (flat, no route groups)
├── components/     CmdK, LeftRail, TopNav — nothing else
├── lib/            supabase.ts (client), db.ts (typed query helpers)
└── types/          shared TypeScript interfaces (Project, Post, WorkEntry, etc.)
supabase/
├── migrations/     versioned schema SQL files
└── seed.sql        dev seed data
e2e/                Playwright E2E tests
src/tests/          Vitest unit tests
```

## Design system
- All styling via CSS custom properties in `globals.css` — no component library, no SCSS, no className
- Inline styles everywhere, CSS vars for all tokens
- Fonts: Space Grotesk (`--font-space`), JetBrains Mono (`--font-mono`)
- Fixed 118px left rail: `--rail-w`
- Key colors: `--accent: #EC6A2C`, `--canvas: #0B0C0E`
- Full token list lives in `globals.css`

## Interactions pattern
- IntersectionObserver for scroll reveals (`data-reveal` attr)
- Scroll-spy for left rail active state
- Magnetic buttons via `mousemove` on `useRef`
- ⌘K command palette: `CmdK` component, opened via `setCmdkOpen(true)`

## Admin
- Route: `/admin` — no public link, no nav entry
- Passphrase gate: `sessionStorage.getItem('adm') === 'raptor'`
- Schema-driven CRUD for: projects, posts, experience, leadership, profile
- Profile is a singleton (skips list view, goes straight to form)
- Currently uses mock data — wired to Supabase API routes when backend is ready

## Env vars
```
NEXT_PUBLIC_SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
```

## Scripts
| Command | What it does |
|---|---|
| `npm run dev` | Local dev server |
| `npm run lint` | Biome lint check |
| `npm run format` | Biome format (writes) |
| `npm test` | Vitest unit tests |
| `npm run test:e2e` | Playwright E2E |
| `npm run deploy` | Build + deploy to Cloudflare Pages |

## Conventions
- No comments unless the WHY is non-obvious
- No abstractions beyond what the task requires
- Prefer editing existing files over creating new ones
- `@/*` aliases to `./src/*`
- API routes go in `src/app/api/<resource>/route.ts`
- DB query helpers go in `src/lib/db.ts` — pages never import supabase directly
