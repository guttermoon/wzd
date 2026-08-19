# Images and photographer credits

Every photograph on this site is published with its photographer's
name. `lib/photos.ts` refuses to return a photo without a credit and
`components/photo.tsx` always renders one, so an uncredited image
cannot reach a page. `npm run check:credits` verifies it.

## Photographers

- **Alex Lane Photography** — 2 photos (leake-street-crowd, london-eye-pair)
- **Andy Halliday** — 1 photo (steward-crossing)
- **Bartosz Chomiak** — 1 photo (the-horde)
- **Chris Williams** — 2 photos (bridge-horde, half-face-portrait)
- **Frazer Fenton** — 1 photo (selfie)
- **Katerina Iacovides** — 2 photos (zombie-dog, piccadilly-rain)
- **Marcus Charter** — 2 photos (stop-sign-couple, makeup-blood)
- **Mark Ridgwell** — 1 photo (zombies-crossing)
- **Mark Williams Photography London** — 2 photos (teddy-bear, wolf-puppet)
- **Paul Carrano** — 1 photo (groaning-group)
- **Pierre François Docquir** — 1 photo (family-kerb)
- **Raymond Charter** — 1 photo (kissing-booth)
- **charterphotography.co.uk** — 1 photo (leicester-square-banner)

## The set

| Slug | Credit | Used on | Original file |
|---|---|---|---|
| `bridge-horde` | Chris Williams | home hero | `14. Chris Williams.jpeg` |
| `the-horde` | Bartosz Chomiak | home scale / press | `photo by zero.jpg` |
| `leicester-square-banner` | charterphotography.co.uk | home — what happens on the day | `3_PHOTO_CREDIT_www.charterphotography.co.uk.jpg` |
| `family-kerb` | Pierre François Docquir | home — everyone's welcome | `Photo Pierre Fr Docquir 58.jpg` |
| `leake-street-crowd` | Alex Lane Photography | register | `2_PHOTO_CREDIT_ALEX_LANE.jpg` |
| `steward-crossing` | Andy Halliday | rules of conduct | `5_ANDY HALLIDAY.jpg` |
| `zombie-dog` | Katerina Iacovides | faq — dogs | `Photo Katerina Iacovides 111.jpg` |
| `kissing-booth` | Raymond Charter | sponsors | `PHOTO CREDIT RAYMOND CHARTER 2016.jpg` |
| `selfie` | Frazer Fenton | photo policy | `Photo Frazer Fenton 108.jpg` |
| `london-eye-pair` | Alex Lane Photography | gallery | `1_PHOTO_CREDIT_ALEX_LANE.jpg` |
| `half-face-portrait` | Chris Williams | gallery | `PHOTO CREDIT CHRIS WILLIAMS 2017.jpg` |
| `stop-sign-couple` | Marcus Charter | gallery | `MARCUS CHARTER WZD London 2016-60.jpg` |
| `makeup-blood` | Marcus Charter | gallery — getting ready | `MARCUS CHARTER WZD London 2016-71.jpg` |
| `teddy-bear` | Mark Williams Photography London | gallery | `Mark Williams Photography London.jpg` |
| `wolf-puppet` | Mark Williams Photography London | gallery | `Mark Williams Photography London (2).jpg` |
| `piccadilly-rain` | Katerina Iacovides | gallery | `Photo-Katerina-Iacovides.jpg` |
| `zombies-crossing` | Mark Ridgwell | gallery | `Photo Mark Ridgwell 63.jpg` |
| `groaning-group` | Paul Carrano | gallery | `Photo Paul Carrano 22.jpg` |

### Credits needing confirmation

- **`the-horde`** — Filename says "photo by zero"; the image carries a © ChomiakBartosz watermark. Credit shown follows the watermark — confirm with the photographer.

## Renditions

`npm run images` reads `content/photos.json`, writes WebP at up to
three widths plus a JPEG fallback into `public/photos/`, and a
2400px press JPEG into `public/press/`. Originals are never
upscaled, so a small original gets fewer renditions:

| Slug | Widths written | Aspect |
|---|---|---|
| `bridge-horde` | 640, 1024, 1600 | 1.3343 |
| `the-horde` | 640, 1024, 1600 | 1.5 |
| `leicester-square-banner` | 640, 1024, 1600 | 1.5004 |
| `family-kerb` | 640, 1024, 1600 | 1.5 |
| `leake-street-crowd` | 640, 1024, 1600 | 1.5004 |
| `steward-crossing` | 640, 1024, 1600 | 1.5 |
| `zombie-dog` | 640, 1024 | 1.4989 |
| `kissing-booth` | 640, 1024, 1600 | 1.5004 |
| `selfie` | 640, 1024, 1600 | 1.5103 |
| `london-eye-pair` | 640, 1024, 1600 | 1.5004 |
| `half-face-portrait` | 640, 1024, 1600 | 1.5004 |
| `stop-sign-couple` | 640, 1024, 1600 | 1.4976 |
| `makeup-blood` | 640, 1024, 1600 | 1.4983 |
| `teddy-bear` | 640 | 1.0997 |
| `wolf-puppet` | 640 | 0.6667 |
| `piccadilly-rain` | 640, 1024 | 1.4989 |
| `zombies-crossing` | 640, 1024, 1600 | 1.5004 |
| `groaning-group` | 640, 1024, 1600 | 1.5004 |

The full-resolution originals live in `assets/originals/`, which is
gitignored — about 31 MB, and reproducible only from the
photographers' files. **Keep a backup outside this repository.**

## Still on the old WordPress site

The WordPress export lists **301 attachments** that were not
migrated — they could not be downloaded from this build environment.
They are at `https://worldzombieday.co.uk/wp-content/uploads/…` and
should be retrieved **before the WordPress site is switched off**.

To find them:

```bash
grep -o 'https://worldzombieday.co.uk/wp-content/uploads/[^<]*' \
  worldzombieday.wordpress.xml | sort -u
```

Anything added from that set needs a photographer credit before it
can be used — most of those files are named after Facebook photo IDs
and carry no attribution.
