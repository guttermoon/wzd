import Link from "next/link"
import { EVENT, NAV, FOOTER_NAV, LEGAL_NAV } from "@/lib/event"
import { makeT, type SiteCopy } from "@/components/notion-text"

/** Minimal glyphs, so no icon dependency is pulled in for four links. */
const ICONS: Record<string, string> = {
  Facebook:
    "M14 9h3V6h-3c-2.2 0-4 1.8-4 4v2H8v3h2v7h3v-7h3l1-3h-4v-2c0-.6.4-1 1-1Z",
  Instagram:
    "M12 8.6a3.4 3.4 0 1 0 0 6.8 3.4 3.4 0 0 0 0-6.8Zm0 5.6a2.2 2.2 0 1 1 0-4.4 2.2 2.2 0 0 1 0 4.4ZM16 3H8a5 5 0 0 0-5 5v8a5 5 0 0 0 5 5h8a5 5 0 0 0 5-5V8a5 5 0 0 0-5-5Zm3.8 13a3.8 3.8 0 0 1-3.8 3.8H8A3.8 3.8 0 0 1 4.2 16V8A3.8 3.8 0 0 1 8 4.2h8A3.8 3.8 0 0 1 19.8 8v8Zm-2.9-9.7a.9.9 0 1 0 0 1.8.9.9 0 0 0 0-1.8Z",
  Twitter:
    "M21 6.5c-.7.3-1.4.5-2.2.6a3.8 3.8 0 0 0 1.7-2.1c-.8.4-1.6.8-2.5.9a3.8 3.8 0 0 0-6.5 3.5A10.8 10.8 0 0 1 3.6 5.4a3.8 3.8 0 0 0 1.2 5.1c-.6 0-1.2-.2-1.7-.5a3.8 3.8 0 0 0 3 3.7c-.5.2-1.1.2-1.7.1a3.8 3.8 0 0 0 3.5 2.6A7.7 7.7 0 0 1 2 18.1a10.8 10.8 0 0 0 16.6-9.6c.8-.5 1.5-1.2 2-2Z",
}

export function Footer({ copy }: { copy: SiteCopy }) {
  const T = makeT(copy)

  return (
    <footer className="mt-16">
      {/* Black shoulder, then the tide of blood. The waves are decorative,
          so they carry no accessible name. */}
      <div className="bg-bg pt-12">
        <div className="mx-auto max-w-page px-4 text-center sm:px-6">
          <p className="display text-2xl sm:text-3xl">World Zombie Day: London</p>
          <p className="mx-auto mt-3 max-w-[46ch] font-body text-muted">
            <T k="footer.tagline" />
          </p>
        </div>

        <svg
          viewBox="0 0 1440 120"
          preserveAspectRatio="none"
          aria-hidden="true"
          focusable="false"
          className="mt-8 block h-[70px] w-full sm:h-[110px]"
        >
          <path
            d="M0 62c150-38 290 26 430 30 160 5 300-46 470-40 150 5 290 52 430 40 60-5 100-14 110-18v46H0Z"
            fill="var(--blood)"
            opacity="0.35"
          />
          <path
            d="M0 78c170-30 300 18 450 22 170 5 320-38 500-30 140 6 270 40 380 30 60-5 100-12 110-16v36H0Z"
            fill="var(--blood)"
            opacity="0.6"
          />
          <path
            d="M0 96c180-24 320 12 480 16 180 5 330-26 520-20 130 4 250 26 350 20 50-3 80-8 90-10v18H0Z"
            fill="var(--blood)"
          />
        </svg>
      </div>

      <div className="bg-blood text-blood-text">
        <div className="mx-auto max-w-page px-4 pb-10 pt-2 text-center sm:px-6">
          <h2 className="sr-only">
            <T k="footer.follow.title" />
          </h2>
          <ul className="flex flex-wrap justify-center gap-2">
            {EVENT.social.map((item) => (
              <li key={item.url}>
                <a
                  href={item.url}
                  rel="noopener noreferrer"
                  className="inline-flex h-11 w-11 items-center justify-center hover:opacity-70"
                >
                  <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden="true">
                    <path d={ICONS[item.name]} fill="currentColor" />
                  </svg>
                  <span className="sr-only">{item.name}</span>
                </a>
              </li>
            ))}
          </ul>

          <nav aria-label="Footer" className="mt-4">
            <ul className="flex flex-wrap justify-center gap-x-5 gap-y-1">
              {[...NAV, ...FOOTER_NAV].map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="inline-flex min-h-[44px] items-center font-body underline decoration-2 underline-offset-4 hover:no-underline"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <p className="mt-4 font-body">
            <T k="footer.charity" />{" "}
            <a
              className="underline decoration-2 underline-offset-4 hover:no-underline"
              href={EVENT.charity.donateUrl}
              rel="noopener noreferrer"
            >
              {EVENT.charity.donateLabel}
            </a>
          </p>
          <p className="mt-1 font-body">
            <a
              className="underline decoration-2 underline-offset-4 hover:no-underline"
              href={`mailto:${EVENT.email}`}
            >
              {EVENT.email}
            </a>
          </p>

          {/* Small print. */}
          <p className="mt-6 font-body text-sm text-blood-text/85">
            © {new Date().getFullYear()} World Zombie Day: London.{" "}
            <T k="footer.colophon" />{" "}
            {LEGAL_NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="underline decoration-2 underline-offset-4 hover:no-underline"
              >
                {item.name}
              </Link>
            ))}
          </p>
        </div>
      </div>
    </footer>
  )
}
