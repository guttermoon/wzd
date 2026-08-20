import Link from "next/link"
import { NAV } from "@/lib/event"
import { BrainMark } from "@/components/brain-mark"
import { ThemeToggle } from "@/components/theme-toggle"

/**
 * Masthead and primary navigation, on the blood field.
 *
 * The bar carries the same red as the block below it, so the two read as
 * one slab rather than a strip of page furniture sitting on top of the
 * design. White on --blood is 6.02:1, which is why the field is --blood
 * and not Zombie Red: white on Zombie Red is 3.82:1, short of what nav
 * links at this size need.
 *
 * No rule under it. A full-width hairline across the top of every page
 * read as a border on the content rather than a division between the two,
 * and the header does not scroll with the page, so nothing passes under it
 * that needs separating.
 *
 * The mobile menu is a native <details>, so it opens with the keyboard,
 * works before hydration, and needs no focus-trapping of its own.
 */
export function Header() {
  return (
    <header className="on-blood bg-blood text-blood-text">
      <div className="mx-auto flex max-w-page items-center justify-between gap-4 px-4 py-3 sm:px-6">
        {/* The mark alone. It squares up with the theme toggle and the menu
            button at 44px, which is what keeps the bar tight. */}
        <Link href="/" className="block h-11 w-11 shrink-0">
          <BrainMark />
          <span className="sr-only">World Zombie Day: London, home</span>
        </Link>

        <div className="flex items-center gap-2">
          <nav aria-label="Primary" className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {NAV.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="display flex min-h-[44px] items-center px-3 text-sm hover:bg-blood-text hover:text-blood"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <ThemeToggle />

          <details className="group relative lg:hidden">
            <summary
              className="inline-flex h-11 w-11 cursor-pointer list-none items-center justify-center border-2 border-blood-text [&::-webkit-details-marker]:hidden"
              aria-label="Menu"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
                <path
                  d="M3 6h18M3 12h18M3 18h18"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              </svg>
            </summary>
            <nav
              aria-label="Primary"
              className="absolute right-0 z-50 mt-2 w-56 border-2 border-rule bg-bg p-2 shadow-lg"
            >
              <ul>
                {NAV.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="display flex min-h-[44px] items-center px-3 text-base text-text hover:bg-text hover:text-bg"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </details>
        </div>
      </div>
    </header>
  )
}
