---
name: portfolio-checklist
description: Run the portfolio system-of-systems checklist before finalizing any change that touches public routes, DB tables, feature flags, analytics, or the design system. Ensures nothing gets silently missed across SEO, analytics, admin, and CI surfaces.
user-invocable: true
---

# portfolio-checklist

This portfolio is a layered system where every meaningful change has downstream implications. Run this checklist before considering any such change complete.

## When to invoke

Invoke proactively (before finalizing work) whenever the change involves any of:
- A new or removed public route / page
- A new or removed DB table or column
- A new or removed feature flag on `profile`
- A change to the design system tokens
- A new content type (e.g. a new admin-managed entity)
- Additions to analytics coverage

Also invoke when the user explicitly asks for it.

---

## Checklist by change type

### New public route or page (`/foo` or `/foo/[slug]`)

- [ ] **Middleware analytics** — `src/middleware.ts`: is the path matched by `isPublicPage()`? Check `PUBLIC_PATHS` array and the `startsWith` checks below it.
- [ ] **Sitemap** — `src/app/sitemap.ts`: does the new route appear? If it's dynamic (slug-based), are slugs fetched and listed?
- [ ] **robots.txt** — `src/app/robots.ts`: does the default `allow: '/'` cover it? If it should be blocked by a feature flag, is that flag checked?
- [ ] **llms.txt** — `src/app/llms.txt/route.ts`: should this route or its content appear in the AI-readable index?
- [ ] **OG image** — does the page have an `opengraph-image.tsx` alongside it, or does it inherit from the root? Project/post detail pages need their own.
- [ ] **JSON-LD** — does the page include appropriate structured data (`Article`, `SoftwareApplication`, `Person`, etc.)?
- [ ] **`generateMetadata`** — does the page export a typed `generateMetadata` with title, description, og, twitter fields?
- [ ] **Feature flag** — if this page can be toggled off, is it gated in `notFound()` and excluded from sitemap/robots/llms.txt consistently?
- [ ] **Left rail / nav** — does `TopNav`, `LeftRail`, or `MobileNav` need updating?

### New DB table or significant column addition

- [ ] **Migration file** — new file in `supabase/migrations/` with the next sequence number.
- [ ] **RLS policies** — anon gets SELECT on published/public rows only; authenticated gets full access. Never skip.
- [ ] **`src/types/index.ts`** — add the TypeScript interface.
- [ ] **`src/lib/db.ts`** — add typed query helper(s). Pages never import supabase directly.
- [ ] **Admin SCHEMA** — add an entry to `SCHEMAS` in `src/app/(admin)/admin/page.tsx` with fields, labels, and constraints.
- [ ] **Admin SECTION_GROUPS** — add or update the sidebar group entry.
- [ ] **`seed.sql`** — add representative dev seed rows so local dev isn't empty.
- [ ] **`admin_activity` audit** — writes to this table are logged automatically by the admin save path; verify the table name matches.

### New or changed feature flag on `profile`

Feature flags (`writing_enabled`, `projects_enabled`) must be consistent across **four** surfaces — if one is missed, the site is inconsistent:

- [ ] **`src/app/robots.ts`** — reads flag, conditionally disallows the path. Uses `force-dynamic` (immediate update).
- [ ] **`src/app/sitemap.ts`** — reads flag, omits URLs when disabled. Uses `revalidate = 3600`.
- [ ] **`src/app/llms.txt/route.ts`** — reads flag, omits section when disabled. Uses `revalidate = 3600`.
- [ ] **The page itself** — calls `notFound()` when flag is false.
- [ ] **Profile SCHEMA** in admin — the toggle field exists and is labeled clearly.

### Design system / token change

- [ ] **`src/app/globals.css`** — source of truth for all CSS custom properties. Change happens here first.
- [ ] **Hardcoded colors in OG images** — `src/app/opengraph-image.tsx` and any `*/opengraph-image.tsx` files use `profile.accent_color` dynamically, but fallback hex values (`#EC6A2C`, `#0B0C0E`) are hardcoded. Update fallbacks if the brand defaults change.
- [ ] **Admin page** — inline styles in `src/app/(admin)/admin/page.tsx` reference `var(--accent)`, `var(--canvas)`, etc. — these inherit from globals. Only hardcoded hex values in that file need manual review.
- [ ] **Fonts** — `--font-space` and `--font-mono` are loaded in `layout.tsx` via `next/font`. If a font changes, update both the `next/font` import and the CSS var.

### New dependency or package addition

- [ ] **Bundle size** — Cloudflare Workers free plan has a **3 MiB gzip** total upload limit. The CI `build` job checks `handler.mjs` uncompressed size against a 10 MiB proxy threshold and will fail before the dry-run if exceeded.
- [ ] **WASM packages are red flags** — `@vercel/og` / `next/og` (`ImageResponse`) bundles `resvg.wasm` (~1.3 MiB), `yoga.wasm` (~70 KiB), and a font (~123 KiB) into the Worker. That alone can push the bundle over the free plan limit. Do not add it without upgrading the Cloudflare plan first.
- [ ] **Dynamic OG images and icon** — `src/app/icon.tsx`, `src/app/opengraph-image.tsx`, `src/app/(public)/projects/[slug]/opengraph-image.tsx`, and `src/app/(public)/writing/[slug]/opengraph-image.tsx` were all removed because they pulled in `next/og`. `icon.tsx` was replaced with a static `src/app/icon.svg`. Restore the others only after upgrading to Workers paid plan or finding a WASM-free alternative.

### New analytics coverage area

- [ ] **Middleware** — `src/middleware.ts` `isPublicPage()` must match the new path.
- [ ] **Analytics API** — `src/app/api/analytics/route.ts` handles the POST; no change needed unless the `page_views` schema changes.
- [ ] **Admin analytics view** — `src/app/(admin)/admin/page.tsx` analytics tab reads `path`, `referrer`, `country`, `is_bot`, `bot_name`, `ip_hash`, `ts`. If new columns are added to `page_views`, update the select and display.
- [ ] **`page_views` migration** — if adding columns, add a migration file.

---

## Architecture reminders

**Data flow for public pages:**
```
Supabase DB → db.ts helper → server component → page
                                               → generateMetadata (OG, twitter, JSON-LD)
                                               → opengraph-image.tsx (dynamic image)
Middleware → /api/analytics POST → page_views table
```

**Feature flag cascade:**
```
profile.writing_enabled = false
  → robots.ts: disallow /writing (immediate, force-dynamic)
  → sitemap.ts: omit /writing/* (≤1 hr, revalidate=3600)
  → llms.txt: omit writing section (≤1 hr, revalidate=3600)
  → /writing page: notFound()
  → /writing/[slug]: notFound()
```

**Admin save path:**
```
SCHEMAS[section] → form → supabase browser client → Supabase DB
                                                   → admin_activity log
```

**Fork configurability principle:** No personal data hardcoded. All identity info (name, bio, social links, avatar) comes from the `profile` table. All env vars documented in README step 7.

---

## Quick file map

| Surface | File |
|---|---|
| Public routes | `src/app/(public)/` |
| API routes | `src/app/api/` |
| Middleware + analytics | `src/middleware.ts` |
| DB helpers | `src/lib/db.ts` |
| Types | `src/types/index.ts` |
| Admin CRUD | `src/app/(admin)/admin/page.tsx` |
| Sitemap | `src/app/sitemap.ts` |
| robots.txt | `src/app/robots.ts` |
| llms.txt | `src/app/llms.txt/route.ts` |
| Root OG image | `src/app/opengraph-image.tsx` |
| Root layout + JSON-LD | `src/app/layout.tsx` |
| Design tokens | `src/app/globals.css` |
| Migrations | `supabase/migrations/` |
| Seed data | `supabase/seed.sql` |
| E2E tests | `e2e/` |
| Unit tests | `src/tests/` |
