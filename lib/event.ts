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
