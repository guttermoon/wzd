# The Dead Good Club — project guide

Read this before assuming anything: this repo **started as a Notion blog
template but no longer is one**. It is a single-page vintage-magazine site
("The Dead Good Club") with Notion as its copy CMS.

## What the site is

- Next.js 14 (app router) + Tailwind. Homepage (`app/page.tsx`) renders
  `components/vintage-strip.tsx` — a long scrolling 1960s-UFO-magazine strip
  centered at 1200px. This IS the product; the blog routes still exist but
  are legacy template code (see "Pending decisions").
- Every strip section has an anchor id and a name, listed in the header's
  SECTIONS dropdown (`components/header.tsx` → `homeSections`): cover,
  birch-trail, seeing-is-disbelieving, condon-report, other-enemy,
  bird-brains, anatomical-anomalies, redacted-report, signals-from-space,
  environmental-quality, join-the-club.
- Page end order: magazine strip (flush) → coupon strip
  (`components/vintage-footer.tsx`) → black links footer
  (`components/footer.tsx`) → copyright line.

## Notion content model (IMPORTANT — do not guess)

**One database: `dgc-pages`** (`NOTION_DATABASE_ID`, shared with the
integration). It holds BOTH:

1. **Site pages/posts** — rows with Slug, Category, etc. (template model).
2. **Homepage copy rows** — Title starts with `home.` (e.g.
   `home.cover.title`), value in the **Text** rich-text property,
   **Published** checkbox must be ticked. ~111 rows exist, one per text slot.

Code paths:
- `lib/homepage-content.ts` → `getHomeText()` fetches all Published
  `home.*` rows in one query (uses `NOTION_CONTENT_DATABASE_ID` if set,
  else `NOTION_DATABASE_ID`).
- `components/notion-text.tsx` → `makeT(content)` returns `<T k="...">`
  which renders the Notion override or its fallback children. Newlines in
  Notion text become `<br/>`.
- `vintage-strip.tsx` and `vintage-footer.tsx` receive `content` via props
  from `app/page.tsx` / `app/layout.tsx`. Every editable slot is wrapped in
  `<T>`; the full key list is in `NOTION_SETUP.md` §6.
- `lib/notion.ts` `getAllPosts()` **skips `home.*` rows** so copy never
  appears as posts. Keep that invariant if you touch the query.
- Letter-stack display words (vertical OTHER, tilted ENEMY letters) and the
  Signals rail words are design elements, intentionally NOT keyed.

Revalidation is 60s, so Notion edits appear within a minute.

## Interactive bits (plain inline scripts, not React)

The redacted-poster rub-to-reveal and the ENEMY letter reveal are vanilla
inline `<script dangerouslySetInnerHTML>` IIFEs inside `vintage-strip.tsx`.
This is deliberate: the published artifact strips React hydration, and
inline scripts survive. Keep new interactions in that style if they must
work in the artifact.

The Book Club coupon in `vintage-footer.tsx` is a live newsletter form
("use client") posting to the stub `app/api/newsletter/route.ts` — swap the
stub's internals when a provider (e.g. MailerLite) is chosen.

## Artifact preview workflow

The design is reviewed as a self-contained HTML artifact at
https://claude.ai/code/artifact/37efcca1-f652-47f0-be0c-9f4b327a2a15
(favicon 🛸 — keep both stable; republish the same file path/URL).

Build with `scripts/build-artifact.mjs` (see header comment): run the dev
server, save the rendered page as `home-raw.html` and its compiled CSS as
`layout.css` in a work dir, then run the script there. It inlines the
latin-subset next/font woff2 files as base64 `@font-face`, downscales
photos to WebP data URIs stored once as `:root` CSS variables, rewrites
`<img src>`/svg `href` attributes directly, and keeps only the inline
scripts (enemy/redact). Zero external URLs may remain — the artifact CSP
blocks all network requests. If a new font/image/script is added to the
site, add it to the script's lists (`NEEDED_VARS`, `images`, script filter).

## Pending decisions / gotchas

- Branch `claude/notion-webpages-no-blog-q44tkm` (unmerged) replaces the
  blog with Notion-backed pages rendered by slug (`app/[slug]/page.tsx`,
  `HOME_SLUG`). The owner considers the site "amended to a site setup", so
  expect this direction; the blog routes on main are effectively legacy.
  The header/footer nav item "Resources" still points at `/blog`.
- `app/api/test-notion/route.ts` has a known pre-existing TS error — ignore
  it in `tsc` output.
- Commit identity must be `Claude <noreply@anthropic.com>`; never rewrite
  already-merged history (the stop-hook flags upstream commits — leave them).
- Env vars: see `.env.example`. Locally, Notion calls fail gracefully to
  built-in fallback copy, so the site renders fully without credentials.
