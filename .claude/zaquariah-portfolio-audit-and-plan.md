# zaquariah.dev Rebuild — Audit & Architecture Plan

*Compiled July 3, 2026 from zaquariah.dev, github.com/Zaqttack, and linkedin.com/in/zaquariah-holland.*

## 1. Current state

### zaquariah.dev (Once UI "Magic Portfolio" template, Next.js)
- **Home** — tagline "Engineer and Community Builder," short bio (SWIVEL software engineer, ACM San Antonio chair), links to LinkedIn/GitHub/email/resume.
- **About** — the most complete page. Full work history (SWIVEL Software Engineer Apr 2024–present, SWIVEL Junior SWE Aug 2021–Apr 2024, SWBC Web Dev Intern May–Aug 2021), UTSA CS degree, technical/soft skills, and involvement (ACM San Antonio President, DEV SA board member, CU Build committee, UTSA RowdyHacks).
- **Work/Projects, Blog, Gallery** — still the template's default demo content, and (per your note) deliberately unlinked from navigation right now rather than a bug — these just haven't been built out yet.
- **Resume** lives externally on Google Drive rather than on the site.
- Everything is file/code-based — any update means editing code and redeploying. No database, no admin UI.

### GitHub — github.com/Zaqttack
15 public repos, bio "Software Engineer @ SWIVEL, UTSA '22." Pinned repos only partially represent your best work (one pin is a fork of someone else's project). Recent activity (2025–2026) is solid; older repos (2020–2022) are mostly undescribed hackathon/school projects. Full inventory was captured in the earlier review.

### LinkedIn — linkedin.com/in/zaquariah-holland
Blocked from unauthenticated scraping. Public snippets + your About page confirm SWIVEL, San Antonio, UTSA, 500+ connections, active in RowdyHacks/ACM San Antonio/DEV SA/Tech Bloc circles. A full content audit (posts, recommendations) would need a data export or a signed-in walkthrough.

## 2. What this rebuild is actually solving

You're not just re-skinning the current template — you like its look, so the redesign is really an **architecture migration**: static/hardcoded → database-backed, with a private admin portal, CI/CD to manage schema + deploys, and analytics that account for both human visitors and scrapers/bots. Plus two content gaps you flagged: deeper treatment of volunteering/ACM San Antonio, and a path to backfill skills/achievements from work once you can pull that data from your work computer.

Goals, in priority order:
1. Edit any piece of content (bio, a project, a job bullet, a blog post) from an admin UI — no code push required.
2. Model volunteering/community leadership (ACM San Antonio, DEV SA, CU Build, RowdyHacks) as rich, first-class content, not an afterthought under "Involvement."
3. Support importing/backfilling achievements and skills from work materials later, without redesigning the schema when that day comes.
4. Track real traffic *and* bot/scraper traffic — increasingly relevant with AI crawlers hitting personal sites.
5. Ship this on free infrastructure end to end.

## 3. Data model

| Table | Purpose | Key fields |
|---|---|---|
| `profile` | singleton site config | name, tagline, bio, avatar_url, location, resume_url, email, social links |
| `experience` | jobs | company, role, start_date, end_date, org_type, display_order |
| `experience_bullets` | achievements per job | experience_id, text, visibility (`public`/`private`), source (`self`/`work_import`), display_order |
| `involvement_orgs` | ACM San Antonio, DEV SA, CU Build, RowdyHacks, etc. | name, description, url, logo |
| `involvement_roles` | role history within an org | org_id, role, start_date, end_date, highlights[], metrics (jsonb — e.g. events organized, attendees, membership growth) |
| `achievements` | standalone wins not tied to a job (awards, certs, hackathon placements) | title, description, date, related_experience_id (nullable), related_org_id (nullable), evidence_url, visibility |
| `skills` | tech/soft skills | name, category, proficiency, source_experience_id (nullable), source (`self`/`work_import`) |
| `projects` | portfolio projects | title, slug, summary, body, cover_image, tags[], repo_url, live_url, status, featured, display_order |
| `posts` | blog | title, slug, body, excerpt, cover_image, tags[], published_at, status |
| `gallery_images` | photos | url, caption, taken_at, display_order |
| `import_staging` | landing zone for work-computer uploads | raw_payload (jsonb), source_note, reviewed (bool), created_at |
| `page_views` | analytics | ts, path, referrer, user_agent, ip_hash, country, is_bot, bot_name |
| `bot_signatures` | editable crawler match list | pattern, bot_name, category (`search`/`ai_training`/`other`) |
| `admin_activity` | audit log | actor, table_name, row_id, action, ts |

Notes:
- `experience_bullets.visibility` lets you log detailed work context for your own records (`private`) without it ever rendering publicly — useful once you're importing from work materials that may include internal-only detail.
- `import_staging` is a deliberate landing zone: dump whatever you export from your work computer (CSV/JSON/plain notes) in, review it in the admin UI, then promote pieces into `experience_bullets`, `skills`, or `achievements`. Nothing auto-publishes.
- `involvement_roles` lets ACM San Antonio show a real timeline (e.g., co-founder → president) with its own metrics, instead of being squeezed into the same shape as a job.

## 4. Analytics & scrape tracking

Two layers, both free:

**Baseline (zero code):** since the site already sits behind Cloudflare (visible from the `cdn-cgi` email obfuscation on the current build), turn on Cloudflare's free Web Analytics and check Security → Bots in the dashboard. That gets you human-vs-bot traffic and top crawlers with no engineering effort — worth enabling immediately regardless of the rebuild timeline.

**Custom layer (queryable, yours):** log every request server-side (Next.js middleware or a Cloudflare Worker in front of it) into the `page_views` table: timestamp, path, referrer, hashed IP (never store raw IPs), country (from Cloudflare's edge headers), user agent, and a bot classification. Match user agents against `bot_signatures` — a table, not hardcoded, so you can add new AI crawlers (GPTBot, ClaudeBot, CCBot, PerplexityBot, Bytespider, Googlebot, Bingbot, etc.) without redeploying. Build a small admin view: traffic over time, top pages, human vs. bot split, which crawlers are showing up.

Privacy defaults: hash IPs before storage, no third-party ad trackers, no cookies required for the basic count.

## 5. Architecture & CI/CD

**App shape:** one Next.js app (App Router) with route groups — `(public)` for the real site, `(admin)` for the protected portal. A single app keeps hosting free and simple; a separate admin app would mean a second free-tier deployment to manage for no real benefit at your scale.

**Repo layout**
```
/app/(public)/...         public site routes
/app/(admin)/...          admin portal routes (protected)
/app/api/...               route handlers (projects, posts, experience, import, analytics)
/supabase/migrations/...   versioned schema
/supabase/seed.sql
```

**GitHub Actions**
- `ci.yml` — lint, typecheck, test on every PR.
- `db-migrate.yml` — on push to `main` touching `supabase/migrations/**`, runs `supabase db push` against your hosted project using a repo secret (Supabase access token). This is your "build the database" pipeline.
- Deploys: let Cloudflare Pages' (or Vercel's) native GitHub integration auto-deploy on push to `main` — don't reinvent that in Actions, it's free and already solved.

**APIs:** Next.js Route Handlers talking to Supabase via its server client — no separate API service needed, which keeps the whole thing inside the free tiers.

## 6. Admin security (no public signup)

- Supabase Auth, disable public sign-ups at the project level — the *only* account is you.
- Prefer magic link or Supabase's built-in TOTP MFA over a plain password, since a single high-value account is exactly what credential stuffing targets.
- Admin routes protected twice: Next.js middleware checks for a valid Supabase session **and** an explicit allow-list of your user ID — so a bug in session handling doesn't silently open the door.
- Row Level Security: anonymous/public role gets `SELECT` only on published rows (`status = 'published'`); all `INSERT`/`UPDATE`/`DELETE` require the authenticated role matched to your user ID via policy.
- Service-role key never ships to the client — used only in server-side route handlers and GitHub Actions secrets.
- Add Cloudflare Turnstile (free) on the admin login form to blunt automated login attempts.
- `admin_activity` audit log gives you a change history in case anything ever looks off.

## 7. Staying free

| Piece | Free tier | Headroom for a personal site |
|---|---|---|
| Supabase | 500MB DB, 1GB storage, 50k MAUs, 2GB egress/mo | Comfortable |
| Hosting | Cloudflare Pages (or Vercel Hobby) | Comfortable, watch bandwidth if traffic spikes |
| GitHub Actions | 2,000 min/mo private, unlimited public | Migration/CI jobs are seconds each |
| Analytics | Cloudflare Web Analytics (free) + self-hosted table | No paid SaaS needed |
| Domain | zaquariah.dev already owned | No new cost |

Things to keep an eye on as it grows: Supabase storage/egress if the gallery or project images get heavy, and Cloudflare/Vercel bandwidth caps if a post ever spikes in traffic. Both are dashboard-visible, no surprises.

## 8. Decisions locked so far
- **Hosting:** Cloudflare Pages.
- **Admin auth:** magic link + OTP (no password, no public signup).
- **Work-data import format:** deferred — `import_staging` ships as a bare textarea/paste box for MVP; richer format support (CSV, structured exports) is a post-MVP improvement once you know what you're actually exporting.
- **Volunteering metrics:** flexible/qualitative for now — `involvement_roles.metrics` (jsonb) will start with simple free-text fields like "where" and "how" you volunteered rather than forcing quantified stats; can add numbers later per-org as they make sense.

## 9. Design inspiration research

Pulled from current (2026) developer/designer portfolio roundups (Colorlib, Site Builder Report) rather than dated "best of" lists. Grouped by where they land relative to your "quirky but informative, still navigable and professional" target.

**Clean & professional (the "navigable, professional" anchor)**
- [Brittany Chiang](https://brittanychiang.com/) — dark, minimal, single-page, sticky sidebar nav + socials, subtle animation. The reference point for "professional but not boring."
- [Tim Gesemann](https://www.tim-gesemann.dev/) — clean/minimal with a genuinely creative work-experience timeline; good model for your `experience`/`involvement` timeline UI.
- [Diogo Correia](https://diogotc.com/) — particle-effect hero, sticky nav, but structured and easy to scan.

**Quirky & playful (the "quirky" anchor)**
- [Josh Comeau](https://www.joshwcomeau.com/) — retro-tinged, interactive, sound/animation on hover — playful without sacrificing clarity; everything is still clearly organized.
- [Cassie Evans](https://cassie.codes/) — custom illustrated "desk scene," warm color palette, nav labeled by what she actually does (writing/speaking/workshops/playing). Quirky through personality and illustration, not chaos.
- [Adam Argyle](https://developer.chrome.com/blog/authors/adamargyle) *(brutalist/interactive style — reference for tone, further out on the "quirky" end than you likely want)*.

**Hybrid signal (closest to "keep the vibe I have, add personality")**
Sites that keep a clean, professional skeleton (clear nav, sections, fast to scan) but add one or two signature quirky touches — a custom cursor, an illustrated detail, a hover sound, a playful nav label — rather than restyling everything. Given you already like your current Once UI-based structure, this is probably your sweet spot: keep the professional bones (clear sections, sticky nav, fast scanning), then layer in 1–2 memorable, personal touches (illustration, motion, or copy voice) rather than a full brutalist/experimental redesign.

## 10. Design system vs. "just start building"

Short answer: **build a lightweight design system first, but don't wait for a final visual style before you start.**

Reasoning: once content is DB-backed, your pages render from variable-length real data (a bio of unknown length, N projects, N experience bullets), so you'll get more mileage from a small set of token-driven primitives — color/spacing/type scale as CSS variables or a Tailwind theme config, plus reusable components (Section, Card, Tag, TimelineItem, Button) — than from hand-tuning page-specific CSS. Building "simple layout first, design later" usually means those hardcoded values get ripped out anyway once a style direction is picked.

What this doesn't mean: you don't need a finished Figma file or a locked color palette before writing code. Tokens are cheap to swap later if they live in one place. Practical order:
1. Define tokens with placeholder-but-reasonable values (spacing scale, type scale, a neutral palette, motion durations) — an afternoon of work, not a project.
2. Build the structural primitives and real pages against those tokens with your actual content.
3. Once you've picked a style direction (see section 9), refine tokens + component-level styling — this is a targeted, contained pass, not a rebuild.

## 11. Open decisions before building
1. ~~Style direction~~ — **Decided: Hybrid.** Keep the current professional bones (clear sections, sticky nav, fast scanning) and layer in 1–2 signature quirky touches (illustration, custom cursor, hover animation, or a playful copy voice) rather than a full restyle in either direction. This should inform the token/component work in section 10 and the initial visual pass once the build is up.

## 12. Suggested build order
1. Stand up Supabase project + apply schema (sections 3 excluding analytics tables first).
2. Migrate About page content into `profile`, `experience`, `experience_bullets`, `skills`.
3. Build out `involvement_orgs`/`involvement_roles` with real ACM San Antonio/DEV SA/CU Build detail.
4. Minimal admin portal: auth, list/edit for each table, markdown editor, image upload to Storage.
5. Add `page_views` + `bot_signatures` logging and a simple analytics view in the admin.
6. Replace placeholder Work/Blog/Gallery with real content (or keep them unlisted until ready — your call).
7. Set up `import_staging` + a bare-bones review UI for whenever the work-computer export is ready.
8. Wire up GitHub Actions (`ci.yml`, `db-migrate.yml`) and confirm Cloudflare Pages/Vercel auto-deploy.
