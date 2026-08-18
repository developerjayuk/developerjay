# PRD: Personal Blog Platform

## 1. Problem Statement

Jason (a web developer, .NET/C# + JS/TS/React/Next ecosystem) studies and learns continuously, but that learning
currently produces only private, scattered notes with no forcing function to crystallize the material and no
public artifact to show for it. In a harder web development job market, he has no low-friction, owned space to
publicly demonstrate ongoing learning and differentiate himself to recruiters and peers. The cost of not solving
this: knowledge stays half-formed (notes, not understanding), and there's no visible, linkable body of work to
point to in job applications.

## 2. Evidence

Assumption, self-reported by the target user (who is also the builder) — not yet externally validated:

- "I have a lot of random notes that I take while studying, but I want a public space to share them... putting
  things out in public forces us to crystallize the information better." — states the core mechanism (learn by
  teaching).
- "The web development job market has become harder and I want a better way to publicly share my knowledge and
  also have more accountability to continuously learn and post each week." — states the why-now trigger.
- No prior blog, competitor teardown, or usage data exists yet — this is a greenfield, pre-launch idea. The
  hypothesis below is the mechanism for turning this from assumption into evidence.

## 3. Thesis (why build it)

Solo-builder-for-self case: Jason is both the builder and the primary user, so the thesis is validated on his own
behavior, not third-party research. The bet is that writing publicly — not just privately — is what forces
understanding to crystallize, and that a single durable, owned space (vs. scattered notes) creates the
accountability to keep learning weekly rather than let it lapse.

Why this beats how he copes today (private notes, or general platforms like Notion/gists/dev.to/Medium/Hashnode):
private notes carry no public accountability and no audience-facing artifact; third-party platforms are public
but not owned — content lives on someone else's domain, under someone else's design and constraints, and doesn't
attach to his existing personal brand at developerjay.com. A self-owned blog under his own domain both keeps the
public-accountability mechanism and doubles as a portfolio piece recruiters can attribute directly to him.

Why now: the job market has gotten harder, raising the value of a visible differentiator, and that pressure is
what's finally pushing this from "idea he's had for a while" to something worth building this week.

## 4. Hypothesis

We believe shipping a low-friction personal blog (a simple admin flow to publish posts mixing text, code
snippets, and images) will cause Jason to publish at least one blog post per week, consistently, resulting in
better retention of what he studies and a visible, linkable body of work for job applications.

We'll know we're **RIGHT** if he publishes ~1 post/week for at least 6 of the first 8 weeks after launch, and/or
the blog gets linked in at least one job application, CV, or LinkedIn profile within that window.

We'll know we're **WRONG** if posting frequency drops to zero within 2–3 weeks of launch (admin friction or
motivation collapses once novelty fades), or if after 8 weeks the blog still isn't being referenced anywhere in
his job search despite having several posts published.

## 5. Target User & JTBD

- **Primary user:** Jason, in two roles — author (writing) and future-reader-of-his-own-notes (later reference).
  A recruiter/peer reading the blog is a secondary, downstream beneficiary of the same content, not a separate
  persona the product is designed around yet.
- **Trigger:** Not a fixed cadence — a post gets started whenever something feels "blog-worthy," i.e. something
  he wants to make more concrete in his own understanding.
- **JTBD:** When I've just learned something new, I want to write it up publicly and simply, so I can cement my
  understanding and build a visible body of work for recruiters.
- **Non-users (explicitly not for):** This is not an audience-growth or newsletter play, not a multi-author
  platform, and not a general dev-content-for-traffic site. Success is not measured by reader volume.

## 6. MVP

The thinnest end-to-end slice that lets the hypothesis actually get tested — i.e., lets Jason publish a real post
this week and keep doing so weekly without friction becoming the reason he stops:

- Admin-only flow (single admin: Jason) to create, edit, and delete posts.
- Post content supports text, code snippets, and images.
- Public post list page and public post detail page, live at a URL under the developerjay.com domain (exact
  subdomain vs. subpath is an open question, not a PRD-level decision).
- Tags/categories, dark mode, and search are in week-one MVP scope alongside the above — the user confirmed
  these matter from launch rather than as later polish.
- Hosting/runtime cost kept minimal, and implementation kept close to Jason's existing skillset (.NET/C# or
  Node/TypeScript/React/Next-family stack) — the specific stack choice is an engineering decision for
  `plan-architecture`, not this PRD.

Explicitly deferred past MVP (fast-follows, not MVP-blocking):
- Video embedding (screen recordings) — added once there's an actual recording to publish.
- Comments, RSS feed, view counts.

## 7. Success Metrics

| Metric | Target | How measured |
|---|---|---|
| Publishing cadence | ≥1 published post/week for ≥6 of first 8 weeks post-launch | Post publish dates in the admin/DB |
| Portfolio usage | Blog linked in ≥1 job application, CV, or LinkedIn profile within 8 weeks | Self-reported / manual check |
| Time-to-first-post | Live with ≥1 published post within 1 week of PRD sign-off | Launch date vs. first post timestamp |

Deliberately not tracking reader/traffic metrics (page views, unique visitors) as success signals — per the
non-goals, this isn't an audience-growth product, and optimizing for that would distort the actual bet.

## 8. Non-goals

- Not building an audience-growth, SEO-traffic, or newsletter-acquisition product.
- Not building multi-author or multi-tenant capability — one admin, permanently, for this MVP's scope.
- Not building comments, RSS, or view-count analytics in the MVP.
- Not building video hosting/embedding in the MVP.
- Not optimizing for reader volume as a success signal.

## 9. Open Questions

- [x] Exact URL structure: resolved during architecture — `blog.developerjay.com` (subdomain via Porkbun DNS).
- [ ] What counts as "linked in a job application" for the success metric — does simply adding the URL to a CV
      count, or does it need to be referenced/discussed in an application?
- [x] Should the admin write flow support drafts — resolved during architecture: yes, drafts are supported
      (`status` field on posts).
- [ ] Any minimum content length/quality bar for a "post," or is a short write-up sufficient to count toward the
      weekly cadence?
- [ ] Should the search feature (week-one scope) search post content, titles/tags only, or both?

---

# Architecture — Personal Blog Platform

## Problem & goals

Jason needs to go from idea to a live, publishable blog within a week, without taking on backend work or
hosting costs disproportionate to a single-admin personal project. Every decision below is judged against that:
does it get a real, durable, DB-backed blog live fast, cheaply, and inside a stack he already knows.

## Approaches considered

- **A — Full custom 3-tier** (Next.js frontend + hand-rolled API + managed DB, possibly a separate .NET backend):
  strongest "I built the backend from scratch" portfolio signal, but the most to build this week, and a second
  service to host/deploy/CORS-configure if the backend isn't Next.js itself.
- **B — Git-based content, no runtime DB** (MDX/Markdown files in the repo, static/ISR build, "publishing" =
  committing a file): fastest and cheapest possible, but weakens the "database + backend API + admin CRUD"
  part of the intent, and the admin experience is either just a local editor or extra work to fake a web admin
  with no DB behind it.
- **C — Next.js frontend + BaaS (Supabase) for DB/Auth/Storage** *(recommended, chosen)*: real Postgres-backed
  CRUD admin, real image storage, real auth — without hand-building an API layer. Fits the one-week timeline,
  stays free/near-free, and stays entirely inside the TypeScript/React/Next world Jason already knows.

## Recommended approach

Next.js (App Router, TypeScript) as the single deployable frontend, talking directly to Supabase (Postgres +
Auth + Storage) from Server Actions/Route Handlers — no separate hand-rolled backend service. One Vercel
deployment, one Supabase project. Public pages are statically generated with ISR (revalidated on publish);
`/admin` is a session-gated section of the same app for post CRUD.

## Key decisions

- **Stack & libraries:** Next.js + TypeScript + Tailwind CSS (`next-themes` for dark mode) on the frontend;
  Supabase (Postgres, Auth, Storage) as the backend-as-a-service; `react-markdown` + `shiki`/`rehype-pretty-code`
  for rendering post markdown with syntax-highlighted code snippets; Postgres full-text search (via Supabase)
  for the search requirement instead of a separate search service. Considered and rejected: a hand-rolled
  API/DB layer or a second (.NET) backend service (Approach A — more to build, more to host, not needed given
  Jason's stated preference for all-TypeScript); a git/MDX static approach (Approach B — faster but undersells
  the DB-backed admin the PRD calls for).
- **Data model:** `posts` (id, slug, title, excerpt, content [markdown], cover_image_url, tags [text[], GIN
  indexed], status [draft/published], published_at, created_at, updated_at). No separate `tags`/`post_tags` join
  table for MVP — an array column is enough at this scale; upgrading to a join table later is cheap if tag
  metadata is ever needed. No separate media table — images upload straight to a Supabase Storage bucket and
  their URL is inserted into the post's markdown content. Users: Supabase Auth's built-in user table, one
  allowlisted admin account.
- **Boundaries & contracts:** `/admin/*` routes gated by Next.js middleware checking both an active Supabase
  session *and* that the session's email matches the one allowlisted admin address — public sign-up must be
  explicitly disabled in Supabase Auth config, since it's on by default. Supabase's `service_role` key (bypasses
  row-level security) is server-only, used from Server Actions/Route Handlers, and must never reach the client;
  the public `anon` key is fine client-side. Row-Level Security policies are the real access boundary: anonymous
  reads limited to `status = 'published'`; full read/write reserved for the authenticated admin session.
- **Other:** ISR (not per-request SSR) for public post pages, revalidated on publish — posts change at most
  weekly, so this keeps the Vercel free tier comfortable and pages fast.

## Missing pieces

- Supabase project: schema, RLS policies, storage bucket, Auth config (public sign-up disabled, one admin user
  created).
- Next.js app scaffold: App Router, Tailwind, `next-themes`.
- Markdown render pipeline with syntax highlighting.
- Admin UI: login, post list/create/edit/delete, image upload widget, draft/publish toggle.
- Public UI: post list with tag filter + search, post detail page, dark-mode toggle.
- DNS: `blog.developerjay.com` CNAME in Porkbun pointing at the Vercel deployment.

## Spikes & experiments

None recommended. Every major call here (Next.js, Supabase, Vercel, Tailwind) is a mature, well-documented,
reversible choice at this project's scale — there's no one-way door or genuine uncertainty worth timeboxing a
spike for. Go straight to building.

## Open questions

- What counts as "linked in a job application" for the PRD's success metric — carried over from the PRD, not an
  architecture concern.
- Minimum content length/quality bar for a post to count toward weekly cadence — carried over from the PRD, a
  product judgment call, not an engineering one.
- Should search cover full post content or just titles/tags — affects the Postgres full-text-search index
  definition; low-cost to change later, can be decided during implementation.
