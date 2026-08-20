# Supabase Access Control

Admin routes (`/admin/*`) are gated by Next.js middleware that checks two things: an active Supabase
session, AND that the session's email matches the single allowlisted admin address. Session presence
alone is not enough — Supabase Auth's public sign-up defaults to on and must stay explicitly disabled
in the Supabase Auth config, so a stray sign-up could otherwise pass a session-only check.

Two Supabase keys exist and must stay on their respective sides: the secret key (`sb_secret_...`)
bypasses Row-Level Security and is server-only — used exclusively from Server Actions/Route
Handlers, never sent to the client or embedded in client components. The publishable key
(`sb_publishable_...`) is the only key allowed client-side.

RLS policies are the actual enforcement layer underneath the app-level checks above: anonymous/public
reads are limited to rows where `status = 'published'`; full read/write access requires the
authenticated admin session. When adding a new query or mutation, check which key/context it runs in
before assuming RLS will cover it.
