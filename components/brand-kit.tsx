import { BrainMark } from "@/components/brain-mark"
import { Wordmark } from "@/components/wordmark"

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
        {/* The lock-up on both grounds, because it is one asset that has to
            work on either. Both grounds are written out rather than taken
            from the theme tokens: --bg and --text follow the visitor's
            theme, so in dark mode the two panels came out identical and
            the whole point of showing a pair was lost. These are the two
            PNGs offered below, in the two inks they are rendered in. */}
        <div className="cut-panel flex items-center justify-center bg-[#FEFEFC] p-8 text-[#333333]">
          <Wordmark className="w-full max-w-[18rem]" label={false} />
        </div>
        <div className="cut-panel flex items-center justify-center bg-[#1A1A1A] p-8 text-[#F7E7D8]">
          <Wordmark className="w-full max-w-[18rem]" label={false} />
        </div>
      </div>

      <div className="cut-panel flex items-center gap-6 p-8">
        <span className="block h-24 w-24 shrink-0">
          <BrainMark />
        </span>
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
