# Data Model

`posts` (id, slug, title, excerpt, content [markdown], cover_image_url, tags [text[], GIN-indexed],
status [draft/published], published_at, created_at, updated_at) is the only content table for MVP.

Tags are a `text[]` column, not a `tags`/`post_tags` join table — sufficient at single-admin scale;
revisit only if tag metadata (descriptions, counts, slugs) is ever needed.

There's no separate media table. Images upload directly to a Supabase Storage bucket, and the
resulting URL is inserted straight into the post's markdown `content` — no indirection between an
image and where it's referenced.

Users live entirely in Supabase Auth's built-in table — one allowlisted admin account, no custom
`users` table.
