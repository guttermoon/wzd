import Link from "next/link"
import { NAV } from "@/lib/event"
import { Wordmark } from "@/components/wordmark"
import { ThemeToggle } from "@/components/theme-toggle"

/**
 * Masthead and primary navigation.
 *
 * The mobile menu is a native <details>, so it opens with the keyboard,
 * works before hydration, and needs no focus-trapping of its own.
 */
export function Header() {
  return (
    <header className="border-b-2 border-rule bg-bg">
      <div className="mx-auto flex max-w-page items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <Link href="/" className="block w-[190px] shrink-0 text-text sm:w-[230px]">
          <Wordmark className="w-full" />
          <span className="sr-only">World Zombie Day: London — home</span>
        </Link>

        <div className="flex items-center gap-2">
          <nav aria-label="Primary" className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {NAV.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="display flex min-h-[44px] items-center px-3 text-sm text-text hover:bg-text hover:text-bg"
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
              className="inline-flex h-11 w-11 cursor-pointer list-none items-center justify-center border-2 border-rule [&::-webkit-details-marker]:hidden"
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
