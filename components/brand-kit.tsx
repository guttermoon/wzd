import { Graphic } from "@/components/photo"

/**
 * The style guide palette. Zombie Red carries a warning because it is the
 * one people reach for and misuse: at body size it fails contrast either
 * way round.
 */
const PALETTE = [
  {
    name: "Zombie Red",
    hex: "#E74C3C",
    note: "Display only. Fills, rules and large headings, never body text.",
    swatch: "bg-[#E74C3C]",
  },
  {
    name: "Greige",
    hex: "#F7E7D8",
    note: "The type in dark mode, and the rules and borders on it.",
    swatch: "bg-[#F7E7D8]",
  },
  {
    name: "Dark Grey",
    hex: "#404040",
    note: "Secondary marks and dividers.",
    swatch: "bg-[#404040]",
  },
  {
    name: "Black",
    hex: "#1A1A1A",
    note: "The ground in dark mode, and the slabs on the red.",
    swatch: "bg-[#1A1A1A]",
  },
]

/**
 * The logos and the palette, shown rather than described, for the press
 * kit.
 *
 * The lock-up comes from components/wordmark.tsx, which inlines the same
 * file the download link serves, so what a journalist sees here is exactly
 * the asset they get. It takes `currentColor`, which is what lets one file
 * sit on both the light panel and the dark one below it. Both copies are
 * unlabelled: the section heading already names them, and three identical
 * announcements in a row is noise.
 *
 * The swatches are ordinary elements with a background colour, not pictures
 * of colours: they stay correct if a token ever moves, and they are
 * readable to anyone using a screen reader, which a flat image of a palette
 * is not.
 */
export function BrandKit() {
  return (
    <div className="mt-6 space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        {/* The supplied files themselves, not the site's own rendering of
            them. components/wordmark.tsx swaps the lettering to
            currentColor so one file can serve both themes, which is right
            for the masthead and wrong here: a press kit has to show the
            logo in the colours it was drawn in. These are the exact PNGs
            the buttons below hand out, so what a journalist sees is what
            they get, and they can save either straight off the page.

            Each sits on the ground it was drawn for, written out rather
            than taken from --bg, which follows the visitor's theme and
            would make the pair identical in dark mode. */}
        <div className="cut-panel flex items-center justify-center bg-[#FEFEFC] p-8">
          <Graphic
            src="/brand/wordmark-light-bg.png"
            alt="The World Zombie Day: London lock-up, for light backgrounds."
            width={590}
            height={500}
            sizes="(min-width: 40rem) 18rem, 100vw"
            frame={false}
            className="w-full max-w-[18rem]"
          />
        </div>
        <div className="cut-panel flex items-center justify-center bg-[#1A1A1A] p-8">
          <Graphic
            src="/brand/wordmark-dark-bg.png"
            alt="The World Zombie Day: London lock-up, for dark backgrounds."
            width={590}
            height={500}
            sizes="(min-width: 40rem) 18rem, 100vw"
            frame={false}
            className="w-full max-w-[18rem]"
          />
        </div>
      </div>

      <div className="cut-panel flex items-center gap-6 p-8">
        <Graphic
          src="/brand/brain.png"
          alt="The brain mark on its own."
          width={2179}
          height={2378}
          sizes="6rem"
          frame={false}
          className="w-24 shrink-0"
        />
        <p className="font-body text-muted">
          The brain mark on its own, for avatars, favicons and anywhere the
          full lock-up will not fit.
        </p>
      </div>

      <ul className="grid gap-3 sm:grid-cols-2">
        {PALETTE.map((colour) => (
          <li key={colour.hex} className="cut-panel flex items-stretch gap-4 p-3">
            {/* Outlined in the text colour, not the border colour: Greige
                on a greige panel and Black on a black one would otherwise
                have no edge at all, and each vanishes in a different
                theme. --text inverts between the two, so one rule covers
                both. */}
            <span
              aria-hidden="true"
              className={`block w-16 shrink-0 border-2 border-text ${colour.swatch}`}
            />
            <span className="font-body">
              <span className="display block text-base">{colour.name}</span>
              <span className="block text-sm text-muted">{colour.hex}</span>
              <span className="mt-1 block text-sm text-muted">{colour.note}</span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
