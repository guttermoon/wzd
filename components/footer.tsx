import Link from "next/link"
import { EVENT, NAV, FOOTER_NAV } from "@/lib/event"
import { makeT, type SiteCopy } from "@/components/notion-text"

export function Footer({ copy }: { copy: SiteCopy }) {
  const T = makeT(copy)

  return (
    <footer className="mt-16 border-t-2 border-rule bg-bg">
      <div className="torn-bar" aria-hidden="true" />
      <div className="mx-auto max-w-page px-4 py-12 sm:px-6">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <p className="display text-2xl">World Zombie Day: London</p>
            <p className="mt-3 max-w-[46ch] font-body text-muted">
              <T k="footer.tagline" />
            </p>
            <p className="mt-3 font-body text-muted">
              <T k="footer.charity" />{" "}
              <a className="link" href={EVENT.charity.donateUrl} rel="noopener noreferrer">
                {EVENT.charity.donateLabel}
              </a>
            </p>
          </div>

          <nav aria-label="Footer">
            <h2 className="display text-sm tracking-wide text-muted">Pages</h2>
            <ul className="mt-3 space-y-1">
              {[...NAV, ...FOOTER_NAV].map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="link inline-flex min-h-[44px] items-center font-body"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="display text-sm tracking-wide text-muted">
              <T k="footer.contact.title" />
            </h2>
            <p className="mt-3 font-body">
              <a className="link break-words" href={`mailto:${EVENT.email}`}>
                {EVENT.email}
              </a>
            </p>

            <h2 className="display mt-6 text-sm tracking-wide text-muted">
              <T k="footer.follow.title" />
            </h2>
            <ul className="mt-3 space-y-1">
              {EVENT.social.map((item) => (
                <li key={item.url}>
                  <a
                    className="link inline-flex min-h-[44px] items-center font-body"
                    href={item.url}
                    rel="noopener noreferrer"
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <p className="mt-12 border-t-2 border-edge pt-6 font-body text-sm text-muted">
          © {new Date().getFullYear()} World Zombie Day: London. <T k="footer.colophon" />
        </p>
      </div>
    </footer>
  )
}
