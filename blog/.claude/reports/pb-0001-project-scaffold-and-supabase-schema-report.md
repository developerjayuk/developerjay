# Implementation Report — PB-0001 Project scaffold, Supabase schema, and shared infra

**Plan**: `.claude/plans/pb-0001-project-scaffold-and-supabase-schema.md`
**Branch**: `feature/pb-0001-project-scaffold-and-supabase-schema`   **Status**: COMPLETE

## Summary

Scaffolded the Next.js 16 (App Router, TypeScript, Tailwind v4) app at the repo root, added the
`posts` schema migration (table, RLS policies, base grants, storage bucket + policies) and applied
it to the linked Supabase project, wired up the privileged/browser Supabase client split,
`next-themes` dark mode, and a routing-only proxy stub. Verified end-to-end in a real browser: the
smoke-test home page queries the empty `posts` table and the theme toggle flips and persists.

## Tasks completed

- Next.js scaffold (`create-next-app` in temp dir → moved to repo root, existing `README.MD`/
  `.gitignore`/`CLAUDE.md` preserved) → `package.json`, `tsconfig.json`, `next.config.ts`,
  `eslint.config.mjs`, `postcss.config.mjs`, `src/app/*` (CREATE)
- `.gitignore` merged with Next.js/Supabase-CLI ignore entries → `.gitignore` (UPDATE)
- `supabase init` + migration → `supabase/migrations/20260819181837_init_schema.sql` (CREATE),
  applied to the linked project via the SQL editor (see Deviations)
- `lib/supabase/client.ts` (browser, publishable key) → `src/lib/supabase/client.ts` (CREATE)
- `lib/supabase/server.ts` (privileged, secret key) → `src/lib/supabase/server.ts` (CREATE)
- `next-themes` provider + toggle → `src/lib/theme/theme-provider.tsx`,
  `src/lib/theme/theme-toggle.tsx` (CREATE), wired into `src/app/layout.tsx` (UPDATE)
- Proxy stub (`/admin/:path*`, pass-through) → `src/proxy.ts` (CREATE) — see Deviations for why
  this is `proxy.ts`, not `middleware.ts`
- Smoke-test home page (post count + theme toggle) → `src/app/page.tsx` (UPDATE)
- `.env.local.example` — already present and matching the plan's spec exactly; no change needed
- README "Local setup" section → `README.MD` (UPDATE)
- CLAUDE.md architecture map + key-naming updated to match `proxy.ts` and the new
  publishable/secret key names → `CLAUDE.md`, `.claude/references/supabase-access-control.md`
  (UPDATE)

## Tests added

None — per CLAUDE.md and the plan, no automated test suite exists yet for this ticket; validation
is `next build` + `npm run lint` + manual/browser verification (see below).

## Validation results

- `npm run build` — pass, zero errors.
- `npm run lint` — pass, zero errors/warnings (two real issues found and fixed, not suppressed —
  see Deviations).
- Manual/browser verification (via `agent-browser`):
  - `/` returns 200, renders "0 posts" and the theme toggle, no console errors or hydration
    warnings.
  - Clicking the toggle flips light/dark; reloading the page shows the choice persisted
    (`localStorage`).
  - `/admin/anything` passes through untouched (404 from no matching route — expected, no gating
    exists yet).
- Supabase (verified directly against the live project via REST):
  - Secret key: `GET /rest/v1/posts` → 200, `[]`.
  - Publishable key: `GET /rest/v1/posts` → 200 (RLS-filtered read succeeds).
  - Storage: `GET /storage/v1/bucket/post-images` (secret key) → 200.
  - Auth admin: exactly one user, `....@gmail.com`.
  - Confirmed with Jason: public sign-up is disabled in the dashboard.

## Deviations from the plan

- **`middleware.ts` → `proxy.ts`**: Next.js 16.3.1 (the version `create-next-app` installed)
  deprecates the `middleware.ts` file convention in favor of `proxy.ts` (same behavior, renamed
  export). Confirmed with Jason and switched to `proxy.ts`; updated CLAUDE.md's architecture map to
  match. `middleware.ts` was never committed.
- **Migration applied via SQL editor, not `supabase link`/`db push`**: the Supabase CLI (including
  the latest beta) rejects the `sbp_v0_...` access-token format the dashboard currently issues
  (`LegacyInvalidAccessTokenError`, expects `sbp_<hex>`). Confirmed with Jason and fell back to
  having him paste-run the migration SQL directly in the dashboard SQL editor. The migration file
  is still checked into `supabase/migrations/` for history/CLI use once the token format is
  supported. README documents this fallback and the future CLI path.
- **Migration was missing base table `GRANT`s** (found during verification, not anticipated by the
  plan): enabling RLS only restricts *row* visibility — Postgres still requires an explicit
  `GRANT` before a role can query the table at all. The original migration enabled RLS and added
  policies but never granted `anon`/`authenticated`/`service_role` privileges on `public.posts`,
  so every request (including the privileged secret-key one) failed with
  `42501 permission denied for table posts`. Added the missing grants to the migration file and had
  Jason apply them to the live project; re-verified with direct REST calls (200 on both the secret
  and publishable keys).
- **Tailwind v4 `dark:` variant needed an explicit `@custom-variant` declaration**: Tailwind v4
  defaults `dark:` to `prefers-color-scheme` only. `next-themes` with `attribute="class"` toggles a
  `.dark` class on `<html>`, which had no effect until `globals.css` declared
  `@custom-variant dark (&:where(.dark, .dark *));` and the background/foreground CSS variables
  moved from a `@media (prefers-color-scheme: dark)` block to a `.dark { ... }` block. Found via
  browser verification (toggle button label changed but background didn't) — fixed and re-verified.
- **`next dev` auto-injected a version-warning block into CLAUDE.md**: Next.js 16's `agentRules`
  feature appended a "This is NOT the Next.js you know" block directly into the existing
  hand-authored `CLAUDE.md` on first `next dev` run (it says it re-adds itself on every run).
  Confirmed with Jason and disabled it (`agentRules: false` in `next.config.ts`); removed the
  injected block from `CLAUDE.md`.
- **Lint findings fixed properly, not suppressed**: `theme-toggle.tsx`'s `useEffect` + `setState`
  mount-guard (as literally specified in the plan) triggered the `react-hooks/set-state-in-effect`
  rule in this ESLint version. Replaced with `useSyncExternalStore` (same hydration-safe-mount
  behavior, no lint suppression needed). `proxy.ts`'s unused `_request` parameter warning was fixed
  by dropping the unused parameter entirely rather than adding an ignore pattern.
- **Package name**: set to `personal-blog-platform` per the plan's Open Questions assumption #3 (no
  objection raised).

## Issues encountered

- A Supabase personal access token was shared mid-session to attempt CLI linking; it never
  successfully authenticated (format rejected before any API call succeeded). Recommend revoking it
  from the dashboard (Account → Access Tokens) as a precaution since it was pasted into chat, even
  though it was never live.
