import Link from "next/link"
import { NAV } from "@/lib/event"
import { BrainMark } from "@/components/brain-mark"
import { ThemeToggle } from "@/components/theme-toggle"
import { MobileMenu } from "@/components/mobile-menu"

/**
 * Masthead and primary navigation, on the blood field.
 *
 * The bar carries the same red as the block below it, so the two read as
 * one slab rather than a strip of page furniture sitting on top of the
 * design. White on --blood is 6.02:1, which is why the field is --blood
 * and not Zombie Red: white on Zombie Red is 3.82:1, short of what nav
 * links at this size need.
 *
 * Sticky, and opaque rather than translucent, so content scrolling beneath
 * it is covered rather than showing through and fighting the nav links.
 *
 * No rule under it: the bar carries the same red as the block below, so
 * where they meet there is nothing to divide, and everywhere else the
 * change of colour is the division. z-40 sits under the cookie bar and the
 * skip link, both of which have to be reachable over it.
 *
 * The small-screen menu lives in components/mobile-menu.tsx, which needs
 * to be a client component: app-router navigation does not reload the
 * page, so a native <details> has to be told to close itself.
 */
export function Header() {
  return (
    <header className="on-blood sticky top-0 z-40 bg-blood text-blood-text">
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

          <MobileMenu />
        </div>
      </div>
    </header>
  )
}
