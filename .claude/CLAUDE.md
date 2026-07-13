# Portfolio — Project Instructions

## Skills
- `/portfolio-checklist` — run before finalizing any change that touches public routes, DB tables, feature flags, analytics, or design tokens. Ensures nothing gets missed across SEO, admin, and analytics surfaces.

## Stack
- Next.js 14 App Router, TypeScript
- Supabase (postgres) for all data + auth + storage
- Cloudflare Pages for deployment via `@cloudflare/next-on-pages`
- Next.js Route Handlers (`app/api/`) run as edge functions — no separate Worker needed

## Structure
```
src/
├── app/
│   ├── (public)/       public-facing routes (home, work, writing, experience)
│   ├── (admin)/        protected admin portal routes
│   └── api/            route handlers (projects, posts, experience, import, analytics)
├── components/         CmdK, LeftRail, TopNav — nothing else
├── lib/                supabase.ts (client), db.ts (typed query helpers)
└── types/              shared TypeScript interfaces
supabase/
├── migrations/         versioned schema SQL files
└── seed.sql            dev seed data
e2e/                    Playwright E2E tests
src/tests/              Vitest unit tests
```

## Data model
| Table | Purpose |
|---|---|
| `profile` | singleton site config (name, tagline, bio, social links, resume_url) |
| `experience` | jobs (company, role, start_date, end_date, org_type, display_order) |
| `experience_bullets` | achievements per job (visibility: public/private, source: self/work_import) |
| `involvement_orgs` | ACM SA, DEV SA, CU Build, RowdyHacks, etc. |
| `involvement_roles` | role history within an org (metrics jsonb for qualitative/quantitative) |
| `achievements` | awards, certs, hackathon placements (linked to experience or org, nullable) |
| `skills` | tech/soft skills (source: self/work_import) |
| `projects` | portfolio projects (slug, cover_image, tags[], status, featured) |
| `posts` | blog (slug, body, excerpt, tags[], published_at, status) |
| `import_staging` | landing zone for work-computer uploads (raw_payload jsonb, reviewed bool) |
| `page_views` | analytics (ts, path, referrer, ip_hash, country, is_bot, bot_name) |
| `bot_signatures` | editable crawler match list (pattern, bot_name, category) |
| `admin_activity` | audit log (actor, table_name, row_id, action, ts) |

Key invariants:
- `experience_bullets.visibility` = `private` never renders publicly — for internal work context
- `import_staging` is a review queue; nothing auto-publishes from it
- `involvement_roles.metrics` is jsonb — starts as free-text qualitative, not forced numeric

## Design system
- All styling via CSS custom properties in `globals.css` — no component library, no SCSS
- Inline styles everywhere, CSS vars for all tokens
- Fonts: Space Grotesk (`--font-space`), JetBrains Mono (`--font-mono`)
- Fixed 118px left rail: `--rail-w`
- Key colors: `--accent: #EC6A2C`, `--canvas: #0B0C0E`
- Full token list lives in `globals.css`
- Style direction: hybrid — professional bones (clear sections, sticky nav) + 1–2 signature quirky touches

## Interactions pattern
- IntersectionObserver for scroll reveals (`data-reveal` attr)
- Scroll-spy for left rail active state
- Magnetic buttons via `mousemove` on `useRef`
- ⌘K command palette: `CmdK` component, opened via `setCmdkOpen(true)`

## Admin
- Route: `/(admin)` route group — no public link, no nav entry
- Auth: Supabase Auth, magic link + TOTP MFA — no password, no public signup
- Middleware checks valid Supabase session AND an explicit user-ID allowlist (double guard)
- RLS: anonymous role gets SELECT on published rows only; all writes require authenticated role matching owner user ID
- Service-role key server-side only — never shipped to client
- Add Cloudflare Turnstile (free) on the admin login form
- Schema-driven CRUD for all tables; profile skips list view (singleton)
- `admin_activity` logs every write for audit history
- `import_staging` provides a paste/review UI for work-computer data exports

## Analytics
- Baseline: Cloudflare Web Analytics (free, zero code — enable in dashboard)
- Custom layer: log every request into `page_views` from Next.js middleware
- Bot classification matches user agent against `bot_signatures` table (editable, not hardcoded)
- Hash IPs before storage — never store raw IPs; no cookies required

## Env vars
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
SUPABASE_SERVICE_ROLE_KEY=
SUPABASE_PROJECT_ID=
ADMIN_USER_ID=
```

## CI/CD (GitHub Actions)
- `test.yml` — PR gate: lint, unit tests, Playwright smoke (skips dependabot)
- `deploy.yml` — push to main: path detection → lint → unit → smoke → build → deploy (web changes), SQL lint → dry-run → push with retry (migration changes)

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
- Route groups: `(public)` for site, `(admin)` for portal
- Commit messages: conventional commits — `feat:`, `fix:`, `chore:`, `refactor:`, `test:`, `docs:` — lowercase, no brackets
