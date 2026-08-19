import Link from "next/link"
import { EVENT, NAV, FOOTER_NAV, LEGAL_NAV } from "@/lib/event"
import { makeT, type SiteCopy } from "@/components/notion-text"
import { Reveal } from "@/components/reveal"

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

        {/* Blood that has run down the page and pooled at the foot of it.
            Two layers, the darker one behind and a little higher. Each is
            an uneven pool plus a handful of streaks that ran down into it
            — no two the same width, no two the same length, and never
            evenly spaced, or it reads as a row of flames.

            It arrives once: the layers slide up, the back one a beat
            behind, and then both stop. Nothing loops. A band that moved
            forever would need a pause control under WCAG 2.2.2, and the
            house style is that things arrive and stay still. */}
        <Reveal variant="slide-up" className="mt-10 block">
          <svg
            viewBox="0 0 1440 220"
            preserveAspectRatio="none"
            aria-hidden="true"
            focusable="false"
            className="drip block h-[120px] w-full sm:h-[180px]"
          >
            <g className="drip-back" fill="var(--blood)" opacity="0.5">
              <path d="M0,152 L66,143 L116,150 L188,138 L231,148 L288,135 L376,142 L415,151 L476,139 L572,145 L616,134 L694,149 L746,137 L812,143 L862,150 L934,138 L977,148 L1034,135 L1122,142 L1161,151 L1222,139 L1318,145 L1362,134 L1440,149 L1440,220 L0,220 Z" />
              <path d="M251,176 C253,107 262,85 262,79 C262,62 280,62 280,79 C280,85 283,107 285,176 Z M730,176 C731,121 733,107 733,103 C733,90 747,90 747,103 C747,107 753,121 754,176 Z M1010,176 C1012,95 1024,67 1024,60 C1024,37 1048,37 1048,60 C1048,67 1052,95 1054,176 Z M1264,176 C1265,130 1268,119 1268,116 C1268,108 1276,108 1276,116 C1276,119 1279,130 1280,176 Z" />
            </g>
            <g className="drip-front" fill="var(--blood)">
              <path d="M0,170 L52,151 L130,167 L174,148 L270,161 L331,155 L370,169 L458,158 L515,149 L558,164 L630,152 L680,168 L746,159 L798,151 L876,167 L920,148 L1016,161 L1077,155 L1116,169 L1204,158 L1261,149 L1304,164 L1376,152 L1426,168 L1440,159 L1440,220 L0,220 Z" />
              <path d="M127,194 C129,101 142,64 142,57 C142,33 168,33 168,57 C168,64 171,101 173,194 Z M382,194 C383,134 386,113 386,110 C386,99 398,99 398,110 C398,113 401,134 402,194 Z M587,194 C590,91 605,53 605,43 C605,11 639,11 639,43 C639,53 646,91 649,194 Z M885,194 C886,124 888,97 888,93 C888,80 902,80 902,93 C902,97 910,124 911,194 Z M1133,194 C1135,108 1138,75 1138,68 C1138,49 1158,49 1158,68 C1158,75 1169,108 1171,194 Z M1339,194 C1340,137 1345,118 1345,115 C1345,106 1355,106 1355,115 C1355,118 1356,137 1357,194 Z" />
            </g>
          </svg>
        </Reveal>
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
            <T k="footer.cause" />{" "}
            <a
              className="underline decoration-2 underline-offset-4 hover:no-underline"
              href={EVENT.cause.url}
              rel="noopener noreferrer"
            >
              {EVENT.cause.name}
            </a>{" "}
            &middot;{" "}
            <a
              className="underline decoration-2 underline-offset-4 hover:no-underline"
              href={EVENT.cause.donateUrl}
              rel="noopener noreferrer"
            >
              {EVENT.cause.donateLabel}
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
