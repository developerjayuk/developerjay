# Feature: PB-0001 — Project scaffold, Supabase schema, and shared infra

The following plan should be complete, but its important that you validate documentation and codebase patterns and task sanity before you start implementing.

Pay special attention to naming of existing utils types and models. Import from the right files etc.

## Feature Description

Stand up the greenfield Next.js + Supabase skeleton this entire project sits on: the App Router
scaffold, the `posts` schema + RLS policies + image storage bucket in Supabase, the two Supabase
client modules (browser + privileged server), the `next-themes` dark-mode wiring, an env template,
and a routing-only `middleware.ts` stub. No admin or public UI is built here — this ticket proves
the plumbing works (`next build` succeeds, the app can query the empty `posts` table, the theme
toggle flips light/dark) so every later ticket (auth, CRUD, uploads, public pages, search, deploy)
has solid ground to build on.

## User Story

As Jason (sole admin and builder)
I want a working Next.js + Supabase scaffold with the schema, access boundaries, and shared infra in place
So that I can build the admin and public features on top of it without re-deciding stack plumbing per ticket

## Problem Statement

Nothing exists yet — no `package.json`, no `app/` directory, no Supabase project. Every other
ticket (PB-0002 through PB-0007) depends directly or transitively on this one. Until the schema,
RLS policies, and the `service_role`/`anon` client split exist, no admin auth, CRUD, or public page
work can start.

## Solution Statement

Scaffold Next.js (App Router, TypeScript, Tailwind v4) via `create-next-app`, create a Supabase
project and manage its schema through Supabase-CLI-tracked migrations (`posts` table, RLS, storage
bucket), add the `lib/supabase/client.ts` (publishable key, browser) and `lib/supabase/server.ts`
(secret key, privileged, server-only) modules, wire `next-themes`, add a routing-only
`middleware.ts` stub scoped to `/admin/:path*`, and prove it all works end-to-end with a minimal
smoke-test home page that queries the `posts` table and exposes the theme toggle.

## Out of Scope / Non-Goals

- **Real auth/session logic in `middleware.ts`** — this ticket only creates the file with a
  pass-through handler and the `/admin/:path*` matcher. The actual session + email-allowlist check
  is PB-0002.
- **The cookie-aware, session-checking Supabase client** (`lib/supabase/middleware.ts` in the
  standard `@supabase/ssr` pattern) — not needed until PB-0002 needs to read/refresh a session.
  Building it now would be speculative; PB-0002 owns it.
- **Any admin or public route/page beyond a throwaway smoke-test home page** — `/admin/*` (PB-0002,
  PB-0003) and `app/(public)/*` (PB-0005) are separate tickets with their own route groups.
- **Login, CRUD, image upload, search** — all separate tickets (PB-0002 through PB-0006).
- **Automated tests** — per CLAUDE.md, no test suite exists yet and none is added speculatively;
  validation here is `next build` + manual browser/CLI checks.
- **Vercel/DNS deployment** — PB-0007.

## Feature Metadata

**Feature Type**: New Capability (greenfield scaffold)
**Estimated Complexity**: Medium (mostly config/scaffold breadth, but the Supabase schema/RLS and
the client-key split are the two things CLAUDE.md flags as worth planning carefully)
**Primary Systems Affected**: Next.js app root (`app/`, `middleware.ts`), `lib/supabase/`,
`lib/theme/`, Supabase project (schema, RLS, storage), env config
**Dependencies**: `next`, `react`, `tailwindcss` (v4, via `create-next-app`), `@supabase/supabase-js`,
`@supabase/ssr`, `next-themes`, Supabase CLI (dev dependency / global tool), a live Supabase project

## Related Work

**Implements**: [`docs/tickets/pb-0001.md`](../../docs/tickets/pb-0001.md)
**Epic**: [`personal-blog-platform.prd.md`](../../personal-blog-platform.prd.md) (PRD §1–9 +
Architecture section, same file) — architecture decisions (stack, data model, security boundaries)
are inherited from there, not re-decided here.

**Back-references** (plans this builds on or inherits decisions from):

- None — this is the first implementation plan for the project.

**Forward-references** (plans that extend or supersede this — append as follow-ups get created):

- PB-0002 (admin auth) will add `lib/supabase/middleware.ts` (session-aware client) and fill in
  real `middleware.ts` logic on top of the stub this ticket creates.
- PB-0003 (admin CRUD) will consume `lib/supabase/server.ts` for all mutations.
- PB-0005 (public pages) will consume `lib/supabase/client.ts` / the anon read path and the
  `next-themes` toggle component this ticket creates.
- PB-0006 (search) will add a migration on top of the `posts` table this ticket creates.

---

## CONTEXT REFERENCES

### Relevant Codebase Files — READ THESE BEFORE IMPLEMENTING

- [`CLAUDE.md`](../../CLAUDE.md) — architecture map (`lib/supabase/` split, `middleware.ts` role),
  ground rules (no hand-rolled backend, ISR not SSR, `next-themes` not a hand-rolled context),
  working principles (plan-first for auth/RLS/data-model — this ticket touches all three).
- [`.claude/references/data-model.md`](../../.claude/references/data-model.md) — the exact `posts`
  schema (columns, types), the "no join table for tags" and "no media table" decisions this
  migration must implement verbatim.
- [`.claude/references/supabase-access-control.md`](../../.claude/references/supabase-access-control.md) —
  the two-key boundary (`service_role`/secret server-only, `anon`/publishable client-safe) and the
  RLS enforcement model (`status = 'published'` for anon, full access for authenticated) this
  ticket's clients and RLS policies must match.
- [`personal-blog-platform.prd.md`](../../personal-blog-platform.prd.md) lines 116–192 (Architecture
  section) — "Recommended approach", "Key decisions", and "Missing pieces" bullets are the direct
  source for this ticket's scope; don't re-litigate the Approach A/B/C decision recorded there.
- [`docs/tickets/pb-0001.md`](../../docs/tickets/pb-0001.md) — the ticket this plan implements;
  its AC and "Files touched" estimate are the acceptance bar.

### New Files to Create

- `package.json`, `tsconfig.json`, `next.config.ts`, `eslint.config.mjs`, `postcss.config.mjs` —
  generated by `create-next-app`.
- `src/app/layout.tsx` — root layout, wraps children in the theme provider.
- `src/app/page.tsx` — minimal smoke-test home page (queries `posts` count via the privileged
  server client, renders the theme toggle).
- `src/app/globals.css` — Tailwind v4 entry (`@import "tailwindcss";` + `@theme` token block —
  Tailwind v4 has no `tailwind.config.ts` by default; see Notes for why this deviates from the
  ticket's file estimate).
- `src/middleware.ts` — routing-only stub, `/admin/:path*` matcher, `NextResponse.next()`.
- `src/lib/supabase/client.ts` — browser client, publishable key.
- `src/lib/supabase/server.ts` — privileged server client, secret key, RLS-bypassing.
- `src/lib/theme/theme-provider.tsx` — thin wrapper around `next-themes`' `ThemeProvider`.
- `src/lib/theme/theme-toggle.tsx` — client component, light/dark toggle button.
- `supabase/migrations/<timestamp>_init_schema.sql` — `posts` table, indexes, RLS policies, storage
  bucket + storage policies.
- `.env.local.example` — documents required env vars (URL, publishable key, secret key, admin
  email).
- `.env.local` — real values, gitignored, filled in locally by Jason (never committed).
- `README.MD` — append a "Local setup" section documenting the manual Supabase Auth config step
  (disable public sign-up, create the one admin user via dashboard).

### Relevant Documentation — READ BEFORE IMPLEMENTING

- [Supabase: Setting up Server-Side Auth for Next.js](https://supabase.com/docs/guides/auth/server-side/nextjs)
  - `createBrowserClient` / `createServerClient` from `@supabase/ssr`.
  - Why: `lib/supabase/client.ts` follows the browser-client half of this pattern exactly. The
    server half (cookie-based `createServerClient`) is intentionally **not** used in this ticket's
    `server.ts` — see Notes for why this project's privileged server client uses plain
    `@supabase/supabase-js` instead.
- [Supabase: Migrating to publishable and secret API keys](https://supabase.com/docs/guides/getting-started/migrating-to-new-api-keys)
  - Why: this project starts on the new key system (`sb_publishable_...` / `sb_secret_...`) per the
    decision made in chat on 2026-08-19 — legacy `anon`/`service_role` keys deprecate end of 2026,
    no reason for a greenfield project to start on the old system.
- [Supabase CLI: Local Development / Migrations](https://supabase.com/docs/guides/local-development/overview)
  - `supabase init`, `supabase link --project-ref <ref>`, `supabase migration new <name>`,
    `supabase db push`.
  - Why: migrations are CLI-managed and checked in per the decision made in chat — no local Docker
    stack required just to push migration files to the linked remote project.
- [next-themes README](https://github.com/pacocoursey/next-themes)
  - `ThemeProvider` props (`attribute="class"`, `defaultTheme="system"`, `enableSystem`), and the
    `suppressHydrationWarning` requirement on `<html>`.
  - Why: CLAUDE.md mandates `next-themes`, not a hand-rolled theme context.
- [Next.js: create-next-app CLI reference](https://nextjs.org/docs/app/api-reference/cli/create-next-app)
  - Why: confirms current (2026) defaults — TypeScript, Tailwind v4, App Router, ESLint, Turbopack,
    `src/` dir, `@/*` import alias — used for the exact scaffold flags in Task 1.

### Patterns to Follow

Nothing exists in this repo yet to mirror — this ticket establishes the first patterns. The
patterns below are what *later* tickets will mirror, so get them right here:

**Naming Conventions:**
- Files: kebab-case for non-component modules (`theme-toggle.tsx`, `client.ts`), PascalCase export
  names for components (`ThemeToggle`, `ThemeProvider`).
- Supabase client factories are both named `createClient()` (matches Supabase's own SSR docs
  convention), disambiguated by import path (`@/lib/supabase/client` vs `@/lib/supabase/server`) —
  never import one where the other belongs. This is the single most important convention in the
  whole project per `supabase-access-control.md`.

**Error Handling:**
- No custom error-handling layer for this ticket — the smoke-test page can let a Supabase query
  error surface via Next.js's default error boundary (there's nothing meaningful to recover to yet).
  Real error handling patterns get established in PB-0003 (Server Actions) and PB-0005 (public data
  fetching), not here.

**Env Access:**
- Public/browser-safe vars: `NEXT_PUBLIC_` prefix (`NEXT_PUBLIC_SUPABASE_URL`,
  `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`). Server-only secret: `SUPABASE_SECRET_KEY` (no
  `NEXT_PUBLIC_` prefix — Next.js will refuse to inline it into client bundles, which is the point).

**Other Relevant Patterns:**
- Every Supabase read/write goes through `lib/supabase/server` or `lib/supabase/client` — no
  ad-hoc `createClient()` calls anywhere else in the app, per CLAUDE.md's "Where new code goes".

---

## IMPLEMENTATION PLAN

Phases run top to bottom by default; two are flagged as independent/parallelizable below.

### Phase 1: Next.js scaffold

Get a bare, building Next.js app into the repo root without clobbering existing files
(`README.MD`, `.claude/`, `.agents/`, `.archon/`, `docs/`, `personal-blog-platform.prd.md`).

**Tasks:**

- Scaffold via `create-next-app` into an isolated temp directory first (avoids the case-insensitive
  `README.md`/`README.MD` collision and any prompt friction from a non-empty target directory), then
  move only the generated app files into the repo root.
- Confirm `next build` and `next dev` both run cleanly before touching anything else.

### Phase 2: Supabase project + schema (external precondition)

**Depends on:** the Supabase project existing (Jason creates it manually in the dashboard — see
Open Questions; this phase cannot start until the project + credentials exist).
**Independent of:** Phase 1 — the Next.js scaffold and the Supabase project/schema have no file
overlap and can be done in either order or in parallel (one person: dashboard project creation
while `create-next-app` runs; or split across two sessions).

**Tasks:**

- `supabase init` at repo root, `supabase link --project-ref <ref>`.
- Write the migration SQL (`posts` table, indexes, RLS policies, storage bucket + storage
  policies) exactly as specified in Task-level detail below.
- `supabase db push` to apply it to the linked project.
- Manually, in the Supabase dashboard: disable public sign-up (Authentication → Providers → Email),
  create the one admin user (Authentication → Users → Add user) with `developerjayuk@gmail.com`.

### Phase 3: Shared infra (Supabase clients, theme, middleware stub)

**Depends on:** Phase 1 (needs `package.json`/`src/` to exist to add files into).
**Independent of:** Phase 2's *external* dashboard steps, but the `.env.local` values these clients
read come from Phase 2 — code can be written before the project exists, but won't run until it does.

**Tasks:**

- `npm install @supabase/supabase-js @supabase/ssr next-themes`.
- Create `lib/supabase/client.ts`, `lib/supabase/server.ts`.
- Create `lib/theme/theme-provider.tsx`, `lib/theme/theme-toggle.tsx`; wire into `app/layout.tsx`.
- Create `middleware.ts` stub with `/admin/:path*` matcher.
- Create `.env.local.example`; document required values.

### Phase 4: Integration & smoke test

**Depends on:** Phases 1–3 all complete, and a real Supabase project + `.env.local` filled in.

**Tasks:**

- Build the smoke-test home page: query `posts` count via the privileged server client, render it
  alongside the theme toggle.
- Run `next build`; fix any type/lint errors.
- Manually verify in the browser: page loads, shows `0` posts, theme toggle flips light/dark and
  persists across a reload.

---

## STEP-BY-STEP TASKS

IMPORTANT: Execute every task in order, top to bottom. Each task is atomic and independently testable.

### CREATE Next.js scaffold (temp dir → repo root)

- **IMPLEMENT**: In a scratch/temp directory, run:
  `npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --turbopack --use-npm --yes`
  Then move `src/`, `public/`, `next.config.ts`, `tsconfig.json`, `package.json`,
  `package-lock.json`, `eslint.config.mjs`, `postcss.config.mjs`, `next-env.d.ts` into the repo
  root. **Do not** copy the generated `README.md` (keep the repo's existing `README.MD` — Windows'
  case-insensitive filesystem means these collide; the repo's real README wins) or its `.gitignore`
  wholesale — merge any new ignore entries (`.next/`, `node_modules/`, `.env*.local`) into the
  existing `.gitignore` instead of overwriting it.
- **PATTERN**: N/A — first scaffold in the repo.
- **IMPORTS**: N/A.
- **GOTCHA**: Tailwind v4 (current `create-next-app` default) generates no `tailwind.config.ts` —
  config lives in `src/app/globals.css` via `@import "tailwindcss";` and an `@theme` block. The
  ticket's "Files touched" estimate lists `tailwind.config.ts`; treat `globals.css` as its
  replacement, not an extra file (see Notes).
- **VALIDATE**: `npm run build` (should succeed with the default starter page).
- **SATISFIES**: AC "`next build` succeeds".

### CREATE Supabase project (manual, dashboard)

- **IMPLEMENT**: Jason creates the project at supabase.com/dashboard (name, region, DB password),
  then under Authentication → Providers → Email, disables "Allow new users to sign up", then under
  Authentication → Users, manually adds one user with email `developerjayuk@gmail.com`.
- **PATTERN**: N/A — one-time manual dashboard step, not code. Document it in the README per the
  ticket's AC ("document it in a README/setup note, don't try to automate via SQL").
- **IMPORTS**: N/A.
- **GOTCHA**: Public sign-up defaults to **on** in Supabase — this step is the actual security
  boundary the whole `/admin` gate depends on (per `supabase-access-control.md`); skipping it means
  PB-0002's middleware check is the *only* thing standing between a stray sign-up and the admin
  panel.
- **VALIDATE**: In the dashboard, confirm "Allow new users to sign up" is off and exactly one user
  exists under Authentication → Users.
- **SATISFIES**: Ticket AC "Manual Supabase Auth config note" precondition.

### CREATE supabase/migrations/<timestamp>_init_schema.sql

- **IMPLEMENT**:
  ```sql
  -- posts table
  create table if not exists public.posts (
    id uuid primary key default gen_random_uuid(),
    slug text not null unique,
    title text not null,
    excerpt text,
    content text not null default '',
    cover_image_url text,
    tags text[] not null default '{}',
    status text not null default 'draft' check (status in ('draft', 'published')),
    published_at timestamptz,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
  );

  create index if not exists posts_tags_gin_idx on public.posts using gin (tags);
  create index if not exists posts_status_idx on public.posts (status);

  -- keep updated_at current on every write
  create or replace function public.set_updated_at()
  returns trigger as $$
  begin
    new.updated_at = now();
    return new;
  end;
  $$ language plpgsql;

  drop trigger if exists posts_set_updated_at on public.posts;
  create trigger posts_set_updated_at
    before update on public.posts
    for each row execute function public.set_updated_at();

  -- RLS
  alter table public.posts enable row level security;

  create policy "public read published posts"
    on public.posts for select
    using (status = 'published');

  create policy "admin full access"
    on public.posts for all
    using (auth.role() = 'authenticated')
    with check (auth.role() = 'authenticated');

  -- storage bucket for post images
  insert into storage.buckets (id, name, public)
  values ('post-images', 'post-images', true)
  on conflict (id) do nothing;

  create policy "public read post images"
    on storage.objects for select
    using (bucket_id = 'post-images');

  create policy "admin write post images"
    on storage.objects for insert
    with check (bucket_id = 'post-images' and auth.role() = 'authenticated');

  create policy "admin update post images"
    on storage.objects for update
    using (bucket_id = 'post-images' and auth.role() = 'authenticated');

  create policy "admin delete post images"
    on storage.objects for delete
    using (bucket_id = 'post-images' and auth.role() = 'authenticated');
  ```
- **PATTERN**: Matches `.claude/references/data-model.md` column-for-column; RLS matches the
  "session role only" design decided in chat (no email hardcoded into the policy — the email
  allowlist check lives in PB-0002's middleware, not the DB).
- **IMPORTS**: N/A (SQL).
- **GOTCHA**: The `set_updated_at` trigger is **not** explicitly requested by the ticket or the
  data-model reference — it's an addition to prevent `updated_at` silently going stale on every
  edit in PB-0003. Flagged in Open Questions below; drop it if Jason prefers `updated_at` to be
  set explicitly by application code instead.
- **VALIDATE**: `supabase db push` (from repo root, after `supabase link`), then in the Supabase
  SQL editor: `select * from public.posts;` returns an empty result with no error, and
  `select * from storage.buckets where id = 'post-images';` returns one row.
- **SATISFIES**: AC "app connects to Supabase and can query the empty `posts` table"; ticket scope
  bullets for RLS policies and the storage bucket.

### CREATE src/lib/supabase/client.ts

- **IMPLEMENT**:
  ```ts
  import { createBrowserClient } from "@supabase/ssr";

  export function createClient() {
    return createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    );
  }
  ```
- **PATTERN**: [Supabase server-side auth guide](https://supabase.com/docs/guides/auth/server-side/nextjs) —
  browser-client half only.
- **IMPORTS**: `@supabase/ssr`.
- **GOTCHA**: Publishable key only — never import `SUPABASE_SECRET_KEY` here; this file ships to
  the browser bundle.
- **VALIDATE**: `npm run build` — Next.js will fail the build if a server-only env var leaks into a
  client-referenced module, so a clean build is a real check here, not just a formality.
- **SATISFIES**: Ticket scope bullet "`lib/supabase/client.ts` (anon key, browser-safe)".

### CREATE src/lib/supabase/server.ts

- **IMPLEMENT**:
  ```ts
  import { createClient as createSupabaseClient } from "@supabase/supabase-js";

  export function createClient() {
    return createSupabaseClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SECRET_KEY!,
      { auth: { persistSession: false, autoRefreshToken: false } },
    );
  }
  ```
- **PATTERN**: Plain `@supabase/supabase-js`, **not** `@supabase/ssr`'s `createServerClient` — this
  client is privileged (bypasses RLS via the secret key) and has no session/cookie concept at all,
  unlike the standard SSR server-client pattern which reads the *user's* session. See Notes for the
  full rationale; this is the deliberate deviation from CLAUDE.md's literal two-file description
  that Ticket 1 needs to get right before PB-0002 builds the third (session-aware) client on top.
- **IMPORTS**: `@supabase/supabase-js`.
- **GOTCHA**: Must never be imported into a file marked `"use client"` or any client component —
  `SUPABASE_SECRET_KEY` has no `NEXT_PUBLIC_` prefix specifically so Next.js keeps it server-only;
  importing this module client-side will surface as a build/runtime error, which is the intended
  guardrail.
- **VALIDATE**: `npm run build`.
- **SATISFIES**: Ticket scope bullet "`lib/supabase/server.ts` (service_role key, server-only —
  never imported into a client component)".

### CREATE src/lib/theme/theme-provider.tsx

- **IMPLEMENT**:
  ```tsx
  "use client";

  import { ThemeProvider as NextThemesProvider } from "next-themes";
  import type { ComponentProps } from "react";

  export function ThemeProvider({
    children,
    ...props
  }: ComponentProps<typeof NextThemesProvider>) {
    return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
  }
  ```
- **PATTERN**: [next-themes README](https://github.com/pacocoursey/next-themes) — standard
  App Router wrapper pattern (next-themes requires the provider in a client component).
- **IMPORTS**: `next-themes`, `react`.
- **GOTCHA**: None here — the hydration-warning gotcha applies at the `<html>` tag in `layout.tsx`,
  not this file.
- **VALIDATE**: `npm run build`.
- **SATISFIES**: Ticket scope bullet "`next-themes` `ThemeProvider` wired into the root layout".

### CREATE src/lib/theme/theme-toggle.tsx

- **IMPLEMENT**: Client component using `useTheme()` from `next-themes`; a single `<button>` that
  reads `resolvedTheme` and calls `setTheme(resolvedTheme === "dark" ? "light" : "dark")`; guard
  against SSR/hydration mismatch by rendering nothing (or a disabled placeholder) until mounted
  (`useEffect` + `useState` mounted flag — the standard next-themes gotcha).
- **PATTERN**: [next-themes README](https://github.com/pacocoursey/next-themes) "avoid hydration
  mismatch" section.
- **IMPORTS**: `next-themes`, `react`.
- **GOTCHA**: Skipping the mounted-guard causes a light/dark flash or a hydration warning — don't
  skip it even though this is "just" a scaffold ticket, since PB-0005 will reuse this exact
  component on the public layout.
- **VALIDATE**: `npm run dev`, click the toggle in the browser — theme flips and survives a
  page reload (next-themes persists to `localStorage` by default).
- **SATISFIES**: Ticket scope bullet "one reusable theme-toggle component"; AC "toggling the theme
  switches light/dark".

### UPDATE src/app/layout.tsx

- **IMPLEMENT**: Add `suppressHydrationWarning` to the `<html>` tag; wrap `{children}` in
  `<ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>`.
- **PATTERN**: [next-themes README](https://github.com/pacocoursey/next-themes) App Router example.
- **IMPORTS**: `@/lib/theme/theme-provider`.
- **GOTCHA**: `suppressHydrationWarning` goes on `<html>`, not `<body>` — next-themes sets the
  `class` attribute on `<html>` before hydration, and without the warning suppressed React logs a
  (harmless but noisy) mismatch every render in dev.
- **VALIDATE**: `npm run build`.
- **SATISFIES**: Ticket scope bullet "wired into the root layout".

### CREATE src/middleware.ts

- **IMPLEMENT**:
  ```ts
  import { NextResponse, type NextRequest } from "next/server";

  export function middleware(_request: NextRequest) {
    return NextResponse.next();
  }

  export const config = {
    matcher: ["/admin/:path*"],
  };
  ```
- **PATTERN**: Routing stub only, per ticket scope ("this ticket just establishes the file so
  Ticket 2 doesn't create it from scratch").
- **IMPORTS**: `next/server`.
- **GOTCHA**: Do **not** add session-checking logic here — that's explicitly PB-0002's concern; the
  matcher is scoped now so PB-0002 doesn't have to remember to add it.
- **VALIDATE**: `npm run build`; hit `/admin/anything` in dev and confirm it passes through
  unmodified (no gating exists yet — that's expected and correct for this ticket).
- **SATISFIES**: Ticket scope bullet "`middleware.ts` file created (routing stub only)".

### CREATE .env.local.example

- **IMPLEMENT**:
  ```
  NEXT_PUBLIC_SUPABASE_URL=
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
  SUPABASE_SECRET_KEY=
  ADMIN_EMAIL=developerjayuk@gmail.com
  ```
- **PATTERN**: New-key-system naming (`PUBLISHABLE`/`SECRET`), per the decision made in chat.
- **IMPORTS**: N/A.
- **GOTCHA**: `ADMIN_EMAIL` isn't consumed by any code in this ticket (PB-0002 reads it in
  middleware) — it's documented here because this ticket owns `.env.local.example`, and it's one
  fewer thing for PB-0002 to remember to add.
- **VALIDATE**: File exists, contains no real secret values, is tracked by git (confirm it's *not*
  matched by `.gitignore` — only `.env*.local` should be ignored, not the `.example` file).
- **SATISFIES**: Ticket scope bullet "`.env.local.example` documenting the required Supabase
  URL/keys".

### CREATE src/app/page.tsx (smoke test)

- **IMPLEMENT**: Server component. Import `createClient` from `@/lib/supabase/server`, run
  `const { count } = await supabase.from("posts").select("*", { count: "exact", head: true })`,
  render the count and the `<ThemeToggle />` component. Minimal styling (Tailwind utility classes),
  no design polish — this page gets replaced entirely by PB-0005's real public list page.
- **PATTERN**: N/A — first data-fetching code in the repo.
- **IMPORTS**: `@/lib/supabase/server`, `@/lib/theme/theme-toggle`.
- **GOTCHA**: Using the *privileged* server client here (not the anon path) is deliberate — this
  page is a connectivity smoke test, not the real published-only public list (that's PB-0005, which
  will use the anon/RLS-enforced read path properly). Don't over-build this page.
- **VALIDATE**: `npm run dev`, load `/` in a browser: page renders "0 posts" (or similar) with no
  server error, and the theme toggle works.
- **SATISFIES**: AC "app connects to Supabase and can query the empty `posts` table"; AC "toggling
  the theme switches light/dark".

### UPDATE README.MD

- **IMPLEMENT**: Add a "Local setup" section: `npm install`, copy `.env.local.example` →
  `.env.local` and fill in real values from the Supabase dashboard (Settings → API Keys), the
  manual Supabase Auth steps (disable sign-up, create the one admin user), `supabase link`, and
  `npm run dev`.
- **PATTERN**: Matches the ticket's explicit instruction: "document it in a README/setup note,
  don't try to automate via SQL."
- **IMPORTS**: N/A.
- **GOTCHA**: None.
- **VALIDATE**: Manual read-through — could someone unfamiliar with the project follow this and get
  a running dev server?
- **SATISFIES**: Ticket scope bullet "Manual Supabase Auth config note... document it in a
  README/setup note".

---

## TESTING STRATEGY

Per CLAUDE.md, no automated test suite exists yet and none is added speculatively for this ticket
— "a manual check (dev server, exercise the actual flow in the browser) is enough for now."

### Unit Tests

None for this ticket — there's no business logic yet, only scaffold/config/connectivity.

### Integration Tests

None for this ticket.

### Edge Cases

- Missing/blank env vars: confirm the app fails loudly (build or runtime error) rather than
  silently querying a wrong/undefined Supabase URL.
- Theme toggle before JS hydrates: confirm no flash-of-wrong-theme or console hydration warning
  (covered by the mounted-guard in `theme-toggle.tsx`).
- `SUPABASE_SECRET_KEY` accidentally referenced from a client component: confirm this actually
  breaks the build (proves the server/client boundary is real, not just conventional).

---

## VALIDATION COMMANDS

### Level 1: Syntax & Style

```bash
npm run lint
```

### Level 2: Unit Tests

N/A — none exist for this ticket (see Testing Strategy).

### Level 3: Integration Tests

N/A — none exist for this ticket.

### Level 4: Manual Validation

```bash
npm run build
npm run dev
```

- Open `http://localhost:3000` — page loads, shows the post count (0), no console errors.
- Click the theme toggle — page switches light/dark; reload the page — the choice persisted.
- Visit `http://localhost:3000/admin/anything` — request passes through (no gating yet; expected).
- In the Supabase dashboard SQL editor: `select * from public.posts;` — succeeds, zero rows.
- In the Supabase dashboard: confirm public sign-up is disabled and exactly one user exists.

### Level 5: Additional Validation (Optional)

```bash
supabase db push --dry-run
```
Confirms the migration is in sync with what's already applied before pushing for real.

---

## ACCEPTANCE CRITERIA

- [ ] `next build` succeeds with zero errors.
- [ ] The app connects to Supabase and successfully queries the empty `posts` table.
- [ ] Toggling the theme switches light/dark and persists across reloads.
- [ ] `posts` table exists with RLS enabled: anon reads limited to `status = 'published'`;
      authenticated session has full read/write.
- [ ] `post-images` storage bucket exists, public read, authenticated-only write.
- [ ] `lib/supabase/server.ts` uses the secret key and is never imported into a client component.
- [ ] `lib/supabase/client.ts` uses the publishable key only.
- [ ] `middleware.ts` exists, scoped to `/admin/:path*`, pass-through only (no auth logic).
- [ ] `.env.local.example` documents all required env vars; `.env.local` is gitignored.
- [ ] Public sign-up is disabled in Supabase Auth config; the one admin user exists.
- [ ] README documents local setup steps for a future session (or Jason in six months) to follow.

---

## COMPLETION CHECKLIST

- [ ] All tasks completed in order
- [ ] Each task validation passed immediately
- [ ] All validation commands executed successfully
- [ ] `npm run build` and `npm run lint` both clean
- [ ] Manual testing confirms the smoke-test page and theme toggle work
- [ ] Acceptance criteria all met
- [ ] Code reviewed for quality and maintainability

---

## OPEN QUESTIONS / ASSUMPTIONS

1. **Supabase project does not exist yet.** Jason had not created it as of the last message in
   this conversation ("do not start yet"). Phase 2 (schema/RLS/storage) and Phase 4 (smoke test)
   cannot execute until the project exists and `.env.local` is filled in with real values. Phase 1
   (scaffold) and most of Phase 3 (client modules, theme, middleware stub) can proceed without it.
2. **`updated_at` trigger** (`set_updated_at`) is an addition beyond what `data-model.md` or the
   ticket literally specifies. Assumption: better to set it in the DB than to trust every future
   mutation path (PB-0003's create/update, plus any future admin action) to remember to set it
   manually. Flag if Jason prefers explicit application-level control instead.
3. **Package name for `package.json`** — not specified anywhere; will default to
   `personal-blog-platform` unless told otherwise.
4. **Node/npm versions** — confirmed locally as Node v24.18.0 / npm 11.16.0 during the planning
   conversation; no `.nvmrc`/`engines` field exists yet. Assumption: not needed for a single-person
   local-dev project, but flag if Jason wants one pinned for future consistency.
5. **Tailwind v4 vs the ticket's `tailwind.config.ts` estimate** — current `create-next-app`
   defaults to Tailwind v4's CSS-based config (no `tailwind.config.ts` file). This plan treats
   `globals.css`'s `@theme` block as the v4 equivalent rather than trying to force a v3-style config
   file. Flag if Jason specifically wants Tailwind v3 for any reason (no known reason to).

## NOTES (open canvas)

**Why `lib/supabase/server.ts` doesn't use `@supabase/ssr`'s `createServerClient`:**
The standard Supabase+Next.js SSR tutorial pattern has *three* files — `client.ts` (browser, anon
key), `server.ts` (server components/actions, anon key + cookies, respects the *caller's* RLS
identity), and `middleware.ts` (cookie refresh helper). This project's CLAUDE.md instead specifies
a **privileged** server client using the secret/service_role key that deliberately bypasses RLS,
because there's exactly one admin and no need to impersonate "the logged-in user" for every admin
mutation — the app-level middleware check (coming in PB-0002) *is* the authorization boundary, and
the privileged client just needs to know "an authorized request reached this Server Action," not
re-derive the user's identity via cookies for every query. So this project's real client shape ends
up being:

- `lib/supabase/client.ts` — browser, publishable key (rarely used in this project; the public app
  is server-rendered/ISR, not client-fetching).
- `lib/supabase/server.ts` — privileged, secret key, no cookies, no session concept. **This ticket.**
- `lib/supabase/middleware.ts` — cookie-aware, publishable key, used by PB-0002 to check the actual
  session + email allowlist. **Not this ticket** — deliberately deferred (see Out of Scope).

This is a **three-file** shape by the time PB-0002 lands, not the two files CLAUDE.md's literal
architecture map lists. That's a known, deliberate deviation — flagged here rather than silently
diverging, per this plan's own instructions. Recommend updating CLAUDE.md's architecture map once
PB-0002 lands to reflect the third file, rather than now (premature to document a file this ticket
doesn't create).

**Why the migration doesn't hardcode the admin email into RLS:**
Decided in chat: RLS policy is `auth.role() = 'authenticated'` only. The email-allowlist check is
entirely an app-level concern in PB-0002's middleware. This means DB-level defense-in-depth is
weaker than the alternative (role + email match) that was also considered — traded off deliberately
for simplicity, on the reasoning that "public sign-up disabled" is already the real gate, and a
second authenticated user could only ever appear via a Supabase dashboard mistake, not a stray
public sign-up. If that tradeoff ever feels wrong, revisit with the "role + email match" policy
variant that was scoped out during planning (see chat history / the RLS design question asked
during `/piv-plan-implementation` setup).

**Scaffold-into-temp-dir approach:** chosen specifically to avoid `create-next-app` refusing (or
prompting awkwardly) on a non-empty target directory, and to avoid the Windows case-insensitive
`README.md`/`README.MD` collision. If `create-next-app` behaves fine on `.` directly when tested,
this step can simplify — but temp-dir-then-move is the safe default given the repo already has
content at root.

## AMENDMENTS

(none yet)
