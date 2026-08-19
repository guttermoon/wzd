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
2. Top right → **Share** → **Invite** → pick your integration → **Edit**.

Without this step the integration can see nothing, and the site quietly
falls back to its built-in copy.

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
database is safe to use for your own notes and workflow.

## 4a. Fill the database

Once those two properties exist:

```bash
NOTION_TOKEN=ntn_… npm run seed:notion
```

That creates one row per key in `content/site-copy.json` — currently 192 —
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
  sure `Published` is ticked.
- Changes appear within 60 seconds. To publish immediately:

  ```bash
  curl -X POST https://worldzombieday.co.uk/api/revalidate \
    -H 'content-type: application/json' \
    -d '{"secret":"<REVALIDATION_SECRET>"}'
  ```

- **Moving a row off `Done` doesn't blank the slot** — it falls back to the
  built-in copy in the repo. To show nothing, you'd have to change the code.
- Line breaks in `Text` become line breaks on the page.
- Rows whose `Name` isn't a dotted key (e.g. `Notes to self`) are ignored,
  so you can keep working notes in the database safely.

## 6. The keys

Keys are namespaced by page. To find the key for something on screen,
search `content/site-copy.json` for the words you can see.

| Prefix | Page |
|---|---|
| `site.` | name, tagline, meta description |
| `home.` | the homepage, including `home.essentials.*` and `home.broadcast.*` |
| `register.` | `/register` |
| `rules.` | `/rules` — `rules.1` … `rules.8` are the numbered rules |
| `faq.` | `/faq` — `faq.q1`/`faq.a1` … `faq.q8`/`faq.a8` |
| `sponsors.` | `/sponsors` |
| `gallery.` | `/gallery` |
| `press.` | `/press` — boilerplate, key facts, usage terms |
| `photo.` | `/photo-policy` |
| `privacy.` | `/privacy` |
| `footer.` | the footer on every page |

### Things that are not editable in Notion

- **Photographer credits and alt text** live in `content/photos.json`, not
  Notion, so that a credit can't be removed by unticking a checkbox.
- Navigation labels, the event date used in structured data, and social
  URLs live in `lib/event.ts`.
- The wordmark is `components/wordmark.tsx`.
