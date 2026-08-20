# Personal Blog Platform

A single-admin personal blog for publishing weekly write-ups on what I'm learning — text, code
snippets, and images — at `blog.developerjay.com`. The point isn't audience growth; it's public
accountability (writing something up publicly forces the understanding to crystallize) and a
linkable, owned body of work to point to in job applications, distinct from scattered private notes
or a third-party platform.

## Status

Scaffolded (PB-0001): Next.js app, Supabase client modules, theme wiring, and the `posts` schema
migration exist. No admin or public UI yet — see
[`personal-blog-platform.prd.md`](personal-blog-platform.prd.md) for the full roadmap.

## What it does (MVP)

- Admin-only flow to create, edit, and delete posts (single admin, no multi-author).
- Post content mixes text, code snippets, and images.
- Public post list and post detail pages.
- Tags/categories, search, and dark mode from launch.
- Explicitly deferred: comments, RSS, view counts, video embedding.

## Stack

Next.js (App Router, TypeScript) + Tailwind CSS (`next-themes` for dark mode), talking directly to
Supabase (Postgres + Auth + Storage) — no separate hand-rolled backend. One Vercel deployment;
DNS (`blog.developerjay.com`) via Porkbun.

## Local setup

1. `npm install`
2. Copy `.env.local.example` to `.env.local` and fill in real values from the Supabase dashboard
   (Settings → API Keys): `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`,
   `SUPABASE_SECRET_KEY`, `ADMIN_EMAIL`.
3. In the Supabase dashboard, apply the schema migration once: open the SQL Editor and run the
   contents of `supabase/migrations/20260819181837_init_schema.sql` against the linked project
   (creates the `posts` table, RLS policies, and the `post-images` storage bucket). Once the
   Supabase CLI's `sbp_v0_...` access-token format is supported for non-interactive auth, this step
   can move to `supabase link --project-ref <ref>` + `supabase db push` instead.
4. In the Supabase dashboard, under Authentication → Providers → Email, disable "Allow new users to
   sign up" — this is the actual security boundary the `/admin` gate depends on.
5. Under Authentication → Users, manually add the one admin user with the email from `ADMIN_EMAIL`.
6. `npm run dev` and open `http://localhost:3000` — the page should show a post count and a working
   theme toggle.

## Docs

- Product intent + architecture decisions: [`personal-blog-platform.prd.md`](personal-blog-platform.prd.md)
- Agent-facing rules (map, conventions, seams): [`CLAUDE.md`](CLAUDE.md)
- On-demand technical references: [`.claude/references/`](.claude/references/)

## Working with AI agents on this repo

This project uses an **AI Layer** — a PIV loop (Plan → Implement → Validate) of skills, subagents,
and reference docs under `.claude/`, `.agents/`, and `.archon/` — to keep AI-assisted development
consistent with the decisions above rather than ad hoc. `CLAUDE.md` is the entry point; it's read on
every task.
