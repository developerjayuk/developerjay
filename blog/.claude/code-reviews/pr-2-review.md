# PR #2 Review — feat: project scaffold, Supabase schema, and shared infra (PB-0001)

**Branch**: `feature/pb-0001-project-scaffold-and-supabase-schema` → `master`
**Reviewed**: fresh-eyes pass (code-reviewer agent) + validation, against `CLAUDE.md`, `.claude/references/`, and the PR's own implementation report/plan.

## Summary

Greenfield scaffold: Next.js 16 (App Router, TS, Tailwind v4) app, the `posts` schema + RLS + storage bucket migration, the privileged/browser Supabase client split, `next-themes`, and a routing-only `proxy.ts` stub. No admin/public UI yet — this ticket proves the plumbing. Matches its own plan closely; documented deviations (`middleware.ts`→`proxy.ts` rename, SQL-editor-applied migration, missing-GRANTs fix, Tailwind `dark:` custom variant, `agentRules: false`, lint-driven hook rewrite) are intentional decisions, not review findings.

## Validation

| Check | Result |
|---|---|
| `npm run build` | ✅ Pass, zero errors — all routes static, proxy registered for `/admin/:path*` |
| `npm run lint` | ✅ Pass, zero errors/warnings |
| `.env.local` tracked by git | ✅ Not tracked (`.env*.local` gitignored); `.env.local.example` correctly tracked |

## Issues

### High

1. **Migration is not idempotent — will break the CLI workflow the PR's own README prescribes as the next step.** [`supabase/migrations/20260819181837_init_schema.sql:36-71`](../../supabase/migrations/20260819181837_init_schema.sql#L36-L71)
   The 5 `create policy ...` statements have no `drop policy if exists` guard (Postgres has no `create policy if not exists`). This migration was applied out-of-band via the SQL editor (documented deviation — CLI rejects the current token format), so the CLI's migration-history table almost certainly doesn't have it marked as applied. README.MD:38-39 explicitly says the next step, once the token bug is fixed, is `supabase link` + `supabase db push` — which will replay this file and fail with `policy "..." already exists`, blocking migrations on a future ticket.
   **Fix**: add `drop policy if exists "<name>" on <table>;` before each `create policy` (matches the existing `drop trigger if exists` pattern already used in the same file for the trigger).

### Medium

2. **Stale `middleware.ts` reference in `.env.local.example`.** [`.env.local.example:10`](../../.env.local.example#L10) — `# Allowlisted admin email - the only account middleware.ts will let into /admin/*`. The report documents updating `CLAUDE.md` and `supabase-access-control.md` for the `proxy.ts` rename but missed this file. Should read `proxy.ts`.
3. **No `server-only` guard on the privileged client.** [`src/lib/supabase/server.ts`](../../src/lib/supabase/server.ts) has no `import "server-only"`. Not a live leak risk today (the secret key has no `NEXT_PUBLIC_` prefix, so Next.js won't inline it), but there's no compile-time tripwire — an accidental client-component import would surface as a confusing runtime key error rather than a build failure. Cheap to add once `server.ts` starts getting called from real mutation code in PB-0002/PB-0003.
4. **`proxy.ts` no-op has no forward marker.** [`src/proxy.ts`](../../src/proxy.ts) is a literal pass-through matched to `/admin/:path*`, harmless only because no `app/admin` route exists yet. Nothing flags that PB-0002 must land real auth logic before any admin route ships. A one-line `// TODO(PB-0002): real session + email-allowlist check` would prevent this reading as "protection is in place" later.

### Low

5. Non-null assertions (`!`) on env vars in `client.ts`/`server.ts` — acceptable for this stage; will just produce an opaque SDK error instead of a clear message if `.env.local` is misconfigured. Not worth fixing now.
6. [`eslint.config.mjs:9-15`](../../eslint.config.mjs#L9-L15) — the `globalIgnores([...])` comment claims to "Override default ignores of eslint-config-next," but the list is identical to the defaults, so it's currently a no-op. Harmless, just misleading.
7. [`src/app/page.tsx:11`](../../src/app/page.tsx#L11) throws the raw Postgrest error with no logging/context. Fine for a throwaway smoke-test page — flagging so it isn't copy-pasted as-is once real public data-fetching code is built.

## What's done well

- Key boundary correctly implemented: secret key has no `NEXT_PUBLIC_` prefix and is only read in `server.ts`; `client.ts` uses only the publishable key.
- `proxy.ts`'s export shape (`export function proxy()` + `export const config`) is verified correct against Next.js 16's actual build-time validator — it will genuinely run (as a no-op), not silently skip.
- Migration's RLS policies match `supabase-access-control.md` and `data-model.md` exactly; the base-table `GRANT`s (a real bug caught during the PR's own live verification) are present and correctly scoped.
- `posts` schema matches the data-model reference field-for-field, including the "array column, not join table" and "no media table" decisions.
- `theme-toggle.tsx`'s `useSyncExternalStore` hydration guard is a clean, lint-passing alternative to the plan's literal `useEffect`+`setState` guard.
- No secrets committed; `.gitignore` correctly scopes `.env*.local` while keeping `.env.local.example` tracked.
- Implementation report is thorough and every deviation from the plan is documented with rationale — exactly the trail this review needed to distinguish real issues from intentional decisions.

## Recommendation

**Request changes** — one High-severity issue (migration idempotency) that will cause a concrete future failure the repo's own documented next step will trigger. No critical/security blockers; the key split and RLS/grants are sound. Low bar to clear: guard the 5 `create policy` statements with `drop policy if exists` (matching the pattern already used for the trigger in the same file), and optionally sweep the two Medium items (stale `middleware.ts` mention, proxy TODO marker) in the same pass.
