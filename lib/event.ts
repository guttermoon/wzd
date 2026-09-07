/**
 * The handful of facts that appear all over the site. Anything here is
 * structural (URLs, dates used for machine-readable markup); the words
 * around them live in content/site-copy.json and are editable in Notion.
 */
const DISCORD = "https://discord.com/invite/EFr4eCu5Mh"

export const EVENT = {
  name: "World Zombie Day: London",
  shortName: "World Zombie Day",
  /** Machine-readable start — the second Saturday of October 2026, midday. */
  startsAt: "2026-10-10T12:00:00+01:00",
  /** Human-readable, and duplicated in copy so it stays editable. */
  dateLabel: "Saturday 10 October 2026",
  locality: "London",
  region: "Greater London",
  country: "GB",
  email: "info@worldzombieday.co.uk",
  /**
   * Photograph submissions go to Megan rather than the general address:
   * she is the one who sorts them, credits them and answers about them.
   * The owner's instruction, and it is the address the form's own help
   * text asks people to share their folders with.
   */
  photoSubmissions: "megan@worldzombieday.co.uk",
  /**
   * Who the event raises money for. The Dead Good Club is a Community
   * Interest Company, so this is a community fundraising event and the
   * site must never describe it as a charity.
   */
  cause: {
    name: "The Dead Good Club",
    legalForm: "Community Interest Company",
    url: "https://deadgoodclub.com/",
    /**
     * The peer-to-peer fundraising page on Zeffy, which is where every
     * Donate on the site points. paa.ge is still the club's own page and
     * the newsletter list; it is not the donation destination.
     */
    donateUrl: "https://www.zeffy.com/en-GB/peer-to-peer/world-zombie-day-london",
    donateLabel: "Donate on Zeffy",
    /** Their manifesto — what the club is for, in their own words. */
    manifestoUrl: "https://deadgoodclub.com/manifesto",
  },
  /**
   * The after-party, which is a separate venue with its own ticket. The
   * words are in content/site-copy.json under `party.`; these are the
   * facts that have to stay exact.
   */
  afterParty: {
    venue: "BLOODSport by MEATliquor",
    url: "https://bloodsports.co/",
    address: "27-29 Endell St, London WC2H 9BA",
    /** Machine-readable, for the structured data on /register. */
    startsAt: "2026-10-10T19:30:00+01:00",
    supporters: ["BLOODSport by MEATliquor", "Harbour Brewing Co"],
  },
  hashtags: ["#WZD2026", "#WorldZombieDay"],
  /**
   * The two typefaces, for the press kit. Crackhouse is the style guide's
   * display face and is not shipped — the lock-up carries its letterforms
   * as paths — so these are the two a journalist can actually get.
   */
  /**
   * The walking route, leg by leg. These are the built-in destinations for
   * the buttons on /the-route, so the page is right with no Notion at all,
   * exactly as every other button on the site is; the row's `URL` field
   * still overrides, which is how the owner repoints a leg when the route
   * changes without waiting for a deploy.
   */
  route: {
    /** Base camp, for the check-in row. */
    arrive: "https://maps.app.goo.gl/TX8nCKRAZE1NUdVJA",
    /** Where most people arrive from, for "Getting there". A different
     *  place from base camp, so a different link — these two were the
     *  same address for a while and the check-in row was pointing at the
     *  station under the words "Soho Square". */
    station: "https://maps.app.goo.gl/9k6zPZhiRm7Dw4UU9",
    walk1: "https://maps.app.goo.gl/tZgNss8E15NzXtPj7",
    walk2: "https://maps.app.goo.gl/gdUa7zzARV4mZtEE9",
    walk3: "https://maps.app.goo.gl/1wZdxgZkGZoV7Foh8",
    walk4: "https://maps.app.goo.gl/Eqgjr8UBWD6SahpL7",
    bonus: "https://maps.app.goo.gl/VKh53xof81Q8MZjz6",
  } as Record<string, string>,
  fonts: {
    display: "https://fonts.google.com/specimen/Grandstander",
    text: "https://fonts.google.com/specimen/Raleway",
  },
  /**
   * The community. It is in `social` below as well, because it is one of
   * the four icons in the footer; named here because /faq sends people to
   * it as the first place to ask a question, and one address should not
   * be typed twice.
   */
  discordUrl: DISCORD,
  /** Order is the order they appear in the footer. */
  social: [
    { name: "Instagram", url: "https://www.instagram.com/worldzombieday/" },
    { name: "WhatsApp", url: "https://www.whatsapp.com/channel/0029Vb8N0wmInlqHa7MdYB1S" },
    { name: "Discord", url: DISCORD },
    { name: "Facebook", url: "https://www.facebook.com/worldzombiedaylondon/" },
  ],
} as const

/** Primary navigation. Secondary links live in the footer. */
export const NAV = [
  { name: "Home", href: "/" },
  { name: "Register", href: "/register" },
  { name: "Survival", href: "/survival" },
  { name: "FAQ", href: "/faq" },
  { name: "Donate", href: "/donate" },
] as const

export const FOOTER_NAV = [
  { name: "Become a sponsor", href: "/become-a-sponsor" },
  { name: "Press kit", href: "/press" },
  { name: "Photo policy", href: "/photo-policy" },
  { name: "Submit photos", href: "/submit-photos" },
] as const

/** Small print, set in the footer's bottom rule rather than the nav list. */
export const LEGAL_NAV = [{ name: "Privacy", href: "/privacy" }] as const

/**
 * Routes that exist but are deliberately not linked from anywhere.
 *
 * /confirmed is the far end of the link in the newsletter's confirmation
 * email; it is reached from an inbox, never from the site, so it is in no
 * nav and — being noindex — in no sitemap either.
 *
 * It is still listed, because POST /api/revalidate only accepts paths it
 * can find in one of these arrays. Left out, the one page whose copy the
 * owner might want to fix in a hurry would be the one page they could not
 * push through ahead of the 60-second window.
 */
/**
 * Printed QR codes, and where each one currently points.
 *
 * A QR code on a poster cannot be changed once it is printed, and a
 * printed run outlives every decision that went into it: the poster that
 * says "scan to register" is still on a wall in November, when registering
 * is over and the useful thing to show someone is next year's date. So the
 * code never carries the destination — it carries `/go/<code>`, which is a
 * permanent address on this site, and the destination is a `URL` cell in
 * Notion that the owner can repoint in ten seconds without a deploy.
 *
 * `href` is where it goes when Notion says nothing, on exactly the terms
 * `Cta` uses: the override wins, the built-in stands with an empty cell or
 * no Notion at all. One thing follows from that and it is worth saying
 * plainly — **a built-in has to be a destination that is genuinely all
 * right**, not a placeholder. It is what a scan gets if the Notion read
 * fails, and a QR code that quietly falls back to a page nobody meant is
 * worse than one that never moved.
 *
 * Adding a code is a line here plus a `qr.<code>` row in Notion. Nothing
 * renders these labels; they are what the owner sees in the row's `Text`
 * so they can tell which poster they are repointing.
 */
export const QR_CODES = [
  {
    code: "poster",
    label: "General poster — the home page",
    href: "/",
  },
  {
    code: "register",
    label: "Sign-up poster — the registration page",
    href: "/register",
  },
  {
    code: "sticker",
    label: "Sticker — the fundraising page",
    href: EVENT.cause.donateUrl,
  },
  {
    code: "flag",
    label: "Flag — the home page",
    href: "/",
  },
] as const

export type QrCode = (typeof QR_CODES)[number]["code"]

/** The code named by a path segment, whatever case it was printed in. */
export function qrCode(segment: string) {
  // Lower-cased on the way in because QR's alphanumeric mode has no lower
  // case and is markedly denser than byte mode, so someone squeezing a
  // code onto a small label may well upper-case the URL. The segment is
  // ours, so it costs nothing to accept both.
  //
  // Only the segment, though: the literal `go` in front of it is a
  // directory name and route matching is case-sensitive, so /GO/POSTER
  // does 404. It cannot be fixed here or in `redirects()` — Next compiles
  // those matchers case-insensitively, so a rule for /GO/:code also
  // catches /go/:code and the route redirects to itself forever — and a
  // second route directory differing only in case is something neither
  // TypeScript nor webpack will build. So the rule is simply that the URL
  // given out for encoding is the lower-case one, which is what
  // docs/NOTION_SETUP.md prints.
  const wanted = segment.trim().toLowerCase()
  return QR_CODES.find((entry) => entry.code === wanted) ?? null
}

export const UNLISTED_NAV = [
  { name: "Newsletter confirmed", href: "/confirmed" },
  /**
   * The running order, behind a password. Unlisted for the same reason it
   * is gated: it names the meeting point, and a link to it in the footer
   * would tell anyone reading that the meeting point is one password away.
   * Listed here so `POST /api/revalidate` can still push a correction to
   * it — the page whose copy is most likely to need fixing in a hurry, on
   * the morning of the walk, must not be the one page that cannot be.
   */
  { name: "The route", href: "/the-route" },
] as const
