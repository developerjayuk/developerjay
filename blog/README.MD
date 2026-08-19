# Personal Blog Platform

A single-admin personal blog for publishing weekly write-ups on what I'm learning — text, code
snippets, and images — at `blog.developerjay.com`. The point isn't audience growth; it's public
accountability (writing something up publicly forces the understanding to crystallize) and a
linkable, owned body of work to point to in job applications, distinct from scattered private notes
or a third-party platform.

## Status

Pre-development. The PRD and architecture decisions are locked in
[`personal-blog-platform.prd.md`](personal-blog-platform.prd.md); the app itself hasn't been
scaffolded yet.

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

## Docs

- Product intent + architecture decisions: [`personal-blog-platform.prd.md`](personal-blog-platform.prd.md)
- Agent-facing rules (map, conventions, seams): [`CLAUDE.md`](CLAUDE.md)
- On-demand technical references: [`.claude/references/`](.claude/references/)

## Working with AI agents on this repo

This project uses an **AI Layer** — a PIV loop (Plan → Implement → Validate) of skills, subagents,
and reference docs under `.claude/`, `.agents/`, and `.archon/` — to keep AI-assisted development
consistent with the decisions above rather than ad hoc. `CLAUDE.md` is the entry point; it's read on
every task.
