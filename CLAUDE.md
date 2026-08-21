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
   `Text` = the copy and `URL` = where it goes, if it is a button. 257
   rows, of which 231 are keys the site renders and the rest are left over
   from copy that has since been cut. Fetched in one
   paginated query by `lib/site-copy.ts`; rows whose title isn't a dotted
   key are ignored.
   An `Order` number column carries the reading order, and the table view
   sorts on it, so the rows run down the page the way a visitor runs
   through the site: `site.` first, then home, register and the after
   party, survival, FAQ, sponsors, donate, press, photo policy, privacy,
   footer. The number encodes both, as `page number x 1000 + position x
   10`, so `5140` is the fourteenth row of the fifth page, and there is
   room to slot a new key between any two without renumbering. The dead rows are left
   empty deliberately: Notion sorts blanks last, so they collect at the
   bottom rather than interrupting a page.
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

### Clearing a row removes the copy

An empty `Text` on a live row means empty, and beats the built-in the way
any other edit does. That is the only way the owner can take a line off
the site: if a blank cell fell back to `content/site-copy.json` the old
words would reappear the moment it was cleared, and copy could be changed
but never removed. The base layer is untouched by this — with no Notion
there are no rows, so nothing is cleared and the site renders complete.

The other half of that bargain is that **an emptied key must leave no
markup behind**. A stray bullet, a paragraph holding open a margin, or a
heading with a gap under it reads as a bug, not a decision. So:

- `<P k="…">` (`makeP`) is a paragraph that is not there at all when its
  key is empty. Prefer it to `<p><T k="…"/></p>` for any single-key
  paragraph.
- `makeHas` is the predicate; filter every mapped list through it
  (`RULES.filter((n) => has(\`rules.${n}\`))`) so a cleared row takes its
  own bullet with it.
- `makeAny` is for the enclosing block: a section, panel or definition
  whose keys are *all* empty should not render its heading or its frame
  either.

The check is mechanical — blank a handful of keys, build, and grep the
rendered pages for `<li></li>`, `<p></p>` and `<dt></dt>`. It should be
zero on every route. The one deliberate exception is the newsletter's
`#newsletter-status`, which is an empty live region on purpose.

**If you add a `<T k="…">`, add the key to `content/site-copy.json` too** —
otherwise the slot renders empty. And add a matching Notion row, or the
owner can't edit it.

**Client components take their words as props.** `getSiteCopy` is
server-only, so the consent dialog, the newsletter form, the Zeffy
fallback line and the consent panel on `/privacy` are handed their strings
by the server component that renders them — `app/layout.tsx`,
`components/footer.tsx`, and the two pages. They are `site.consent.*`,
`site.newsletter.*` and `site.form.*`, and they are as editable as
anything else. A string typed straight into a client component is not.

Three kinds of string stay in the code deliberately, because they are
contracts rather than copy: the `(opens in a new tab)` announcement, which
`check:links` asserts on word for word; the landmark and control labels
(`aria-label="Primary"`, the theme toggle); and the masthead's accessible
name. Making those editable would let a copy edit break the link check or
the accessibility of a control.

### Buttons: the words and the link both come from the row

Every button on the site that goes somewhere is a `<Cta>`
(`components/cta.tsx`), built by `makeCta(copy)` beside `makeT` and
`makeS`. It takes the key of a row and the built-in destination:

```tsx
<Cta k="home.cause.cta" href={EVENT.cause.donateUrl} className="btn btn-primary" />
```

The row's `Text` is the label and its `URL` is where it points. Both
override, neither owns: with the `URL` cell empty — which is how every row
starts — the button goes where the `href` says, so the site is correct
with no Notion at all, exactly as it is for the words.

Two things follow from this that are easy to get wrong:

- **Where it points decides how it renders**, not whoever wrote it. An
  `https:` destination goes through `ExternalLink` and gets the new tab,
  the announcement and `rel="noopener noreferrer"`; a `/path` goes through
  `next/link`; `mailto:` and `tel:` are plain anchors. That is the whole
  reason this is one component — the owner can repoint a button at an
  outside address long after the code was written, and `check:links` has
  to keep passing without anyone remembering to change the markup.
- **A pasted value is not trusted.** `isSafeHref` (`lib/site-copy.ts`)
  allows `http(s)`, `mailto:`, `tel:` and a leading `/`, and anything else
  — `javascript:` above all — is dropped and the built-in link stands. It
  is checked twice on purpose: once as the value enters from Notion, and
  again in `Cta`, which is the last thing between it and the DOM.

The `URL` value is filed in the copy map under `url:<key>` (`urlKey()`).
A copy key never contains a colon, so the two cannot collide.

Buttons that download a file out of `public/` — the logos, the Dead Good
Club's lock-up and the donation QR on `/press` — are deliberately *not*
wired this way: those files are assembled into `public/brand/` by
`npm run logos` and their paths belong to the build, not to the owner.
The words on them are still Notion rows; only the destination is fixed.
That script is also where a supplied file gets a usable name — one of the
QR originals has a space in its filename, and a space in a download URL
is a trap nobody needs.

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

**The Dead Good Club is a Community Interest Company.** The banned word is
**charity**, and only that word: in the UK it is regulated and the club is
not one. Everything else that is true of a CIC is fair game.

- **not-for-profit** is fine and the owner uses it. A Community Interest
  Company *is* a not-for-profit; do not "correct" their copy to say CIC
  where they wrote not-for-profit. This has been done to them twice.
- **Community Interest Company** when the legal form itself matters.
- **Community Fundraising** / a community fundraising event, for the event.
- "fundraising for", "the cause", "good causes", in running copy.

Do not introduce a negative construction to explain the difference: state
what it is, never what it is not. The copy keys use `cause`, not
`charity`, for the same reason.

`EVENT.cause` in `lib/event.ts` holds the name and the donation link. The
name and link also appear in the credit text people are asked to paste when
they post photos (`photo.credit.body`), so a change has to be made
everywhere at once.

## Design and accessibility

- Palette comes from the style guide: Zombie Red `#E74C3C`, Dark Grey
  `#404040`, Black `#333333`, Greige `#F7E7D8`. Neither ground is from the
  guide, and both departures are deliberate: light is paper `#FEFEFC`
  (owner's choice) and dark is ink `#1A1A1A`. In each theme the guide's own
  colour is the *panel* on that ground — Greige in light, Black in dark —
  and Greige is also the ink in dark mode.
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
  settles.

Three things are allowed to move after they arrive, all deliberately: the
hand; the cookie dialog, which hangs from a string and swings to a stop
(`.consent-drop` / `.consent-swing` in `app/globals.css`); and the blood
band at the foot of the page, which swells continuously once it has landed
(`.drip-wave-front` / `.drip-wave-back`). The band is the only loop on the
site, and it is the owner's decision: it is decorative, `aria-hidden`, and
reduced motion stops it dead. Everything else stops when it arrives. Note the shape of the dialog's markup: transform is
a single property, so two animations on one element replace each other
rather than composing. The drop and the swing are on nested elements, and
the swing's `transform-origin` is the top of the string so it pivots from
where it is tied.

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

**The analytics do not load until the visitor has answered the cookie
dialog.** UK PECR requires consent before the storage, not after it, and
analytics is not strictly necessary, so PostHog and GA4 are never fetched
rather than merely configured to behave once running.

Two things that were once behind the same gate no longer are, both at the
owner's instruction:

- The **newsletter** is the site's own form now, posting server-side. There
  is nothing third party in the page to gate.
- The **Zeffy ticketing form loads on sight** on `/register` and `/donate`,
  and sets its own cookies as soon as either page opens. The case that it
  is strictly necessary to the service the visitor came for is a strong one
  for a ticketing form and a weak one for analytics, which is why they are
  treated differently. `/privacy` says this in as many words: **change one
  and change the other.**

  **Zeffy does not come alone.** Their embed loads Stripe, hCaptcha and
  Google Pay, which a form taking a payment genuinely needs, and also
  HubSpot, Microsoft Clarity, Google/DoubleClick and LinkedIn, which are
  Zeffy's own analytics and advertising and are not necessary to take a
  booking by any reading. None of that is in our code; all of it appears
  on our two pages, without consent, because the embed is ungated.
  `privacy.cookies.body` names every one of them and says plainly which
  are needed and which are not, because a visitor cannot judge what they
  are not told. If that list ever changes, or the embed is gated after
  all, that copy has to change with it. The honest fix is upstream: ask
  Zeffy to turn the marketing trackers off for the account.

- `lib/consent.ts` holds the answer in localStorage and broadcasts changes
  on a window event. Storing the answer itself needs no consent: it is the
  choice, and the alternative is asking on every page.
- `components/consent-banner.tsx` is a modal dialog, at the owner's
  instruction: it holds focus, locks the page behind it, and has to be
  answered before the site can be used. Reject is the same size and weight
  as Accept; a dialog that only offers yes is not consent. `check:a11y`
  tests the trap, the lock and the close, and seeds an answer before the
  page checks so they are not run against a dialog doing its job.
- `components/consent-choice.tsx` on `/privacy` shows the current answer
  and lets it be withdrawn. Consent that cannot be withdrawn as easily as
  it was given is not consent.
- `components/zeffy-embed.tsx` puts the form on the page by one of three
  routes, because relying on Zeffy's own snippet alone meant it was often
  simply missing. Their script finds `[data-zeffy-embed]` and fills it,
  which fails in more ways than it looks: it scans once when it executes,
  so a client-side navigation between `/register` and `/donate` left a
  fresh div nothing ever looked at; and when the paint landed during
  hydration React recovered from the mismatch by rebuilding the root and
  took the whole embed with it (React error #423 — the form vanished and
  the DOM looked perfectly healthy).

  So the script is injected from an effect, after hydration, on every
  mount — that second execution is what makes it scan the div that is on
  the page now. Then the result is **checked rather than assumed**: a
  `MutationObserver` watches for their paint, and if nothing has appeared
  within `DEADLINE_MS` the form is loaded straight from Zeffy in an
  iframe instead. `<noscript>` carries the same iframe for a visitor with
  no JavaScript, and the link to Zeffy's own site sits underneath all of
  it. If you touch this, test all four: script working, script blocked,
  a client-side navigation between the two pages, and JavaScript off.

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

## Links

Every link that leaves the site opens in a new tab, announces that it
does, and carries `rel="noopener noreferrer"`. Every link that stays on it
does none of those things and goes through `next/link`.

`components/external-link.tsx` is the only way to write the first kind, so
the three things that have to travel together cannot be separated by
whoever writes the next one. `npm run check:links` reads the rendered
pages and fails if an outbound link is missing any of them, or if an
internal one opens a tab. `mailto:` and `tel:` are exempt: they hand off
to another application rather than opening a page.

## Gotchas

- **Nothing read at request time may throw.** `components/wordmark.tsx` and
  `components/brain-mark.tsx` inline SVGs off disk through
  `lib/brand-art.ts`, and the masthead is on every page. `public/` is
  served as static assets and is *not* in the serverless bundle, and Next
  cannot see through `join(process.cwd(), …)`, so the read worked in the
  build and threw ENOENT in the lambda. Every ISR regeneration died with
  it, Next kept serving the last HTML that had built, and the site froze:
  no Notion edit could appear and no cache-clearing helped, because
  nothing was being rebuilt. Two things keep it fixed and both are needed
  — `experimental.outputFileTracingIncludes` in `next.config.mjs` ships
  the files, and `brandSvg()` catches and returns "" so a missing asset
  costs a logo rather than the site. If a copy change ever stops
  appearing, read the runtime logs before anything else: a page that
  cannot regenerate looks exactly like a caching problem.
- Commit identity must be `Claude <noreply@anthropic.com>`.
- Old WordPress URLs are redirected in `next.config.mjs`. If you rename a
  route, add a redirect — those links are in a decade of press coverage.
- `POST /api/revalidate` requires `REVALIDATION_SECRET`; it returns 503 if
  unset. (The template's version skipped the check when no secret was sent.)
- The newsletter signup is **our own form** (`components/email-signup.tsx`)
  posting to `POST /api/newsletter`, which adds the address to **Brevo**
  server-side, to list **7, `WZDNewsletter`** (not 2, `DGCNewsletter`,
  which is the club's). It was once an iframe of the provider's page,
  which could not be styled and put their cookie notice and their GA4 on
  every page of ours. Because nothing of theirs runs in the browser, this
  needs no consent, and that stayed true when the list moved from paa.ge:
  only the route changed, the form did not.

  It calls the API rather than the address Brevo's embed posts to, because
  that one answers with a redirect and a page of HTML and a server cannot
  tell from it whether anything happened.

  **Nobody is added to the list by this route.** It calls
  `contacts/doubleOptinConfirmation`, which sends a confirmation email;
  the address joins the list only when the person clicks the link in it.
  That is the difference between someone typing an address and someone
  consenting to be written to. The confirmation template has to contain
  Brevo's `{{ doubleoptin }}` link or there is nothing to click, so
  `BREVO_DOI_TEMPLATE_ID` defaults to 1, their own opt-in template, and
  `BREVO_DOI_REDIRECT` is where clicking it lands them.

  Someone already on the list gets no second confirmation and Brevo says
  so with a duplicate error; from where they are standing they have
  subscribed, so the form is told it worked rather than shown a failure.
  `BREVO_API_KEY` (shared with photo submissions), `BREVO_LIST_ID` and
  `BREVO_CONTACTS_URL` do the rest; with no key the route answers 503 and
  the form offers a `mailto:` instead of losing the signup.

  The success message has to match: it says a link is on its way, not that
  they are subscribed, because until they click they are not.
- **Photograph submissions** (`/submit-photos`) post to
  `POST /api/photo-submissions`, which emails them to
  `EVENT.photoSubmissions` — Megan, not the general address, because she
  is the one who credits them. Sending needs `BREVO_API_KEY`, and it goes
  out *from* her address as well as to it: Brevo will only send from a
  sender it has verified, and hers is the verified one. Without the key
  the route returns 503 `unconfigured` and the form hands the visitor a
  `mailto:` with everything they typed already in it. That fallback is
  the point, not a nicety: someone who has just written out where their
  folder lives and how to get into it must never lose it to a missing
  environment variable. `PHOTO_SUBMISSIONS_TO`, `_FROM` and `_URL`
  override the destination, sender and endpoint.
- 301 photographs are still on the old WordPress site and could not be
  fetched from this environment. See `docs/IMAGES.md`.
