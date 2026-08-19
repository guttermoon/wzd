# World Zombie Day: London — project guide

Read this before assuming anything. This repo began as a Notion blog
template and was rebuilt in August 2026 as the site for **World Zombie Day:
London**, migrated off WordPress. None of the blog template remains.

## What the site is

- Next.js 14 (app router) + Tailwind, deployed on Vercel. Eight static
  routes, no database, no blog.
- `/` `/register` `/rules` `/faq` `/sponsors` `/press` `/photo-policy`
  `/privacy`. Primary nav is the first five
  (`NAV` in `lib/event.ts`); the rest sit in the footer (`FOOTER_NAV`).
- Every route is a server component that does
  `const T = makeT(await getSiteCopy())` and renders `<T k="…" />`.

## The copy system (IMPORTANT — do not guess)

Two layers, and the first one is complete on its own:

1. **`content/site-copy.json`** — the built-in text for every key. The site
   renders correctly with **no Notion credentials at all**. Never delete a
   key from here to "move it to Notion"; Notion overrides, it doesn't own.
2. **Notion database `wzd-pages`** (`NOTION_DATABASE_ID`,
   `3c16f6ccb2c180e087a4da55703d5792`) — rows with `Name` = the key and
   `Text` = the copy. Currently 192 rows, one per key. Fetched in one
   paginated query by `lib/site-copy.ts`; rows whose title isn't a dotted
   key are ignored.
   The live/draft gate is deliberately flexible (`isLive()` in
   `lib/site-copy.ts`): a `Published` checkbox if the database has one,
   else a `Status` of Done/Published/Live/Complete, else everything is
   live. This database uses `Status`. Don't hard-code one property name —
   the owner configures the database, not us.

Keys are dotted and lowercase (`home.hero.title`, `faq.q3`,
`sponsors.onsite.amount`), namespaced per page: `site.` `home.` `register.`
`rules.` `faq.` `sponsors.` `photo.` `press.` `privacy.`
`footer.`.

`components/notion-text.tsx` exports `makeT` (renders a key, newlines →
`<br/>`) and `makeS` (plain string, for attributes).

**If you add a `<T k="…">`, add the key to `content/site-copy.json` too** —
otherwise the slot renders empty. And add a matching Notion row, or the
owner can't edit it.

Revalidation is 60s. `POST /api/revalidate` with the secret to force it.

## Photographs — credit is enforced, not conventional

The owner's standing instruction is that **every photograph is published
with its photographer's name**. That is enforced in three places:

- `lib/photos.ts` — `photo(slug)` throws if the credit is missing.
- `components/photo.tsx` — the **only** component allowed to emit an
  `<img>`. It always renders "Photo: <credit>" in a `<figcaption>`.
- `scripts/check-credits.mjs` — fails if any of the above is violated, if a
  rendition is orphaned, or if a raw `<img>` appears anywhere else.

Do not add an `<img>`, a CSS `background-image` of a photograph, or a
`next/image` outside that component. Registry: `content/photos.json`.
Renditions are built by `scripts/prepare-images.mjs` from
`assets/originals/` (gitignored) — run `npm run images` after adding one.

Layout: `public/photos/` (responsive renditions) and `public/press/`
(2400px downloads + the hand-drawn `wordmark.svg`). Everything there except `wordmark.svg` is generated, as is
`content/photo-renditions.json` — don't hand-edit any of it.

## The charity is settled

**The Dead Good Club, permanently.** The style guide PDF says Hopefield
Animal Sanctuary; it is out of date on that point and the owner has
confirmed it. Do not "correct" the site to match it. The name and the
donation link also appear in the credit text people are asked to paste when
they post photos (`photo.credit.body`), so a change there has to be made
everywhere at once.

## Design and accessibility

- Palette comes from the style guide: Zombie Red `#E74C3C`, Dark Grey
  `#404040`, Black `#333333`, Greige `#F5E9DA`.
- **Zombie Red is a display colour, not a text colour.** It measures
  3.19:1 on Greige and 3.31:1 on Black — fine for large type (3:1), short
  of the 4.5:1 body text needs. So `--accent` is Zombie Red for fills,
  rules and large headings; `--accent-text` is a tuned red for links and
  small text; `--accent-strong` backs buttons because white on Zombie Red
  is only 3.82:1. Don't collapse the three back into one.
- Logo: the official lock-up from the style guide kit, in
  `public/logos/` (source) → `public/brand/` (built by
  `npm run logos`). Two variants, swapped by CSS not JS so there's no
  flash. Both are marked decorative; the accessible name comes from the
  link that wraps them, because the hidden variant exposes nothing.
  The guide forbids stretching, recolouring or effects — the script only
  trims and resizes.
- Display **Grandstander**, body **Raleway**. Crackhouse is the guide's
  display face but is not shipped — see the font note below.
- **Hitchcock must never be committed or served.** The owner's instruction,
  verbatim: "Hitchcock was created by Matt Terich, based on the work of Saul
  Bass. Please do not redistribute these files in any way. They can be
  downloaded for free at http://typographica.org/001110.php" — serving a
  webfont is redistribution, so it is not in the repo, not in any font
  stack, and `*.ttf` / `Hitchcock*` are gitignored. The site does not use
  it; Grandstander does that job.
- Colours are CSS variables in `app/globals.css`: `:root` is light, `.dark`
  overrides. Never give a colour its only definition inside one theme.
  Both reds are contrast-checked; they differ per theme deliberately.
- Caps come from `text-transform` (`.display`), never from typed capitals.
  Style guide metrics: +.02em on uppercase, 1.1 line-height on headings,
  1.5 on paragraphs.

## Motion

Title-card animation, in `app/globals.css` and `components/reveal.tsx`:
straight-line slides, panels wiping off type, hard cuts. 300–700ms, sharp
ease-out, ≤3px overshoot, 80–120ms stagger, `transform`/`opacity` only.
Elements stop when they arrive and stay still.

Two rules that matter more than the look:

- `prefers-reduced-motion` gets the finished state immediately — the
  masking panel is `display: none`, nothing travels.
- A masking panel must always be `pointer-events: none`, or it swallows
  clicks on what it covers.

If a `.wipe` ever leaves content permanently hidden, the cause is the
animation not applying — check that any custom property it references is
declared inside a selector. A `var()` that resolves to nothing invalidates
the whole `animation` shorthand and silently yields `animation-name: none`.

## Analytics

PostHog and GA4 in `components/analytics.tsx`, both inert unless
`NEXT_PUBLIC_POSTHOG_KEY` / `NEXT_PUBLIC_GA_ID` are set, so nothing is
collected locally or on an unconfigured preview. Session recording off,
autocapture off, DNT respected, IP anonymised. **`/privacy` describes
exactly this** — change one and change the other.
- Target is WCAG 2.2 AA and it currently passes clean:
  `npx next start & npm run check:a11y` → 0 violations, 9 routes × 2 themes.
  Keep it there.

## Gotchas

- Commit identity must be `Claude <noreply@anthropic.com>`.
- Old WordPress URLs are redirected in `next.config.mjs`. If you rename a
  route, add a redirect — those links are in a decade of press coverage.
- `POST /api/revalidate` requires `REVALIDATION_SECRET`; it returns 503 if
  unset. (The template's version skipped the check when no secret was sent.)
- `app/api/newsletter/route.ts` is an unused stub returning 501 on purpose,
  so it can't silently swallow email addresses.
- 301 photographs are still on the old WordPress site and could not be
  fetched from this environment. See `docs/IMAGES.md`.
