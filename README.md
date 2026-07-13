# Portfolio

[![Test](https://github.com/Zaqttack/portfolio/actions/workflows/test.yml/badge.svg)](https://github.com/Zaqttack/portfolio/actions/workflows/test.yml)
[![Deploy](https://github.com/Zaqttack/portfolio/actions/workflows/deploy.yml/badge.svg)](https://github.com/Zaqttack/portfolio/actions/workflows/deploy.yml)
[![Keep Supabase Alive](https://github.com/Zaqttack/portfolio/actions/workflows/keep-alive.yml/badge.svg)](https://github.com/Zaqttack/portfolio/actions/workflows/keep-alive.yml)

A self-hosted developer portfolio with a database-driven admin panel. All content — name, bio, experience, projects, writing, skills, links — is managed through the admin UI with no code changes required. Built to be forked and made your own.

## Stack

- **Framework** — Next.js 14 App Router, TypeScript, deployed on Cloudflare Workers (edge)
- **Database** — Supabase (Postgres) with RLS, Auth (magic link + TOTP MFA), and Storage
- **Styling** — CSS custom properties in `globals.css`, no component library
- **Fonts** — Space Grotesk + JetBrains Mono
- **Tests** — Vitest (unit), Playwright (E2E)
- **CI/CD** — GitHub Actions: lint → unit → smoke → build → deploy

## Features

- Admin portal at `/admin` — CRUD for all content, protected by Supabase Auth + user ID allowlist
- Configurable accent color, avatar, section visibility, and copy from the admin UI
- Resume PDF generated on-demand from your data
- Custom page view analytics — referrer, country, bot classification, unique visitor approximation; no cookies, no third-party required
- Cloudflare Web Analytics support — enable with one env var for aggregate dashboards (top pages, countries, Core Web Vitals)
- Dynamic sitemap, robots.txt, and `llms.txt` — all driven by your domain and feature flags, update automatically when you toggle sections
- JSON-LD structured data (Person, WebSite, SoftwareApplication) and Open Graph images generated from your profile data
- `import_staging` review queue for importing work data from a second machine

## Setup

### 1. Supabase

1. Create a project at [supabase.com](https://supabase.com)
2. Copy your project ref, URL, publishable key, and service role key
3. **Authentication → URL Configuration** — once you know your Worker domain from step 2, set **Site URL** to `https://your-worker.workers.dev` and add `https://your-worker.workers.dev/admin/auth/callback` to **Redirect URLs**. Also add `http://localhost:3000/admin/auth/callback` for local dev. Without this, magic links point to localhost and sign-in fails on the deployed site.
4. **Authentication → URL Configuration → Auth flow type** — set to **PKCE**. The callback route exchanges a `?code=` param; Implicit flow puts tokens in the URL fragment instead and will land on an error page.

### 2. Cloudflare Workers

1. Log in to [cloudflare.com](https://cloudflare.com) and note your **Account ID** from the Workers & Pages dashboard sidebar
2. Create an API token: **My Profile → API Tokens → Create Token → Edit Cloudflare Workers** template
3. Your Worker will be available at `https://portfolio.<account>.workers.dev` after first deploy. You can add a custom domain from the Worker's dashboard once it's live.

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
| `NEXT_PUBLIC_GSC_VERIFICATION` | *(Optional)* Google Search Console → Verify → HTML tag → content value |

#### GitHub Actions — repository secrets

Set at **repo → Settings → Secrets and variables → Actions**. These are used by the CI/CD workflows for building and deploying.

| Secret | Purpose |
|---|---|
| `NEXT_PUBLIC_SITE_DOMAIN` | Baked into the JS bundle during CI build |
| `NEXT_PUBLIC_SUPABASE_URL` | Baked into the JS bundle during CI build |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Baked into the JS bundle during CI build |
| `SUPABASE_ACCESS_TOKEN` | Authenticates Supabase CLI for migration jobs (supabase.com → Account → Access Tokens) |
| `SUPABASE_DB_PASSWORD` | DB password for migration push (Supabase → Settings → Database) |
| `SUPABASE_PROJECT_ID` | Project ref for `supabase link` in migration jobs |
| `CLOUDFLARE_API_TOKEN` | Authenticates `wrangler deploy` (from step 2) |
| `CLOUDFLARE_ACCOUNT_ID` | Target Cloudflare account for deploy (from step 2) |
| `WORKER_NAME` | *(Optional Actions variable, not a secret)* — name for the deployed Worker. Defaults to `portfolio` if unset. Set at **repo → Settings → Secrets and variables → Actions → Variables**. |

#### Cloudflare Worker — runtime secrets

Server-side-only variables accessed at request time by the deployed Worker. Set these via the Cloudflare dashboard (**Workers & Pages → your worker → Settings → Variables → Secrets**) or with `wrangler secret put <NAME>`.

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

This applies all migrations in `supabase/migrations/` in order, including the default bot signature list and a placeholder profile row so the site renders on first deploy.

### 5. First login and admin user

Sign-in is locked to existing users — new accounts can't be created from the login page. You need to create your account first, then configure the allowlist before you can actually reach `/admin`.

1. In the Supabase dashboard → **Authentication → Users → Invite user**, enter your email. This creates your account.
2. Copy your user UUID from the **Users** table — you'll need it before clicking any link.
3. Set `ADMIN_USER_ID=<that-uuid>` in your Cloudflare Worker secrets (see step 3) and redeploy via CI or `npm run deploy`.
4. Once the redeploy is live, go to `/admin/login` and request a fresh magic link. (The invite link from step 1 may have expired or routed to the wrong URL — always use a fresh link from the login page.)
5. *(Optional)* Enable TOTP MFA in **Supabase Auth → Configuration → Multi-factor authentication** for a second factor.

### 6. Fill in your content

Go to `/admin` and fill out your profile — name, bio, tagline, social links, experience, projects, and skills. The site renders entirely from this data.

### 7. SEO and analytics setup

#### What's automatic

Everything below is generated from your profile data and content — no code changes required for a fork.

| What | Where | Updates when |
|---|---|---|
| `/sitemap.xml` | Dynamic — includes only enabled pages + live project/post slugs with real `lastModified` | Profile flags change (≤1 hr), new content published |
| `/robots.txt` | Disallows `/admin`, `/api`, disabled sections. Allows AI search bots (ChatGPT, Perplexity, Claude search). | Profile flags change (immediate) |
| `/llms.txt` | AI-readable content map — identity, projects, writing, skills, experience. Guides ChatGPT/Perplexity/Claude to your best pages. | Content changes (≤1 hr) |
| Open Graph + Twitter card | On every public page — title, description, image | Profile data changes |
| JSON-LD `Person` + `WebSite` | Root layout — powers Google Knowledge Panel eligibility | Profile data changes |
| JSON-LD `SoftwareApplication` | Each project detail page | Per project |
| OG images | `/opengraph-image` (root, uses avatar + name) and `/projects/[slug]/opengraph-image` (cover image or generated card) | Profile / project data |

**Feature flags are consistent across all SEO surfaces.** If you disable writing or projects in the admin UI, those sections are automatically excluded from the sitemap, disallowed in robots.txt, and omitted from llms.txt. Toggle in admin → no code changes needed.

#### Google Search Console

Search Console tells Google your site exists, shows you what search terms surface it, and flags indexing errors.

1. Go to [search.google.com/search-console](https://search.google.com/search-console) and add a **Domain** property (not URL prefix — Domain covers all subdomains and both http/https)
2. Verify ownership via **DNS TXT record** — this is the simplest method if your domain is on Cloudflare:
   - Copy the `google-site-verification=...` TXT record value from Search Console
   - In [Cloudflare dashboard](https://dash.cloudflare.com) → your domain → **DNS → Records → Add record**
   - Type: `TXT`, Name: `@`, Content: the full `google-site-verification=...` string, TTL: Auto
   - Click **Verify** in Search Console — usually confirms within a minute
3. Submit your sitemap: **Sitemaps → Add a new sitemap** → enter `sitemap.xml` → Submit
4. Request indexing for your homepage: **URL Inspection** → enter your domain → **Request Indexing**

> **Alternative — HTML meta tag verification:** If you'd rather not touch DNS, set `NEXT_PUBLIC_GSC_VERIFICATION` in your env to the token value from `<meta name="google-site-verification" content="TOKEN">` (just the token, not the full tag). Add this to your GitHub Actions secrets and Cloudflare Worker secrets too so the tag appears in production.

#### Bing Webmaster Tools *(optional, feeds Microsoft Copilot)*

1. Go to [bing.com/webmasters](https://www.bing.com/webmasters) and sign in with a Microsoft account
2. Add your site and verify — choose **XML file** or **DNS** (the same Google TXT record works here too, or import from Search Console automatically)
3. Submit sitemap: **Sitemaps → Submit sitemap** → `https://yourdomain.com/sitemap.xml`

#### Cloudflare Web Analytics *(recommended — free, no cookies)*

You're already on Cloudflare. Web Analytics gives you top pages, countries, referrers, devices, and Core Web Vitals with no cookies and no GDPR banner required.

1. Go to [dash.cloudflare.com](https://dash.cloudflare.com) → **Workers & Pages** → select your Worker → **Web Analytics** tab (or go to **Analytics & Logs → Web Analytics** in the sidebar)
2. Click **Enable** — Cloudflare generates a beacon token for your site
3. Copy the token (a ~32-character hex string from the script tag it shows you)
4. Add it to your env:
   ```bash
   NEXT_PUBLIC_CF_BEACON_TOKEN=your_token_here
   ```
   Also add to GitHub Actions secrets (for CI builds) and Cloudflare Worker env vars
5. Redeploy — the beacon script is injected automatically when the token is set

The script only loads when `NEXT_PUBLIC_CF_BEACON_TOKEN` is present, so local dev and staging environments without the token stay clean.

#### Custom page view analytics *(built-in, no setup required)*

The site logs every public page hit to the `page_views` Supabase table automatically. Unlike Cloudflare Web Analytics (which gives aggregates), this gives you raw, queryable data:

- **Which pages get traffic** — see if a specific project page is getting hits
- **Where traffic comes from** — `referrer` shows if Google, LinkedIn, or someone's GitHub README is sending visitors
- **Geography** — `country` from Cloudflare's edge headers, no geolocation service needed
- **Unique visitor approximation** — `ip_hash` (SHA-256, never raw IP) lets you estimate distinct visitors without storing personal data
- **Bot visibility** — `is_bot` and `bot_name` tell you which crawlers are hitting you (Googlebot, GPTBot, etc.) and how often, separate from human traffic

View raw data anytime in [Supabase Studio](https://supabase.com/dashboard) → your project → **Table Editor → page_views**. You can also query it directly: top pages by hits, traffic by country, daily trend, human vs. bot ratio.

#### Analytics env vars

| Variable | Where to find it | Required |
|---|---|---|
| `NEXT_PUBLIC_SITE_DOMAIN` | Your domain, e.g. `yoursite.dev` | Yes |
| `NEXT_PUBLIC_CF_BEACON_TOKEN` | Cloudflare dashboard → Web Analytics → your site → token | No |
| `NEXT_PUBLIC_GSC_VERIFICATION` | Google Search Console → Verify → HTML tag → token value only | No |

### 8. Update the README badges

The CI badges at the top of this file point to the original repo. Replace `Zaqttack/portfolio` in the three badge URLs with your GitHub username and repo name to track your own deployments.

## Troubleshooting

### Magic link redirects to localhost

The magic link email is sending users to `http://localhost:3000`. Fix: Supabase dashboard → **Authentication → URL Configuration** → set **Site URL** to your deployed domain and add the callback URL to **Redirect URLs** (see setup step 1).

### Magic link callback lands on `?error=no_code`

The URL hitting `/admin/auth/callback` has no `?code=` parameter. This means Supabase is using Implicit flow instead of PKCE. Fix: Supabase dashboard → **Authentication → URL Configuration → Auth flow type** → set to **PKCE**, then request a fresh magic link from `/admin/login`.

### Magic link callback lands on `?error=auth_error`

The code exchange failed. Most common causes:
- **Stale link** — the invite or magic link was clicked before redirect URLs were configured correctly (it routed to localhost and the code was consumed). Request a fresh magic link from `/admin/login`.
- **User doesn't exist** — sign-in is locked to existing users. Create your account via **Authentication → Users → Invite user** in the Supabase dashboard first.

### `/admin` redirects back to `/admin/login` after successful sign-in

`ADMIN_USER_ID` isn't set or doesn't match your Supabase user UUID. The middleware checks the session user ID against this value. Set it in your Cloudflare Worker secrets and redeploy.

## Local development

```bash
npm install
npm run dev       # Next.js dev server — reads from .env
```

To run the actual Cloudflare Worker locally (closer to production):

```bash
cp .dev.vars.example .dev.vars
# fill in .dev.vars, then:
npm run preview   # builds the Worker and runs it via wrangler dev
```

`.dev.vars` is the Wrangler equivalent of `.env` — it holds runtime secrets for local Worker execution. The `NEXT_PUBLIC_*` vars still come from `.env` since they're baked at build time.

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
