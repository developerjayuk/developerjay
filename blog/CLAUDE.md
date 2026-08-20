# CLAUDE.md — Personal Blog Platform

## What this is
A single-admin personal blog for Jason to publish weekly write-ups of what he's learning (text, code
snippets, images) at `blog.developerjay.com`, giving him public accountability plus a linkable
portfolio artifact. Stack: Next.js (App Router, TypeScript) as the sole deployable, talking directly
to Supabase (Postgres + Auth + Storage) — no hand-rolled backend service.

## Architecture map
```
app/
  (public)/            # post list + post detail pages — statically generated with ISR,
                        #   revalidated on publish (posts change at most weekly)
  admin/                # session-gated CRUD UI (login, post list/create/edit/delete,
                        #   image upload, draft/publish toggle) — gated by proxy
  proxy.ts              # checks active Supabase session AND session email == allowlisted admin
                        #   (Next.js 16 renamed the middleware.ts convention to proxy.ts)
lib/
  supabase/              # privileged server client (secret key, server-only, bypasses RLS) and
                        #   browser client (publishable key) — kept separate, secret key must never
                        #   reach the client
```
Supabase project (external, not in this repo): `posts` table, RLS policies, one Storage bucket for
images, Auth config with public sign-up disabled and one allowlisted admin user.

## Where new code goes
- **New public page:** `app/(public)/` — follows the existing ISR pattern (see Rendering below).
- **New admin capability:** `app/admin/` — a Server Action or Route Handler using the server Supabase
  client (`lib/supabase/server`, secret key).
- **Any Supabase read/write:** goes through `lib/supabase/server` or `lib/supabase/client`, not an
  ad-hoc `createClient()` call.

## Ground rules (conventions)
- **Backend:** No hand-rolled API layer, no separate backend service — Server Actions/Route Handlers
  in the Next.js app talk to Supabase directly.
- **Access control:** admin-route gating + Supabase key/RLS boundaries — see
  `.claude/references/supabase-access-control.md`.
- **Data model:** `posts` schema + storage decisions — see `.claude/references/data-model.md`.
- **Rendering:** Public post pages use ISR (revalidated on publish), not per-request SSR — posts
  change at most weekly.
- **Post content:** Markdown, rendered with `react-markdown` + `shiki`/`rehype-pretty-code`.
- **Search:** Postgres full-text search via Supabase — no separate search service.
- **Dark mode:** `next-themes`, not a hand-rolled theme context.

## Working principles (agent steering)
- **Approach:** Build directly for most changes. Plan first (surface assumptions, open questions)
  only when a change touches auth, RLS policies, or the data model/schema — those are the areas
  worth pausing on.
- **Verify:** No test suite yet — a manual check (dev server, exercise the actual flow in the
  browser) is enough for now. Don't add tests speculatively; revisit test coverage once the
  prototype is stable, not before.
- **Scope discipline:** Comments, RSS, view-count analytics, video embedding, and multi-author
  support are explicit non-goals for MVP.
- **Stack discipline:** Stay inside TypeScript/React/Next + Supabase — a separate backend service
  (e.g. .NET) and a git/MDX static approach were both considered and rejected during architecture;
  don't reintroduce either without the user explicitly reopening that decision.

## Commands
- `npm run dev` — start the dev server (Turbopack).
- `npm run build` — production build.
- `npm run lint` — ESLint.
- `npx supabase migration new <name>` — add a new migration under `supabase/migrations/`.

## On-demand context
- Recurring patterns → `.claude/references/<topic>.md`.
- File-type-specific rules → `.claude/rules/<area>.md` (path-scoped; loads only for matching files).
