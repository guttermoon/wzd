# Notion Blog Setup Guide

This guide will help you set up your Notion database to work with your blog.

## 1. Create a Notion Integration

1. Go to [https://www.notion.so/my-integrations](https://www.notion.so/my-integrations)
2. Click "New integration"
3. Give it a name (e.g., "My Blog")
4. Select the workspace where your blog database will be
5. Click "Submit"
6. Copy the "Internal Integration Token" - this is your `NOTION_TOKEN`

## 2. Your Blog Database Structure

Perfect! Your database structure is already set up correctly:

### Your Properties:

- **Title** (Title) - The blog post title ✅
- **Slug** (Rich Text) - URL slug for the post ✅
- **Excerpt** (Rich Text) - Short description of the post ✅
- **Category** (Select) - Blog post category ✅
- **Tags** (Multi-select) - Blog post tags ✅
- **Author** (Person) - Post author ✅
- **Featured** (Checkbox) - Whether the post is featured ✅
- **Published** (Checkbox) - Whether the post is published ✅
- **Published Date** (Date) - When the post was published ✅
- **Cover Image** (Files & Media) - Cover image for the post ✅

### Example Database Entry:

```
| Title | Slug | Published | Published Date | Category | Tags | Featured | Author |
|-------|------|-----------|----------------|----------|------|----------|--------|
| My First Post | my-first-post | ✓ | 2024-02-08 | Technology | React, Next.js | ✓ | @you |
```

## 3. Share Database with Integration

1. Open your database in Notion
2. Click the "Share" button in the top right
3. Click "Invite" and search for your integration name
4. Give it "Edit" permissions
5. Copy the database URL - extract the database ID from it

The database ID is the string between the last `/` and the `?` in the URL:

```
https://notion.so/your-workspace/DATABASE_ID?v=...
                                 ^^^^^^^^^^^^
                                This is your database ID
```

## 4. Update Environment Variables

Update your `.env` file:

```env
NOTION_TOKEN=secret_your_integration_token_here
NOTION_DATABASE_ID=your_database_id_here
```

## 5. Test Your Setup

Run your development server:

```bash
npm run dev
```

Your blog should now pull content from your Notion database!

## How to Use Your Database

### Publishing Posts

1. **Published** checkbox: Check this to make the post visible on your blog
2. **Published Date**: Set the publication date (used for sorting)

### Content Fields

1. **Title**: Your blog post title
2. **Slug**: URL-friendly version (e.g., "my-first-post")
3. **Excerpt**: Short description shown in post previews
4. **Cover Image**: Upload an image file for the post cover

### Organization

1. **Category**: Select from your categories (Technology, Design, etc.)
2. **Tags**: Add multiple tags for better organization
3. **Author**: Assign the post author
4. **Featured**: Check to highlight on homepage

### Category Examples

Create categories like:

- Technology
- Design
- Business
- Marketing
- Leadership

### Tag Examples

Create tags like:

- React
- Next.js
- JavaScript
- UI/UX
- Startup
- Remote Work

## Writing Posts

1. Create a new page in your database
2. Fill in all the properties:
   - Set the **Title**
   - Add a **Slug** (URL-friendly, like "my-awesome-post")
   - Write an **Excerpt** (short description)
   - Select a **Category**
   - Add relevant **Tags**
   - Set the **Author**
   - Upload a **Cover Image** (optional)
   - Set the **Published Date**
   - Check **Featured** if you want it highlighted
   - Check **Published** when ready to go live
3. Write your content using Notion's rich text editor
4. Your post will automatically appear on your blog!

## Troubleshooting

### Common Issues:

1. **Posts not showing up**:
   - Make sure **Published** checkbox is checked
   - Verify **Published Date** is set
2. **Integration not working**: Make sure you've shared the database with your integration
3. **Environment variables**: Ensure your `.env` file has the correct tokens
4. **Database ID**: Double-check the database ID format

### Error Messages:

- `NOTION_TOKEN is not set`: Add your integration token to `.env`
- `NOTION_DATABASE_ID is not set`: Add your database ID to `.env`
- `Error fetching posts`: Check your integration permissions and database sharing

## Advanced Features

### Custom Slugs

Your **Slug** field allows you to control the exact URL for each post. Make sure slugs are:

- URL-friendly (lowercase, hyphens instead of spaces)
- Unique for each post
- Descriptive of the content

### SEO Optimization

Your current setup is great for SEO:

- **Title** for page titles
- **Excerpt** for meta descriptions
- **Cover Image** for social sharing
- **Slug** for clean URLs

### Content Scheduling

Set future dates in the **Published Date** field to schedule posts. Just make sure to check the **Published** checkbox when you're ready for them to go live.

### Author Management

The **Author** field links to Notion users. You can:

- Assign different authors to different posts
- Use the author's Notion profile picture automatically
- Extend the system later to include author bios and social links

## Site Content Database (Editable Text Sections)

Every editorial text section on the site (hero, newsletter pitch, about page,
contact info, footer tagline, blog index intro) can be edited from Notion.

1. Create a second database called **Site Content** with these properties:
   - **Key** (Title) — the section identifier
   - **Heading** (Rich text, optional) — overrides the section heading
   - **Published** (Checkbox) — only checked rows are used
2. Share it with the same integration as your posts database.
3. Set `NOTION_CONTENT_DATABASE_ID` in your `.env` to this database's ID.
4. Add one page per section. The **page body** becomes the section copy.

Recognized keys:

| Key | Where it appears |
| --- | --- |
| `hero` | Homepage cover headline + intro clipping |
| `newsletter` | Subscription coupon heading + pitch |
| `about` | About page body |
| `contact-info` | Contact page intro + address block |
| `footer` | Footer tagline |
| `blog-intro` | Blog index intro line |

If the database or a key is missing, the site quietly falls back to its
built-in copy — nothing breaks.


## 6. Homepage Text (dgc-pages rows)

Every text slot on the homepage is editable from the main **dgc-pages**
database — the same one already connected via `NOTION_DATABASE_ID`, so no
extra setup is needed. Copy rows sit alongside the site's pages:

- **Title** — the slot's key, e.g. `home.cover.title`
- **Text** (Rich text) — the copy shown on the site (newlines become line
  breaks)
- **Published** (Checkbox) — tick to keep the override active

Rows whose Title starts with `home.` are fetched in one query and are
automatically excluded from the blog/pages listings. A slot with no row (or
an unpublished one) renders the built-in copy from the code. Setting
`NOTION_CONTENT_DATABASE_ID` moves the copy rows to a separate database if
you ever want that. Letter-stack display words
(OTHER, ENEMY) and the section rail words are design elements and stay in
code.

### Available keys

**Cover (Titus Groan / Jet Pilot)**

- `home.cover.series`
- `home.cover.author`
- `home.cover.title`
- `home.cover.blurb`
- `home.cover.cta`
- `home.cover.jet1`
- `home.cover.jet2`
- `home.cover.jet3`
- `home.cover.jet4`
- `home.cover.jet5`
- `home.cover.mag.lead`
- `home.cover.mag.col1`
- `home.cover.mag.col2`
- `home.cover.mag.col3`

**Birch trail**

- `home.birch.trail`

**Seeing Is Disbelieving**

- `home.field.w1`
- `home.field.w2`
- `home.field.w3`
- `home.field.w4`
- `home.field.caption`
- `home.field.body1`
- `home.field.body2`
- `home.field.body3`
- `home.field.body4`
- `home.field.body5`
- `home.field.pageno`
- `home.field.continued`

**The Condon Report**

- `home.condon.quote`
- `home.condon.attrib`
- `home.condon.byline`
- `home.condon.col1`
- `home.condon.col2`
- `home.condon.col3`
- `home.condon.deck`
- `home.condon.band`
- `home.condon.headline`
- `home.condon.body2`
- `home.condon.memo.title`
- `home.condon.memo.body`
- `home.condon.body3`

**The Other Enemy / Over Vietnam**

- `home.enemy.body1`
- `home.enemy.body2`
- `home.enemy.body3`
- `home.enemy.body4`
- `home.enemy.quote`
- `home.enemy.photocredit`
- `home.enemy.col1`
- `home.enemy.col2`
- `home.enemy.declass`
- `home.enemy.byline1`
- `home.enemy.title`
- `home.enemy.cta`

**Bird Brains**

- `home.birds.credit1`
- `home.birds.cap1`
- `home.birds.cap2`
- `home.birds.examine`
- `home.birds.barcap`

**Anatomical Anomalies**

- `home.anatomical.readout1`
- `home.anatomical.readout2`
- `home.anatomical.headline`

**The Redacted Report**

- `home.poster.kicker`
- `home.poster.line1`
- `home.poster.line2`
- `home.poster.line3`
- `home.poster.button`
- `home.poster.footer`
- `home.poster.redact`

**Signals From Space**

- `home.signals.title1`
- `home.signals.body1`
- `home.signals.body2`
- `home.signals.body3`
- `home.signals.title2a`
- `home.signals.byline`
- `home.signals.body4a`
- `home.signals.body5a`
- `home.signals.beep`
- `home.signals.title2b`
- `home.signals.body4b`
- `home.signals.body5b`

**Environmental Quality**

- `home.eq.title`
- `home.eq.cta`
- `home.eq.body`

**Book Club coupon (footer)**

- `home.coupon.header`
- `home.coupon.address`
- `home.coupon.intro`
- `home.coupon.terms`
- `home.coupon.free`
- `home.coupon.guarantee`
- `home.coupon.name.label`
- `home.coupon.print`
- `home.coupon.email.label`
- `home.coupon.optin`
- `home.coupon.code`

**Psychic Pendulum (footer)**

- `home.pendulum.title`
- `home.pendulum.body`
- `home.pendulum.bold`
- `home.pendulum.tail`

**Book covers (footer)**

- `home.books.1.title`
- `home.books.1.author`
- `home.books.1.caption`
- `home.books.2.title`
- `home.books.2.author`
- `home.books.2.caption`
- `home.books.3.title`
- `home.books.3.author`
- `home.books.3.caption`

**Orchids box (footer)**

- `home.orchids.title`
- `home.orchids.intro`
- `home.orchids.name`
- `home.orchids.line1`
- `home.orchids.line2`

