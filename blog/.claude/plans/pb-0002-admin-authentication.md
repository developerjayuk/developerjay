# Feature: PB-0002 — Admin authentication (login + proxy gating)

The following plan should be complete, but it's important that you validate documentation and codebase patterns and task sanity before you start implementing.

Pay special attention to naming of existing utils, types, and clients. Import from the right files — this ticket renames one existing Supabase client module and creates a new one with a very similar name; a wrong import silently reintroduces the wrong client.

## Feature Description

Fill in the real access-control logic for `/admin/*`: an active Supabase session AND a session email matching the single allowlisted admin address, enforced at two layers (the `proxy.ts` edge gate and a redundant Server Component check), plus a login page/action and a logout action. Today `proxy.ts` is a pass-through stub (PB-0001) and no `app/admin/*` routes exist at all.

## User Story

As the sole admin (Jason)
I want to log in with my Supabase account and have every other login attempt bounced
So that `/admin/*` is only ever reachable by me, even if Supabase's public sign-up were ever accidentally re-enabled.

## Problem Statement

`/admin/*` currently has no real gating — `proxy.ts` is `NextResponse.next()` for every request — and there is no login UI, so there's no way to establish an admin session at all yet.

## Solution Statement

Introduce a cookie-aware, session-scoped Supabase client (publishable key, via `@supabase/ssr`) used by `proxy.ts`, a new `(protected)` admin layout, and the login/logout Server Actions. `proxy.ts` refreshes the session on every `/admin/*` request and redirects unauthenticated or wrong-email requests to `/admin/login` (preserving the originally-requested path); the `(protected)` layout performs its own independent session+email check rather than trusting the proxy blindly (Server Actions/Components should never assume the proxy handled it — this is echoed by both Supabase's and Vercel's own guidance, see Relevant Documentation). The login action double-checks the email match immediately after sign-in so a wrong-email attempt gets a clear inline error instead of an unexplained bounce.

## Out of Scope / Non-Goals

- Not building password reset / "forgot password" flow — single manually-created admin account, out of scope for this ticket.
- Not building any post CRUD, post list, or image upload — that's PB-0003+.
- Not adding rate limiting or CAPTCHA on login — Supabase Auth's built-in rate limiting on `signInWithPassword` is relied on as sufficient at this traffic scale.
- Not restructuring the public site (`app/(public)/`) — this ticket only touches `admin/*`, `proxy.ts`, and `lib/supabase/*`.
- Not moving `src/app/page.tsx` into `app/(public)/` — that route-group migration is a separate concern from this ticket's scope; only its Supabase client import path changes here (see Task list).

## Feature Metadata

**Feature Type**: New Capability
**Estimated Complexity**: Medium (touches auth/session handling — the one area CLAUDE.md flags for pausing to plan; patterns are well-documented and confirmed against current official sources below)
**Primary Systems Affected**: `src/proxy.ts`, `src/lib/supabase/*`, new `src/app/admin/*` tree
**Dependencies**: `server-only` (new npm package); existing `@supabase/ssr` (already a dependency, confirm installed version supports the `getAll`/`setAll` cookie adapter API — see Task 1)

## Related Work

**Implements**: `docs/tickets/pb-0002.md`   ·   **Epic**: `docs/tickets/personal-blog-platform.md` (no separate architecture page — decisions inherited from `personal-blog-platform.prd.md`'s Architecture section, and from the discussion captured in this session)

**Back-references** (plans this builds on or inherits decisions from):

- `.claude/plans/pb-0001-project-scaffold-and-supabase-schema.md` — Why: created the `lib/supabase/{server,client}.ts` split and the `proxy.ts` stub this ticket fills in and partially renames.

**Forward-references** (plans that extend or supersede this — append as follow-ups get created):

- (none yet — PB-0003 post-CRUD will be the first ticket to add pages inside the new `app/admin/(protected)/` route group)

---

## CONTEXT REFERENCES

### Relevant Codebase Files — READ THESE BEFORE IMPLEMENTING

- `src/proxy.ts` (7 lines, whole file) — Why: the stub being replaced; matcher is already scoped to `/admin/:path*`, keep that scope.
- `src/lib/supabase/server.ts` (whole file) — Why: this is the file being **renamed** to `admin.ts`. Its content (secret key, `persistSession: false`, sync `createClient()`) moves verbatim except for the added `import "server-only"`.
- `src/lib/supabase/client.ts` (whole file) — Why: existing browser-client pattern/style to match (function name `createClient`, same env var naming convention).
- `src/app/page.tsx` (whole file, 22 lines) — Why: (a) imports `createClient` from `@/lib/supabase/server` synchronously and queries `posts` with `{ count: "exact", head: true }` — this import path must be updated to `@/lib/supabase/admin`, and (b) the exact query pattern to mirror for the admin dashboard's post count.
- `.env.local.example` (whole file) — Why: confirms exact env var names already in place: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_SECRET_KEY`, `ADMIN_EMAIL`. No new env vars needed.
- `supabase/migrations/20260819181837_init_schema.sql` (lines 41-45) — Why: the `admin full access` RLS policy is `using (auth.role() = 'authenticated')` — i.e. RLS trusts *any* authenticated session, not specifically the allowlisted email. This is why the app-level email check (proxy + layout + login action) is the real second half of the access-control invariant, not a redundant belt-and-braces afterthought — RLS alone would let any authenticated session read/write posts.
- `src/lib/theme/theme-toggle.tsx` (whole file) — Why: existing "use client" + interactive-state pattern in this codebase (uses `useSyncExternalStore` to avoid a set-state-in-effect lint violation that bit PB-0001) — same lint rule will apply to the login form's client-side state, follow the same avoidance style if applicable.
- `CLAUDE.md` (Architecture map + Ground rules sections) — Why: documents the `lib/supabase/` split and the two-part proxy check this ticket implements; both need updating to reflect the `admin.ts`/`server.ts` split.
- `.claude/references/supabase-access-control.md` (whole file) — Why: the authoritative two-part-check description; update to name the two client modules explicitly once they exist.

### New Files to Create

- `src/lib/supabase/admin.ts` — the renamed privileged client (was `server.ts`), unchanged logic + `import "server-only"`.
- `src/lib/supabase/server.ts` — **new** cookie-aware, session-scoped client for Server Components/Actions (publishable key, `await cookies()`).
- `src/app/admin/(protected)/layout.tsx` — independent session+email check wrapping the dashboard (and future protected admin pages); redirects to `/admin/login` on failure.
- `src/app/admin/(protected)/page.tsx` — dashboard stub: post count (mirrors `src/app/page.tsx`'s query) + a logout button.
- `src/app/admin/login/page.tsx` — Server Component; reads `?redirect=` search param, renders `<LoginForm redirectTo={...} />`.
- `src/app/admin/login/login-form.tsx` — Client Component; email/password form wired to the login Server Action via `useActionState`, renders inline error text.
- `src/app/admin/login/actions.ts` — `login` Server Action: sign in, re-check email, sign out + return error on mismatch, else `redirect()`.
- `src/app/admin/actions/logout.ts` — `logout` Server Action: sign out, `redirect('/admin/login')`.

### Relevant Documentation — READ THESE BEFORE IMPLEMENTING

- [Supabase: Bootstrap Next.js v16 app with Supabase Auth (AI prompt)](https://supabase.com/docs/guides/getting-started/ai-prompts/nextjs-supabase-auth)
  - The canonical, Next.js-16-specific (`proxy.ts`, exported as `proxy`) reference for all three client shapes plus login/logout Server Actions. This is the primary pattern source for this plan — code below is adapted from here.
  - Why: matches this repo's exact Next.js version and file-naming convention (`proxy.ts`, not `middleware.ts`).
- [Supabase: Creating a Supabase client for SSR](https://supabase.com/docs/guides/auth/server-side/creating-a-client)
  - Confirms the three-client shape (browser / server / middleware) and the `getAll`/`setAll` cookie adapter contract.
- [Supabase: Setting up Server-Side Auth for Next.js](https://supabase.com/docs/guides/auth/server-side/nextjs)
  - `getUser()` vs `getClaims()` vs `getSession()` guidance: never trust `getSession()` server-side; `getUser()` makes a network call and always works regardless of JWT signing key type (chosen here); `getClaims()` is faster but needs asymmetric signing keys confirmed on the project first.
- [GitHub: Unsolvable "cookies() should be awaited" discussion](https://github.com/vercel/next.js/discussions/81445)
  - Why: confirms `next/headers`'s `cookies()` is async in this Next.js version — `const cookieStore = await cookies()`, not the sync call shown in some older Supabase examples. Get this wrong and the new `server.ts` client throws or silently no-ops.

### Patterns to Follow

**Client factory naming convention:** both `client.ts` and (the renamed) `admin.ts` export a function literally named `createClient` — the **new** `server.ts` should do the same for consistency, but note it's `async` (`export async function createClient()`) while `client.ts`/`admin.ts` stay synchronous. Callers of the new `server.ts` must `await createClient()`; callers of `admin.ts` must NOT (breaking that convention silently would either lose type safety or hand back a Promise where a client was expected).

**Server Actions can write cookies; Server Components can't.** This is why `signInWithPassword`/`signOut` calls from `actions.ts`/`logout.ts` (Server Actions) actually persist session cookies via the new `server.ts`'s `setAll`, while the same client used in `(protected)/layout.tsx` (a Server Component) has its `setAll` silently no-op in a try/catch — it relies on `proxy.ts` having already refreshed the cookies before the layout ever runs.

**Error handling in Server Actions returning form state:** this codebase has no existing `useActionState` example yet — this ticket introduces the pattern. Follow React 19 conventions: the action's signature is `(prevState, formData) => newState`, returning `{ error: string } | never` (it either returns an error object or calls `redirect()`, which throws internally — never returns a success object).

**"use client" minimal-surface pattern (from `theme-toggle.tsx`):** keep the interactive boundary as small as possible — `login-form.tsx` is a Client Component, but `login/page.tsx` (which reads `searchParams`) stays a Server Component and passes `redirectTo` down as a prop, rather than making the whole page a Client Component.

---

## IMPLEMENTATION PLAN

### Phase 1: Client module split

<No dependency — this is the foundation everything else imports.>

**Tasks:**

- Install `server-only`, rename the existing privileged client to `admin.ts` (+ guard), create the new session-scoped `server.ts`.
- Update the one existing consumer (`src/app/page.tsx`) to the new import path.

### Phase 2: Proxy gating

**Depends on:** Phase 1 (imports the new session-scoped client pattern inline — proxy builds its own client instance since its cookie adapter shape differs from both `admin.ts` and `server.ts`)

Fill in `proxy.ts` with the real refresh + two-part check + redirect-with-return-path logic.

### Phase 3: Admin routes (layout, dashboard, login, logout)

**Depends on:** Phase 1 (session client) and Phase 2 (proxy must exist so the login route is reachable and the redirect loop is already handled at the edge — though the layout check is independent defense-in-depth, not a delegate of the proxy)

Build the route tree: `(protected)` layout + dashboard stub, `login` page/form/action, `logout` action.

### Phase 4: Documentation & validation

**Depends on:** Phases 1-3

Update CLAUDE.md / the access-control reference to reflect the real (not stubbed) state, then run the full validation pass.

---

## STEP-BY-STEP TASKS

### Task 1: ADD server-only dependency

- **IMPLEMENT**: `npm install server-only`
- **GOTCHA**: This must succeed and update `package.json`/`package-lock.json` before Task 2 (which imports it).
- **VALIDATE**: `npm ls server-only` shows it resolved; also sanity-check `npm ls @supabase/ssr` here to confirm the installed version (`^0.12.4`) exposes `createServerClient` with the `getAll`/`setAll` cookie adapter shape used throughout this plan (it has since well before this version, but confirm before writing code that assumes it).
- **SATISFIES**: infra prerequisite for AC1/AC2.

### Task 2: RENAME src/lib/supabase/server.ts → src/lib/supabase/admin.ts

- **IMPLEMENT**: Move the file's content verbatim, add `import "server-only";` as the first line.
  ```typescript
  import "server-only";
  import { createClient as createSupabaseClient } from "@supabase/supabase-js";

  export function createClient() {
    return createSupabaseClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SECRET_KEY!,
      { auth: { persistSession: false, autoRefreshToken: false } },
    );
  }
  ```
- **PATTERN**: `src/lib/supabase/server.ts` (current content, pre-rename) — logic is unchanged, only the file location and the added guard.
- **GOTCHA**: This is the ticket's explicitly deferred PB-0001 item ("once `lib/supabase/server.ts` starts being called from real admin routes, add `import "server-only"`") — now paid off, on the renamed file.
- **VALIDATE**: `git mv src/lib/supabase/server.ts src/lib/supabase/admin.ts` (or manual move) then re-add the file's content with the import line; `npx tsc --noEmit` should show no errors yet (still one broken import in `page.tsx` until Task 4).
- **SATISFIES**: PB-0002's deferred-cleanup item; prerequisite for AC1 (dashboard stub query).

### Task 3: CREATE src/lib/supabase/server.ts (new session-scoped client)

- **IMPLEMENT**:
  ```typescript
  import { createServerClient } from "@supabase/ssr";
  import { cookies } from "next/headers";

  export async function createClient() {
    const cookieStore = await cookies();

    return createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options),
              );
            } catch {
              // Called from a Server Component — proxy.ts refreshes the session instead.
            }
          },
        },
      },
    );
  }
  ```
- **PATTERN**: [Supabase AI prompt: Server Client](https://supabase.com/docs/guides/getting-started/ai-prompts/nextjs-supabase-auth) — adapted with `await cookies()` per the Next.js 16 async-cookies requirement (see GOTCHA).
- **IMPORTS**: `@supabase/ssr` (already a dependency), `next/headers`.
- **GOTCHA**: `cookies()` from `next/headers` is **async** in this Next.js version — omitting `await` either throws or silently breaks session reads. Every caller of this module must `await createClient()` (unlike the sync `admin.ts`/`client.ts`).
- **VALIDATE**: `npx tsc --noEmit` — no type errors on the new file in isolation (it has no callers yet).
- **SATISFIES**: prerequisite for AC1/AC2 (used by the layout, login action, logout action).

### Task 4: UPDATE src/app/page.tsx import path

- **IMPLEMENT**: Change `import { createClient } from "@/lib/supabase/server";` to `import { createClient } from "@/lib/supabase/admin";`. No other change — `createClient()` stays a synchronous call.
- **GOTCHA**: Do NOT change this to the new async `server.ts` — the homepage's count query is meant to run with the privileged client (matches its pre-existing behavior/intent), not a session-scoped one.
- **VALIDATE**: `npx tsc --noEmit` passes; `npm run dev` → `/` still renders "N posts" (manual check, deferred to Phase 4's full validation pass).
- **SATISFIES**: no regression on the existing homepage (guards against Phase 1's rename breaking it).

### Task 5: UPDATE src/proxy.ts

- **IMPLEMENT**:
  ```typescript
  import { createServerClient } from "@supabase/ssr";
  import { NextResponse, type NextRequest } from "next/server";

  const LOGIN_PATH = "/admin/login";

  export async function proxy(request: NextRequest) {
    let supabaseResponse = NextResponse.next({ request });

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
            supabaseResponse = NextResponse.next({ request });
            cookiesToSet.forEach(({ name, value, options }) =>
              supabaseResponse.cookies.set(name, value, options),
            );
          },
        },
      },
    );

    // CRITICAL: no code between createServerClient and getUser() — see Supabase docs GOTCHA.
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const isAuthorized = user?.email === process.env.ADMIN_EMAIL;
    const isLoginPath = request.nextUrl.pathname.startsWith(LOGIN_PATH);

    if (!isAuthorized && !isLoginPath) {
      const url = request.nextUrl.clone();
      url.pathname = LOGIN_PATH;
      url.searchParams.set("redirect", request.nextUrl.pathname);
      return NextResponse.redirect(url);
    }

    if (isAuthorized && isLoginPath) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin";
      url.search = "";
      return NextResponse.redirect(url);
    }

    return supabaseResponse;
  }

  export const config = {
    matcher: ["/admin/:path*"],
  };
  ```
- **PATTERN**: [Supabase AI prompt: Middleware/Proxy](https://supabase.com/docs/guides/getting-started/ai-prompts/nextjs-supabase-auth), narrowed to this project's existing `/admin/:path*` matcher (the official example's matcher is site-wide; this app has no session-dependent public pages, so keep the narrower scope already established in PB-0001).
- **IMPORTS**: `@supabase/ssr`, `next/server`.
- **GOTCHA #1**: Must special-case `isLoginPath` in the "redirect away" branch, or an unauthenticated visit to `/admin/login` itself loops forever (redirected back to the page it's already on).
- **GOTCHA #2**: The `isAuthorized && isLoginPath` branch (redirect an already-logged-in admin away from the login page back to `/admin`) is a UX nicety beyond the ticket's literal AC — cheap given `user`/`isAuthorized` are already computed, but flag it in review as intentional scope, not an accidental addition.
- **GOTCHA #3**: `user?.email === process.env.ADMIN_EMAIL` is the two-part check the whole ticket hinges on — session presence (`user` non-null) AND email match, evaluated together, matching `.claude/references/supabase-access-control.md`.
- **VALIDATE**: `npx tsc --noEmit`; manual: unauthenticated `curl -I http://localhost:3000/admin` → `307`/`302` to `/admin/login?redirect=%2Fadmin` (deferred to Phase 4 full manual pass since it needs the login route to exist first for the full round-trip).
- **SATISFIES**: AC2 (unauthenticated/non-matching → redirected away from `/admin/*`).

### Task 6: CREATE src/app/admin/(protected)/layout.tsx

- **IMPLEMENT**: Independent session+email check (does not trust proxy alone), redirecting on failure.
  ```typescript
  import { redirect } from "next/navigation";
  import { createClient } from "@/lib/supabase/server";

  export default async function ProtectedAdminLayout({
    children,
  }: {
    children: React.ReactNode;
  }) {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user?.email !== process.env.ADMIN_EMAIL) {
      redirect("/admin/login");
    }

    return <>{children}</>;
  }
  ```
- **PATTERN**: Task 5's `isAuthorized` check, same boolean condition, independent client instance.
- **GOTCHA**: This layout lives in a `(protected)` route group specifically so it does NOT wrap `app/admin/login/` — Next.js layouts apply to every nested segment with no built-in way to exclude a sibling path by pathname from within a Server Component layout (no `usePathname`-equivalent server API), so the route group is the correct mechanism, not an incidental choice. This is a deliberate deviation from the ticket's flat `app/admin/layout.tsx` file estimate — see Open Questions.
- **VALIDATE**: `npx tsc --noEmit`; manual check deferred to Phase 4.
- **SATISFIES**: AC2 (defense-in-depth layer, independent of proxy).

### Task 7: CREATE src/app/admin/(protected)/page.tsx

- **IMPLEMENT**: Dashboard stub — post count (mirrors `src/app/page.tsx`'s query, using the privileged `admin.ts` client) + logout button.
  ```typescript
  import { createClient } from "@/lib/supabase/admin";
  import { logout } from "@/app/admin/actions/logout";

  export default async function AdminDashboard() {
    const supabase = createClient();
    const { count, error } = await supabase
      .from("posts")
      .select("*", { count: "exact", head: true });

    if (error) {
      throw error;
    }

    return (
      <div className="flex flex-col gap-4 p-8">
        <h1 className="text-xl font-semibold">{count ?? 0} posts</h1>
        <form action={logout}>
          <button type="submit" className="rounded border px-3 py-1 text-sm">
            Log out
          </button>
        </form>
      </div>
    );
  }
  ```
- **PATTERN**: `src/app/page.tsx:5-8` (query shape) — `createClient()` here is synchronous (admin.ts), unlike the layout's async session client in Task 6.
- **IMPORTS**: `@/lib/supabase/admin`, `@/app/admin/actions/logout`.
- **GOTCHA**: Route resolves to URL `/admin` despite living under `(protected)/` — route groups don't appear in the URL path.
- **VALIDATE**: manual check deferred to Phase 4.
- **SATISFIES**: AC1 (allowlisted admin lands on an `/admin` dashboard stub).

### Task 8: CREATE src/app/admin/login/actions.ts

- **IMPLEMENT**: `login` Server Action — sign in, re-check email (defense-in-depth per the earlier discussion), sign out + return error on mismatch, else redirect to the preserved target or `/admin`.
  ```typescript
  "use server";

  import { redirect } from "next/navigation";
  import { createClient } from "@/lib/supabase/server";

  export type LoginState = { error: string } | null;

  export async function login(_prevState: LoginState, formData: FormData): Promise<LoginState> {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const redirectTo = (formData.get("redirect") as string) || "/admin";

    const supabase = await createClient();
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      return { error: "Invalid email or password." };
    }

    if (data.user.email !== process.env.ADMIN_EMAIL) {
      await supabase.auth.signOut();
      return { error: "This account is not authorized for admin access." };
    }

    redirect(redirectTo);
  }
  ```
- **PATTERN**: [Supabase AI prompt: Login Server Action](https://supabase.com/docs/guides/getting-started/ai-prompts/nextjs-supabase-auth), adapted to return `{ error }` state for `useActionState` instead of throwing, and to add the email re-check.
- **GOTCHA #1**: `redirectTo` must be validated as an internal path (starts with `/`) if ever extended — here it only ever comes from `proxy.ts`'s own `searchParams.set("redirect", request.nextUrl.pathname)`, which is always same-origin, so no open-redirect risk as built. Do not later accept this value from an arbitrary external source without validating it.
- **GOTCHA #2**: `redirect()` throws internally (Next.js mechanism) — the function's `Promise<LoginState>` return type is only ever hit on the error paths; this matches the "action returns error state or redirects" convention noted in Patterns to Follow.
- **VALIDATE**: `npx tsc --noEmit`; manual login round-trip deferred to Phase 4.
- **SATISFIES**: AC1 (successful login) and the email-allowlist decision (check in both proxy and login action).

### Task 9: CREATE src/app/admin/login/login-form.tsx

- **IMPLEMENT**: Client Component wiring the form to `login` via `useActionState`, showing the inline error.
  ```typescript
  "use client";

  import { useActionState } from "react";
  import { login, type LoginState } from "./actions";

  export function LoginForm({ redirectTo }: { redirectTo: string }) {
    const [state, formAction, pending] = useActionState<LoginState, FormData>(login, null);

    return (
      <form action={formAction} className="flex flex-col gap-3 w-full max-w-sm">
        <input type="hidden" name="redirect" value={redirectTo} />
        <input type="email" name="email" placeholder="Email" required className="rounded border px-3 py-2" />
        <input type="password" name="password" placeholder="Password" required className="rounded border px-3 py-2" />
        {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
        <button type="submit" disabled={pending} className="rounded border px-3 py-2 text-sm">
          {pending ? "Signing in…" : "Log in"}
        </button>
      </form>
    );
  }
  ```
- **PATTERN**: `src/lib/theme/theme-toggle.tsx` — minimal "use client" surface, no extraneous state.
- **GOTCHA**: `useActionState`'s action signature is `(prevState, formData) => newState` — must match `login`'s exact signature from Task 8 (`LoginState` as both state and return type).
- **VALIDATE**: `npx tsc --noEmit`.
- **SATISFIES**: AC1/AC2 UX (clear inline error on failed/unauthorized login).

### Task 10: CREATE src/app/admin/login/page.tsx

- **IMPLEMENT**: Server Component reading `redirect` search param, rendering the form.
  ```typescript
  import { LoginForm } from "./login-form";

  export default async function LoginPage({
    searchParams,
  }: {
    searchParams: Promise<{ redirect?: string }>;
  }) {
    const { redirect } = await searchParams;

    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-6">
        <h1 className="text-xl font-semibold">Admin login</h1>
        <LoginForm redirectTo={redirect ?? "/admin"} />
      </div>
    );
  }
  ```
- **PATTERN**: Task 3/Task 6's `await`-based async APIs — `searchParams` is also a Promise in this Next.js version (same async-props pattern as `cookies()`).
- **GOTCHA**: This page is intentionally OUTSIDE the `(protected)` route group (sibling of it under `app/admin/`) — it must remain reachable while unauthenticated.
- **VALIDATE**: manual check deferred to Phase 4.
- **SATISFIES**: AC1 (login page exists), AC2 (reachable when redirected).

### Task 11: CREATE src/app/admin/actions/logout.ts

- **IMPLEMENT**:
  ```typescript
  "use server";

  import { redirect } from "next/navigation";
  import { createClient } from "@/lib/supabase/server";

  export async function logout() {
    const supabase = await createClient();
    await supabase.auth.signOut();
    redirect("/admin/login");
  }
  ```
- **PATTERN**: [Supabase AI prompt: Logout Server Action](https://supabase.com/docs/guides/getting-started/ai-prompts/nextjs-supabase-auth).
- **VALIDATE**: `npx tsc --noEmit`; manual check deferred to Phase 4.
- **SATISFIES**: ticket's "Logout action" bullet.

### Task 12: UPDATE CLAUDE.md

- **IMPLEMENT**: In the Architecture map, split the `lib/supabase/` line into `admin.ts` (secret key, server-only, bypasses RLS) and `server.ts` (publishable key, cookie-aware, session checks — used by `proxy.ts`/Server Actions). Update the `proxy.ts` line to describe the real two-part check instead of "checks active session AND email" as an aspiration — it's now implemented.
- **VALIDATE**: Read-through only; no build implication.
- **SATISFIES**: keeps the architecture map (a Layer-1 rule doc) truthful, per project convention of updating it alongside the code it describes.

### Task 13: UPDATE .claude/references/supabase-access-control.md

- **IMPLEMENT**: Add a short note naming the two client modules explicitly (`lib/supabase/admin.ts` for privileged/RLS-bypassing access, `lib/supabase/server.ts` for the session-scoped client used in the two-part gate), so a future reader doesn't have to reverse-engineer the split from file contents.
- **VALIDATE**: Read-through only.
- **SATISFIES**: keeps the reference doc accurate for PB-0003+.

---

## TESTING STRATEGY

Per CLAUDE.md, no automated test suite exists yet for this project — validation is `next build` + `npm run lint` + manual/browser verification, consistent with how PB-0001 was validated.

### Unit Tests

None — not part of this project's current conventions (revisit once the prototype stabilizes, per CLAUDE.md).

### Integration Tests

None automated. The manual flow below is the integration check.

### Edge Cases (covered by manual validation below)

- Unauthenticated direct visit to `/admin` → redirected to `/admin/login?redirect=%2Fadmin`.
- Unauthenticated direct visit to `/admin/login` itself → renders normally, no redirect loop.
- Correct email, wrong password → inline "Invalid email or password." error, stays on login page.
- A hypothetical non-admin account (can't literally test without a second Supabase user — see Open Questions) → inline "This account is not authorized for admin access." error, and no lingering session (verify via a subsequent direct `/admin` visit redirecting again, not staying logged in).
- Correct email + password → lands on `/admin`, shows post count, shows Log out button.
- Already-logged-in admin visits `/admin/login` directly → redirected straight to `/admin`.
- Logout from the dashboard → redirected to `/admin/login`; subsequent `/admin` visit redirects again (session actually cleared, not just UI-hidden).
- Deep-link preservation: manually hit `/admin?foo=bar` unauthenticated → login → redirected back to `/admin?foo=bar` (there's no deeper admin page yet to test this against more meaningfully than the dashboard itself, but the mechanism should round-trip).

---

## VALIDATION COMMANDS

### Level 1: Syntax & Style

```
npm run lint
npx tsc --noEmit
```

### Level 2: Unit Tests

N/A — none exist for this project yet.

### Level 3: Integration Tests

N/A — none exist for this project yet.

### Level 4: Manual Validation

```
npm run build
npm run dev
```

Then, via browser (or `agent-browser` skill):

1. Visit `/admin` while logged out → confirm redirect to `/admin/login?redirect=%2Fadmin`.
2. Attempt login with the allowlisted admin's wrong password → confirm inline error, no redirect.
3. Log in with the correct allowlisted admin credentials → confirm landing on `/admin`, post count renders, no console errors/hydration warnings.
4. Visit `/admin/login` again while still logged in → confirm immediate redirect back to `/admin`.
5. Click "Log out" → confirm redirect to `/admin/login`; re-visit `/admin` → confirm redirected again (session actually cleared).
6. Confirm `/` (public homepage) still renders the post count correctly post-rename (Task 4 regression check).

### Level 5: Additional Validation (Optional)

- `npm ls @supabase/ssr server-only` — confirm both dependencies resolved as expected (Task 1).

---

## ACCEPTANCE CRITERIA

- [ ] Logging in as the allowlisted admin lands on the `/admin` dashboard stub, showing a real post count.
- [ ] Logging in with any other account, or with no session at all, results in being redirected away from every `/admin/*` path except `/admin/login`.
- [ ] The email-allowlist check happens both in `proxy.ts` and in the login Server Action (immediate sign-out + inline error on mismatch, per the confirmed decision).
- [ ] `/admin/login` itself never redirect-loops, whether logged out (stays) or logged in (bounces to `/admin`).
- [ ] Logout actually clears the session (verified by a subsequent redirect on re-visiting `/admin`), not just a UI state change.
- [ ] `npm run build` and `npm run lint` pass with zero errors.
- [ ] `src/app/page.tsx`'s post count still renders correctly after the `admin.ts` rename (no regression).
- [ ] CLAUDE.md and `.claude/references/supabase-access-control.md` reflect the real (not stubbed) `proxy.ts` behavior and the two-client split.

---

## COMPLETION CHECKLIST

- [ ] All 13 tasks completed in order
- [ ] Each task's validation command passed immediately after that task
- [ ] `npm run build`, `npm run lint`, `npx tsc --noEmit` all pass
- [ ] Full manual flow (Level 4, steps 1-6) confirmed in a real browser
- [ ] Acceptance criteria all met
- [ ] CLAUDE.md / access-control reference updated to match reality

---

## OPEN QUESTIONS / ASSUMPTIONS

- **Route-group deviation**: the ticket's file estimate lists a flat `app/admin/layout.tsx`. This plan instead uses `app/admin/(protected)/layout.tsx` with `app/admin/login/` as a sibling outside it, because a Server Component layout has no built-in way to exclude a sibling pathname (no server-side `usePathname` equivalent) — a shared flat layout wrapping both the dashboard and the login page would either need pathname-sniffing (fragile/unsupported cleanly) or would incorrectly gate the login page itself. Flagging this explicitly rather than silently diverging from the ticket's file list, per the epic-inheritance rule. If you'd rather keep it flat and put the check inline in each protected page instead of a shared layout, say so before implementation — it's a one-file difference either way at this ticket's scope, but the route-group version is what future PB-0003+ pages will slot into for free.
- **Login error copy**: assumed a distinct "This account is not authorized for admin access." message for the email-mismatch case vs. generic "Invalid email or password." for real auth failures. Account-enumeration risk is treated as moot here (private single-admin tool, public sign-up disabled) — flag if you'd rather use one generic message for both cases.
- **No second account exists to literally test the "wrong email" path** — since Supabase sign-up is disabled and there's exactly one admin user. The manual validation plan notes this; if you want a real test of that branch, it would require temporarily creating a second Supabase Auth user (dashboard) and deleting it after, which is optional and not blocking for this ticket.
- **`getUser()` chosen over `getClaims()`**: confirmed in the earlier discussion — network-call cost is irrelevant at this traffic scale, and it sidesteps needing to confirm the Supabase project's JWT signing key type. If a future ticket ever needs to optimize proxy latency, `getClaims()` is the documented faster alternative (after confirming asymmetric keys in the dashboard).

## NOTES (open canvas)

**Why not the official example's site-wide proxy matcher?** The Supabase AI-prompt reference example matches nearly every route (`/((?!_next/static|...).*))`) to keep sessions fresh app-wide. This project's public pages are anonymous ISR pages with no session dependency at all (per CLAUDE.md's rendering rule and the RLS policy allowing anon reads of published posts) — there is nothing for a site-wide proxy pass to refresh on those routes, so keeping the existing `/admin/:path*` matcher from PB-0001 avoids needless proxy invocations on every public page load, which matters more here than it looks given ISR is specifically chosen to keep the Vercel free tier comfortable (CLAUDE.md, Rendering).

**Two-layer defense-in-depth (proxy + layout) is the documented pattern, not gold-plating.** Both the Supabase-specific SecureStartKit write-up and Vercel Academy's own proxy lesson independently make the same point: a proxy that only handles UX-level routing must not be the only place authorization is checked, because Server Actions are directly callable (public HTTP endpoints) regardless of what page rendered the form that points at them. The `(protected)` layout's redundant check plus the login/logout actions each creating their own session client (rather than trusting a value threaded down from the proxy) follows that guidance directly.

**Naming rationale recap** (already decided, restated for the implementer): `admin.ts` = old `server.ts`, secret key, bypasses RLS, synchronous. New `server.ts` = cookie-aware, publishable key, respects RLS, async. This matches what Supabase's own docs mean by "server.ts" so future tickets following their examples map onto this repo without translation.

## AMENDMENTS

(none yet)
