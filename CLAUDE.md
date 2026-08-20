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

## Who we fundraise for — and what to call it

**The Dead Good Club, permanently.** The style guide PDF says Hopefield
Animal Sanctuary; it is out of date and the owner has confirmed it. Do not
"correct" the site to match it.

**The Dead Good Club is a Community Interest Company.** The site must
never call this a charity — in the UK that word is regulated, and the
owner's instruction is to state what it *is*, never what it is not.

Approved wording:

- **Community Interest Company** — when the legal form matters.
- **Community Fundraising** / a community fundraising event — for the
  event itself.
- "fundraising for", "the cause", "good causes" — in running copy.

Do not introduce a negative construction to explain the difference. The
copy keys use `cause`, not `charity`, for the same reason.

`EVENT.cause` in `lib/event.ts` holds the name and the donation link. The
name and link also appear in the credit text people are asked to paste when
they post photos (`photo.credit.body`), so a change has to be made
everywhere at once.

## Design and accessibility

- Palette comes from the style guide: Zombie Red `#E74C3C`, Dark Grey
  `#404040`, Black `#333333`, Greige `#F7E7D8`. Light mode's ground is
  paper `#FEFEFC` (owner's choice); Greige is the panel tint on it, and the
  ink in dark mode.
- **Zombie Red is a display colour, not a text colour.** It measures
  3.78:1 on paper and 3.16:1 on Greige — fine for large type (3:1), short
  of the 4.5:1 body text needs. So `--accent` is Zombie Red for fills,
  rules and large headings; `--accent-text` is a tuned red for links and
  small text; `--accent-strong` backs buttons because white on Zombie Red
  is only 3.82:1. Don't collapse the three back into one.
- Logo: `public/logos/` is the source of truth (owner-supplied);
  `public/brand/` and `app/icon.svg` are built from it by `npm run logos`.
  All vector. The brain-globe comes from the supplied SVG, used as-is bar
  precision and viewBox. The **lettering is Crackhouse, and it is never
  served as a font** — we hold no webfont licence. The supplied lock-up
  already carries the letterforms as paths, so the build takes them from
  there and changes only their fill, to `currentColor`. It builds from the
  dark-background variant deliberately: there the lettering is pure
  `#FEFEFE` and nothing else in the drawing uses that ink, so one file can
  serve both themes; in the light-background variant the lettering shares
  its grey with the globe's continents and the same swap would recolour
  the artwork. `components/wordmark.tsx` inlines the SVG so the lettering
  can follow the theme; it's marked decorative and the accessible name
  comes from the link wrapping it.
  The guide forbids stretching, recolouring and effects — the script only
  reduces precision and crops the viewBox.
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

Title-card animation, in `app/globals.css`: straight-line slides, panels
wiping off type, hard cuts. 300–700ms, sharp ease-out, ≤3px overshoot,
80–120ms stagger, `transform`/`opacity` only. Elements stop when they
arrive and stay still. Five components carry it:

- `reveal.tsx` — a block arrives: slide, cut, or a panel pulled off it.
- `swipe.tsx` — type arrives a word at a time, 60ms apart, each word behind
  its own panel. Takes a **string** (`makeS`, not `<T>`, which returns
  nodes with `<br/>` in them). The word span is `vertical-align: bottom`
  because an inline-block that clips its overflow otherwise aligns on its
  margin edge and every line grows taller the moment it arms.
- `bars.tsx` — slabs drive in from the four edges, different lengths, off
  square by a degree or two. `divider.tsx` is three of them as a section
  break.
- `hand.tsx` — a zombie hand reaches in from an edge, overshoots and
  settles. The only thing on the site allowed to wobble.

Every one of them is **opt-in**: the finished state renders, and the
animation classes are added only after the component mounts and confirms
the browser can and should animate. Nothing is ever hidden waiting for a
script.

Three rules that matter more than the look:

- `prefers-reduced-motion` gets the finished state immediately — masking
  panels are `display: none`, nothing travels.
- A masking panel must always be `pointer-events: none`, or it swallows
  clicks on what it covers.
- Check any new entrance with JS disabled and under reduced motion, by
  screenshot. The failure mode is an invisible page that looks perfectly
  healthy in the DOM.

If a `.wipe` ever leaves content permanently hidden, the cause is the
animation not applying — check that any custom property it references is
declared inside a selector. A `var()` that resolves to nothing invalidates
the whole `animation` shorthand and silently yields `animation-name: none`.

## Analytics and consent

**Nothing that writes to a visitor's device loads until they have accepted
the cookie bar.** UK PECR requires consent before the storage, not after
it, and analytics is not strictly necessary, so the scripts are never
fetched rather than merely configured to behave once running. One answer
covers all three: PostHog, GA4, and the Zeffy form, which sets its own
cookies.

- `lib/consent.ts` holds the answer in localStorage and broadcasts changes
  on a window event. Storing the answer itself needs no consent: it is the
  choice, and the alternative is asking on every page.
- `components/consent-banner.tsx` is a bar at the foot, not a modal. Reject
  is the same size and weight as Accept; a reject button that is harder to
  find is not a free choice.
- `components/consent-choice.tsx` on `/privacy` shows the current answer
  and lets it be withdrawn. Consent that cannot be withdrawn as easily as
  it was given is not consent.
- Declining is not a dead end: `components/zeffy-embed.tsx` offers the same
  form on Zeffy's own site, where the visitor deals with Zeffy directly.
  Blocking registration behind a cookie bar would be worse than the problem.

The theme choice is kept whatever the answer, on the same footing: the
visitor asked for it by clicking the switch.

PostHog and GA4 also need their keys (`NEXT_PUBLIC_POSTHOG_KEY`,
`NEXT_PUBLIC_GA_ID`), so nothing is collected locally or on an
unconfigured preview. Session recording off, autocapture off, DNT
respected, IP anonymised. **`/privacy` describes exactly this** — change
one and change the other. The test that matters is a network one: load a
page fresh and confirm no third-party host is contacted before the answer
is given.

- Target is WCAG 2.2 AA and it currently passes clean:
  `npx next start & npm run check:a11y` → 0 violations, 10 routes × 2
  themes. Keep it there.

## Gotchas

- Commit identity must be `Claude <noreply@anthropic.com>`.
- Old WordPress URLs are redirected in `next.config.mjs`. If you rename a
  route, add a redirect — those links are in a decade of press coverage.
- `POST /api/revalidate` requires `REVALIDATION_SECRET`; it returns 503 if
  unset. (The template's version skipped the check when no secret was sent.)
- Mailing-list signup is an embedded paa.ge form
  (`components/email-signup.tsx`), behind the same consent gate as
  everything else third-party. There is no signup route of our own: nothing
  on this site takes an email address itself.
- 301 photographs are still on the old WordPress site and could not be
  fetched from this environment. See `docs/IMAGES.md`.
