/**
 * The handful of facts that appear all over the site. Anything here is
 * structural (URLs, dates used for machine-readable markup); the words
 * around them live in content/site-copy.json and are editable in Notion.
 */
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
   * Who the event raises money for. The Dead Good Club is a Community
   * Interest Company, so this is a community fundraising event and the
   * site must never describe it as a charity.
   */
  cause: {
    name: "The Dead Good Club",
    legalForm: "Community Interest Company",
    url: "https://deadgoodclub.com/",
    donateUrl: "https://paa.ge/worldzombieday",
    donateLabel: "paa.ge/worldzombieday",
  },
  hashtags: ["#WZD2026", "#WorldZombieDay"],
  /** Order is the order they appear in the footer. */
  social: [
    { name: "Instagram", url: "https://www.instagram.com/worldzombieday/" },
    { name: "WhatsApp", url: "https://www.whatsapp.com/channel/0029Vb8N0wmInlqHa7MdYB1S" },
    { name: "Discord", url: "https://discord.com/invite/EFr4eCu5Mh" },
    { name: "Facebook", url: "https://www.facebook.com/worldzombiedaylondon/" },
    { name: "Twitter", url: "https://twitter.com/WZDlondon" },
  ],
} as const

/** Primary navigation. Secondary links live in the footer. */
export const NAV = [
  { name: "Home", href: "/" },
  { name: "Register", href: "/register" },
  { name: "Survival", href: "/survival" },
  { name: "FAQ", href: "/faq" },
  { name: "Sponsors", href: "/become-a-sponsor" },
] as const

export const FOOTER_NAV = [
  { name: "Donate", href: "/donate" },
  { name: "Press kit", href: "/press" },
  { name: "Photo policy", href: "/photo-policy" },
] as const

/** Small print, set in the footer's bottom rule rather than the nav list. */
export const LEGAL_NAV = [{ name: "Privacy", href: "/privacy" }] as const
