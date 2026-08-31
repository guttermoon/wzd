import type { Metadata } from "next"
import { getSiteCopy } from "@/lib/site-copy"
import { makeT, makeS, makeP } from "@/components/notion-text"
import { makeCta } from "@/components/cta"
import { PageShell, Section } from "@/components/page-shell"

/**
 * Where the newsletter's double opt-in link lands.
 *
 * Brevo sends the confirmation email; clicking the link in it confirms the
 * subscription at Brevo's end and then redirects here. So by the time
 * anyone sees this page they are already on the list — this only tells
 * them so. Nothing here subscribes anybody, and nothing here should: a
 * page that acted on being loaded would fire for every mail scanner that
 * follows links in an inbox.
 *
 * `BREVO_DOI_REDIRECT` is what points Brevo at this path. If it is unset
 * the redirect falls back to the site root, which is not wrong, only
 * silent — someone who has just confirmed lands on the homepage with no
 * acknowledgement that anything happened.
 *
 * ── Why it says what it says ─────────────────────────────────────────
 *
 * The walk is free and the newsletter is a mailing list, and it is easy to
 * finish signing up for the second believing you have done the first. That
 * mistake is only discovered on the day, by someone who turned up without
 * a meeting point. Saying it here, at the one moment we have their
 * attention, is the cheapest place to catch it.
 */
export const revalidate = 60

export const metadata: Metadata = {
  title: "Newsletter confirmed",
  description:
    "Your email address is confirmed for the World Zombie Day: London newsletter.",
  alternates: { canonical: "/confirmed" },
  // Kept out of search results, and out of the sitemap with it. This page
  // is the far end of a link in an email; it means nothing to anyone
  // arriving cold, and a search result for it would only confuse someone
  // looking for the newsletter or the walk.
  robots: { index: false, follow: true },
}

export default async function ConfirmedPage() {
  const copy = await getSiteCopy()
  const T = makeT(copy)
  const S = makeS(copy)
  const P = makeP(copy)
  const Cta = makeCta(copy)

  return (
    <PageShell
      title={<T k="confirmed.title" />}
      titleText={S("confirmed.title")}
      standfirst={<T k="confirmed.standfirst" />}
    >
      <Section className="mt-10">
        <P k="confirmed.body" className="prose-wzd font-body" />

        {/* The correction, in a panel rather than in the run of the text.
            It is the one thing on this page somebody might act on, and it
            has to survive being skim-read by someone who has already got
            what they came for. */}
        <div className="mt-8 border-2 border-text p-6">
          <h2 className="display text-xl">
            <T k="confirmed.notice.title" />
          </h2>
          <P k="confirmed.notice.body" className="prose-wzd mt-3 font-body" />
          {/* Internal, so this renders through next/link and stays in the
              tab. Written as a path rather than the full address for that
              reason: an https:// destination would be read as leaving the
              site and open a new tab. */}
          <Cta
            k="confirmed.notice.cta"
            href="/register"
            className="btn btn-primary mt-6"
          />
        </div>
      </Section>
    </PageShell>
  )
}
