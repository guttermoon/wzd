import Link from "next/link"
import { EVENT, NAV, FOOTER_NAV, LEGAL_NAV } from "@/lib/event"
import { makeT, type SiteCopy } from "@/components/notion-text"
import { Reveal } from "@/components/reveal"
import { Wordmark } from "@/components/wordmark"
import { Divider } from "@/components/divider"
import { ExternalLink } from "@/components/external-link"
import { EmailSignup } from "@/components/email-signup"

/** Minimal glyphs, so no icon dependency is pulled in for four links. */
const ICONS: Record<string, string> = {
  Discord:
    "M19.27 5.33A16.5 16.5 0 0 0 15.1 4l-.2.37a12.6 12.6 0 0 1 3.68 1.9 15.6 15.6 0 0 0-12.55 0A12.6 12.6 0 0 1 9.7 4.37L9.5 4a16.5 16.5 0 0 0-4.17 1.33C2.7 9.28 1.98 13.12 2.34 16.9a16.7 16.7 0 0 0 5.05 2.56l.4-.55c-.7-.26-1.36-.58-1.98-.96l.16-.12a11.8 11.8 0 0 0 10.06 0l.16.12c-.62.38-1.28.7-1.98.96l.4.55a16.7 16.7 0 0 0 5.05-2.56c.42-4.4-.72-8.2-2.39-11.57ZM8.68 14.6c-.99 0-1.8-.9-1.8-2.02 0-1.11.79-2.02 1.8-2.02s1.82.91 1.8 2.02c0 1.12-.8 2.02-1.8 2.02Zm6.64 0c-.99 0-1.8-.9-1.8-2.02 0-1.11.79-2.02 1.8-2.02s1.81.91 1.8 2.02c0 1.12-.79 2.02-1.8 2.02Z",
  Facebook:
    "M14 9h3V6h-3c-2.2 0-4 1.8-4 4v2H8v3h2v7h3v-7h3l1-3h-4v-2c0-.6.4-1 1-1Z",
  Instagram:
    "M12 8.6a3.4 3.4 0 1 0 0 6.8 3.4 3.4 0 0 0 0-6.8Zm0 5.6a2.2 2.2 0 1 1 0-4.4 2.2 2.2 0 0 1 0 4.4ZM16 3H8a5 5 0 0 0-5 5v8a5 5 0 0 0 5 5h8a5 5 0 0 0 5-5V8a5 5 0 0 0-5-5Zm3.8 13a3.8 3.8 0 0 1-3.8 3.8H8A3.8 3.8 0 0 1 4.2 16V8A3.8 3.8 0 0 1 8 4.2h8A3.8 3.8 0 0 1 19.8 8v8Zm-2.9-9.7a.9.9 0 1 0 0 1.8.9.9 0 0 0 0-1.8Z",
  WhatsApp:
    "M12.04 2a9.9 9.9 0 0 0-8.59 14.86L2 22l5.25-1.38A9.9 9.9 0 1 0 12.04 2Zm0 18.15a8.2 8.2 0 0 1-4.34-1.19l-.31-.18-3.12.82.83-3.04-.2-.32a8.23 8.23 0 1 1 7.14 3.91Zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.16.24-.64.8-.79.97-.14.16-.29.18-.54.06-.25-.13-1.05-.39-2-1.23-.74-.66-1.24-1.47-1.38-1.72-.15-.25-.02-.38.11-.5.11-.11.25-.29.37-.43.12-.15.16-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.35-.77-1.85-.2-.48-.41-.42-.56-.43h-.48c-.16 0-.43.06-.65.31-.22.25-.85.83-.85 2.03s.87 2.35.99 2.51c.12.16 1.71 2.61 4.15 3.66.58.25 1.03.4 1.39.51.58.19 1.11.16 1.53.1.47-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.15-1.18-.06-.11-.22-.17-.47-.29Z",
}

export function Footer({ copy }: { copy: SiteCopy }) {
  const T = makeT(copy)

  return (
    <footer className="mt-16">
      {/* The page turns from left-set to centred here, so the break gets
          marked the way every other section break on the site is: slabs,
          not a rule. Without it the sign-off reads as a stray centred
          paragraph at the end of a left-aligned page. */}
      <Divider lead="left" />

      {/* The newsletter, on the page's own ground. Inside <footer>, so it
          sits in the contentinfo landmark rather than in the gap between
          landmarks, which is what axe failed on when this was a band of
          its own between <main> and here. No heading of ours above it: the
          form carries its own, and two titles in a row said the same thing
          twice. */}
      <div className="bg-bg pt-16">
        <div className="mx-auto max-w-page px-4 text-center sm:px-6">
          <h2 className="display text-[clamp(1.5rem,4vw,2.25rem)]">
            <T k="site.name" />
          </h2>
          <p className="mx-auto mt-4 max-w-[46ch] font-body text-muted">
            <T k="footer.tagline" />
          </p>
          <div className="mt-8">
            <EmailSignup
              copy={{
                label: copy["site.newsletter.label"] ?? "",
                placeholder: copy["site.newsletter.placeholder"] ?? "",
                submit: copy["site.newsletter.submit"] ?? "",
                sending: copy["site.newsletter.sending"] ?? "",
                done: copy["site.newsletter.done"] ?? "",
                bademail: copy["site.newsletter.bademail"] ?? "",
                failed: copy["site.newsletter.failed"] ?? "",
                failedCta: copy["site.newsletter.failed.cta"] ?? "",
              }}
            />
          </div>
        </div>

        {/* The blood pooled at the foot of the page. Two layers with hard
            straight facets, the darker one behind and a little higher —
            the sharpness and the difference in weight between the two is
            the whole effect. No tall runs: a spike rising out of a pool is
            not what blood does, and it read as a skyline.

            It arrives once, the layers sliding up a beat apart, and then
            it travels: the near layer to the right, the far one to the
            left, forever. Both paths are three periods of the same crest
            sequence, drawn from -1440 to 2880, so a shift of exactly one
            period lands the wave back on itself and the loop has no seam.
            That is also why the first and last point of a period share a
            y: any difference between them is a visible step.

            This is the one loop on the site. It is decorative and
            aria-hidden, and reduced motion stops it dead. See
            .drip-wave-front / .drip-wave-back in globals.css. */}
        <Reveal variant="slide-up" className="mt-10 block">
          <svg
            viewBox="0 0 1440 220"
            preserveAspectRatio="none"
            aria-hidden="true"
            focusable="false"
            className="drip block h-[70px] w-full sm:h-[110px]"
          >
            {/* Each layer is wrapped so the swell and the arrival can run
                at once: both drive transform, and two animations on one
                element replace each other rather than composing. */}
            <g className="drip-wave-back">
              <path className="drip-back" d="M-1440,132 L-1290,106 L-1168,124 L-1050,94 L-932,118 L-804,86 L-680,122 L-560,104 L-430,82 L-310,120 L-184,100 L-60,112 L0,132 L150,106 L272,124 L390,94 L508,118 L636,86 L760,122 L880,104 L1010,82 L1130,120 L1256,100 L1380,112 L1440,132 L1590,106 L1712,124 L1830,94 L1948,118 L2076,86 L2200,122 L2320,104 L2450,82 L2570,120 L2696,100 L2820,112 L2880,132 L2880,220 L-1440,220 Z" fill="var(--blood)" opacity="0.55" />
            </g>
            <g className="drip-wave-front">
              <path className="drip-front" d="M-1440,150 L-1344,132 L-1226,146 L-1102,106 L-988,138 L-880,120 L-750,144 L-628,98 L-510,134 L-396,116 L-272,142 L-148,110 L-40,136 L0,150 L96,132 L214,146 L338,106 L452,138 L560,120 L690,144 L812,98 L930,134 L1044,116 L1168,142 L1292,110 L1400,136 L1440,150 L1536,132 L1654,146 L1778,106 L1892,138 L2000,120 L2130,144 L2252,98 L2370,134 L2484,116 L2608,142 L2732,110 L2840,136 L2880,150 L2880,220 L-1440,220 Z" fill="var(--blood)" />
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
                <ExternalLink
                  href={item.url}
                  className="inline-flex h-11 w-11 items-center justify-center hover:opacity-70"
                >
                  <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden="true">
                    <path d={ICONS[item.name]} fill="currentColor" />
                  </svg>
                  <span className="sr-only">{item.name}</span>
                </ExternalLink>
              </li>
            ))}
          </ul>

          {/* The lock-up, under the social row, on the blood field. Small:
              this is a sign-off, not a title card, and the masthead
              already carries the mark. The lettering takes `currentColor`,
              so the one file serves this field and both themes. */}
          {/* Exactly the width of the social row above it: four 44px
              targets and three 8px gaps is 200px, so the two line up on
              both edges. */}
          <Wordmark className="mx-auto mt-8 w-full max-w-[200px]" />

          <nav aria-label="Footer" className="mt-6">
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
            <ExternalLink
              className="underline decoration-2 underline-offset-4 hover:no-underline"
              href={EVENT.cause.url}
            >
              {EVENT.cause.name}
            </ExternalLink>{" "}
            &middot;{" "}
            <ExternalLink
              className="underline decoration-2 underline-offset-4 hover:no-underline"
              href={EVENT.cause.donateUrl}
            >
              {EVENT.cause.donateLabel}
            </ExternalLink>
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
