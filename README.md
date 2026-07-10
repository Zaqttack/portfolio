# Portfolio

[![Test](https://github.com/Zaqttack/portfolio/actions/workflows/test.yml/badge.svg)](https://github.com/Zaqttack/portfolio/actions/workflows/test.yml)
[![Deploy](https://github.com/Zaqttack/portfolio/actions/workflows/deploy.yml/badge.svg)](https://github.com/Zaqttack/portfolio/actions/workflows/deploy.yml)
[![Keep Supabase Alive](https://github.com/Zaqttack/portfolio/actions/workflows/keep-alive.yml/badge.svg)](https://github.com/Zaqttack/portfolio/actions/workflows/keep-alive.yml)

A self-hosted developer portfolio with a database-driven admin panel. All content — name, bio, experience, projects, writing, skills, links — is managed through the admin UI with no code changes required. Built to be forked and made your own.

## Stack

- **Framework** — Next.js 14 App Router, TypeScript, deployed on Cloudflare Pages (edge)
- **Database** — Supabase (Postgres) with RLS, Auth (magic link + TOTP MFA), and Storage
- **Styling** — CSS custom properties in `globals.css`, no component library
- **Fonts** — Space Grotesk + JetBrains Mono
- **Tests** — Vitest (unit), Playwright (E2E)
- **CI/CD** — GitHub Actions: lint → unit → smoke → build → deploy

## Features

- Admin portal at `/admin` — CRUD for all content, protected by Supabase Auth + user ID allowlist
- Configurable accent color, avatar, section visibility, and copy from the admin UI
- Resume PDF generated on-demand from your data
- Page view analytics with bot classification, no cookies required
- Sitemap and robots.txt driven by your domain env var
- `import_staging` review queue for importing work data from a second machine

## Setup

### 1. Supabase

1. Create a project at [supabase.com](https://supabase.com)
2. Copy your project ref, URL, publishable key, and service role key

### 2. Cloudflare Pages

1. Fork this repo, then connect it to a new Cloudflare Pages project
2. Set the build command to `npm run deploy` and output directory to `.vercel/output/static`

### 3. Environment variables

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

Variables are needed in three places — local dev, CI, and the deployed Worker. The table below shows which is which.

#### Local `.env`

All variables for `npm run dev` and manual local deploys.

| Variable | Where to find it |
|---|---|
| `NEXT_PUBLIC_SITE_DOMAIN` | Your domain, e.g. `yoursite.dev` |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Project Settings → API |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Supabase → Project Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Project Settings → API |
| `SUPABASE_PROJECT_ID` | Your Supabase project ref |
| `ADMIN_USER_ID` | Set after first login (step 5) |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Cloudflare Turnstile → Add site |
| `TURNSTILE_SECRET_KEY` | Cloudflare Turnstile → Add site |

#### GitHub Actions — repository secrets

Set at **repo → Settings → Secrets and variables → Actions**. These are used by the CI/CD workflows for building and deploying.

| Secret | Purpose |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Baked into the JS bundle during CI build |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Baked into the JS bundle during CI build |
| `SUPABASE_ACCESS_TOKEN` | Authenticates Supabase CLI for migration jobs (supabase.com → Account → Access Tokens) |
| `SUPABASE_DB_PASSWORD` | DB password for migration push (Supabase → Settings → Database) |
| `SUPABASE_PROJECT_ID` | Project ref for `supabase link` in migration jobs |
| `CLOUDFLARE_API_TOKEN` | Authenticates `wrangler deploy` |
| `CLOUDFLARE_ACCOUNT_ID` | Target Cloudflare account for deploy |

#### Cloudflare Worker — runtime secrets

Server-side-only variables accessed at request time by the deployed Worker. Set these via the Cloudflare dashboard (**Worker → Settings → Variables → Secrets**) or with `wrangler secret put <NAME>`.

> `NEXT_PUBLIC_*` vars are baked into the bundle at build time and do **not** need to be set here.

| Secret | Where to find it |
|---|---|
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Project Settings → API |
| `ADMIN_USER_ID` | Your Supabase auth UUID (set after first login) |
| `TURNSTILE_SECRET_KEY` | Cloudflare Turnstile → Add site |

### 4. Run migrations

```bash
npx supabase login
npx supabase link --project-ref <your-project-ref>
npx supabase db push
```

This applies all migrations in `supabase/migrations/` in order and seeds the bot signature list.

### 5. First login and admin user

1. Go to `/admin/login` and sign in with your email via magic link
2. In the Supabase dashboard → **Authentication → Users**, copy your user UUID
3. Set `ADMIN_USER_ID=<that-uuid>` in your Cloudflare env vars and redeploy
4. *(Optional)* Enable TOTP MFA in Supabase Auth settings for a second factor

### 6. Fill in your content

Go to `/admin` and fill out your profile — name, bio, tagline, social links, experience, projects, and skills. The site renders entirely from this data.

## Local development

```bash
npm install
npm run dev
```

```bash
npm run lint        # Biome lint check
npm run format      # Biome format (writes)
npm test            # Vitest unit tests
npm run test:e2e    # Playwright E2E
```

## License

MIT — see [LICENSE](LICENSE).

---

Built by [Zaquariah Holland](https://zaquariah.dev)
