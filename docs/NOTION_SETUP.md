# Notion setup

The site reads its copy from one Notion database, **wzd-pages**. This guide
covers connecting it and editing the words.

Nothing here is required for the site to work: every page has built-in copy
in `content/site-copy.json` and renders correctly with no Notion connection.
Notion only overrides what's already there.

## 1. Create the integration

1. Go to <https://www.notion.so/my-integrations> and click **New
   integration**.
2. Name it something like `World Zombie Day site`, in the workspace that
   holds the database.
3. Copy the **Internal Integration Token** — that's `NOTION_TOKEN`.

## 2. Share the database with it

1. Open the **wzd-pages** database in Notion.
2. Top right → **Share** → **Invite** → pick your integration.

Without this step the integration can see nothing, and the site quietly
falls back to its built-in copy.

**Give the site's integration read access, not edit.** The site only ever
reads: one `databases.query` per regeneration and nothing else, ever. A
token that can also write is a token that can rewrite every word on the
site if it ever leaks out of Vercel — and an environment variable is not a
secret in the way a password is: it is visible to anything running in the
deployment, and it is one paste away from a log or a screenshot. Set the
integration's capabilities to **Read content** only, at
<https://www.notion.so/my-integrations> → your integration → Capabilities.

`scripts/seed-notion.mjs` does need write access, because it creates the
rows. Run it once, from your own machine, with a second integration that
has write capability — or grant write, seed, and set it back to read. What
matters is that the token sitting in Vercel is the read-only one.

To confirm it took effect — the settings page shows the capability, not
what the API will actually allow:

```bash
NOTION_TOKEN=ntn_… npm run check:notion
```

`READ ✓` and `WRITE ✓ REFUSED` is the answer you want. Note this tests
the *integration token*, which is a different thing from your own Notion
login and from any AI connector you have authorised: making the
integration read-only does not, and should not, stop you editing the
database yourself.

## 3. Set the environment variables

Locally, in `.env.local`; on Vercel, in Project → Settings → Environment
Variables:

```env
NOTION_TOKEN=ntn_…
NOTION_DATABASE_ID=3c16f6ccb2c180e087a4da55703d5792
NEXT_PUBLIC_SITE_URL=https://worldzombieday.co.uk
REVALIDATION_SECRET=<any long random string>
```

## 4. Database structure

Three properties, and that's all:

| Property | Type | Holds |
|---|---|---|
| `Name` | Title | the key, e.g. `home.hero.title` |
| `Text` | Rich text | the words shown on the site |
| `Status` *or* `Published` | Status / Checkbox | whether the override is live |

The site is flexible about the last one, because databases get set up
differently. A row counts as live if:

- there is a `Published` checkbox and it is ticked; **or**
- there is a `Status` set to `Done` (also accepted: Published, Live,
  Complete, Completed); **or**
- the database has neither property, in which case every row is live.

This database uses **`Status` = Done**. Any other column you add — `Image`,
`slug`, `Title`, `Publication Date` — is ignored by the site, so the
database is safe to use for your own notes and workflow. Two exceptions
worth knowing: a column named `URL` sets where a button points (see
below), and a second status-like column is *not* a second gate — see
"Only `Status` decides what is public".

## 4a. Fill the database

Once those two properties exist:

```bash
NOTION_TOKEN=ntn_… npm run seed:notion
```

That creates one row per key in `content/site-copy.json` — currently 314 —
pre-filled with the copy that ships in the code and ticked as Published, so
the database and the site say the same thing on day one.

It is safe to re-run: rows are matched by key and updated in place, never
duplicated. Rows you added yourself that don't match a key are reported and
left alone. Add `--dry-run` to see what it would do first:

```bash
NOTION_TOKEN=ntn_… node scripts/seed-notion.mjs --dry-run
```

## 5. Editing

- Find the row whose `Name` is the slot you want, change `Text`, and make
  sure **`Status` is `Done`** — that is the column the site reads.
- Changes appear within 60 seconds. To publish immediately:

  ```bash
  curl -X POST https://worldzombieday.co.uk/api/revalidate \
    -H 'content-type: application/json' \
    -d '{"secret":"<REVALIDATION_SECRET>"}'
  ```

- **Moving a row off `Done` doesn't blank the slot** — it falls back to the
  built-in copy in the repo. **To take a line off the site, clear the
  `Text` cell** on a row that is still `Done`: an empty cell on a live row
  means empty, and the surrounding bullet, paragraph or heading goes with
  it rather than leaving a gap.

### Only `Status` decides what is public

This database has two columns that look like they control publishing:

| Column | Values | Read by the site? |
|---|---|---|
| `Status` | Not started / In progress / **Done** | **Yes — this is the gate** |
| `Status 1` | Draft / In review / Published | No. Ignored entirely. |

Today almost every row reads `Status 1 = Draft` while being live on the
site, because `Status = Done` is what counts. Nothing is wrong with the
site; the second column is just misleading, and dangerously so in one
direction: **marking a row `Draft` does not take it off the site.** If you
write something unfinished into `Text` and set `Status 1` to `Draft`
believing it is hidden, it is public within 60 seconds.

The fix is to delete `Status 1` — along with `Text 1`, `Text 2`, `Title`
and `slug` if you are not using them for your own notes. The site ignores
all of them; they are only there to be confused with the columns that
matter. The site logs which gate it is using on every cold start
(`site copy: live/draft gate is "Status".`) so this can be checked rather
than assumed.
- Line breaks in `Text` become line breaks on the page.
- Rows whose `Name` isn't a dotted key (e.g. `Notes to self`) are ignored,
  so you can keep working notes in the database safely.

## 6. The keys

Keys are namespaced by page. To find the key for something on screen,
search `content/site-copy.json` for the words you can see.

Note that three prefixes do not match their page's URL. The routes were
named after the old WordPress ones; the keys were not renamed to match.

| Prefix | Page | Keys |
|---|---|---|
| `site.` | every page — name, tagline, meta, cookie dialog, newsletter, form fallbacks | 23 |
| `home.` | `/` — including `home.essentials.*` | 35 |
| `register.` | `/register` | 19 |
| `party.` | `/register` — the after party | 12 |
| `rules.` | **`/survival`** — `rules.1` … are the numbered rules | 13 |
| `faq.` | `/faq` — `faq.q1`/`faq.a1` … | 21 |
| `sponsors.` | **`/become-a-sponsor`** | 23 |
| `donate.` | `/donate` | 18 |
| `press.` | `/press` — boilerplate, key facts, usage terms | 61 |
| `photo.` | **`/photo-policy`** | 35 |
| `submit.` | `/submit-photos` | 21 |
| `privacy.` | `/privacy` | 28 |
| `footer.` | the footer on every page | 5 |

There is no `gallery.` — `/gallery` redirects to `/press`.

### Things that are not editable in Notion

- **Photographer credits and alt text** live in `content/photos.json`, not
  Notion, so that a credit can't be removed by unticking a checkbox.
- Navigation labels, the event date used in structured data, and social
  URLs live in `lib/event.ts`.
- The wordmark is `components/wordmark.tsx`.

## The route page

`/the-route` carries the running order and the walking map, and it is
behind a password because it names the meeting point — which
`home.essentials.where.value` promises goes out to people who register
rather than to the open web.

Set **`ROUTE_PASSWORD`** in the Vercel project (and in `.env.local` for
development) to whatever you are sending registrants. With it unset the
page stays shut and says so: an unconfigured deploy must not be the way
the meeting point gets out, so there is no fail-open.

Changing `ROUTE_PASSWORD` signs everybody out. That is deliberate — the
cookie people hold is signed with the password itself, so replacing it
revokes every copy that has already been handed round, which is the whole
reason for changing it.

The route's copy lives under the `route.` prefix in
`content/site-copy.json` like everything else, so run

```
NOTION_TOKEN=ntn_… npm run seed:notion
```

after pulling this change to add the new rows to `wzd-pages`. Until you
do, the page renders from the built-in copy — correct, just not editable
from Notion.

The six **Google Maps links**, one per leg, are in `EVENT.route` in
`lib/event.ts` so the page is right with no Notion at all. To repoint a
leg without a deploy, put the new address in the `URL` field of that
leg's own row — `route.walk2.cta` and so on. The row's URL wins; with it
empty the built-in one stands.

### The PDF goes stale

`/the-route` offers the running order as a PDF. It is **not** a live
render: `content/route.pdf` is built by

```
ROUTE_PASSWORD=… npx next start &
ROUTE_PASSWORD=… npm run route:pdf
```

and committed. Printing a page to PDF needs a browser, and a serverless
function has no business carrying one, so the file is a photograph rather
than a mirror — **a copy edit in Notion changes the page and not the
PDF.** Re-run that after any edit worth reprinting.

It is served by `app/the-route/download/route.ts`, behind the same cookie
as the page, and it is deliberately not in `public/`: anything there is
served with no code in front of it, so a copy of this file under `public/`
would hand the meeting point to anyone who guessed the filename.
