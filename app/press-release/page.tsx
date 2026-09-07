import type { Metadata } from "next"

import { getSiteCopy } from "@/lib/site-copy"
import { makeT, makeS, makeHas, makeAny, makeP } from "@/components/notion-text"
import { makeCta } from "@/components/cta"
import { PageShell, Section } from "@/components/page-shell"
import { ExternalLink } from "@/components/external-link"
import { EVENT } from "@/lib/event"
import { SITE_URL } from "@/lib/site"
import { pageMetadata } from "@/lib/seo"
import { jsonLd } from "@/lib/json-ld"

export const revalidate = 60

/**
 * The press release, on the site rather than as a file to be emailed.
 *
 * A release that only exists as a PDF in an inbox cannot be corrected, and
 * a journalist who finds it six weeks later has no way of knowing whether
 * it still says what it said. This one is a page: it has a URL to link to,
 * it is indexed, and every line of it is a Notion row, so a date that
 * moves or a partner that changes is an edit rather than a reissue.
 *
 * /press keeps its own release button, and it now points here unless the
 * owner overrides it with an outside address — this year's release as a
 * hosted PDF, say. Both roads lead somewhere either way, which is what
 * the disabled button that used to sit there could not promise.
 */
export const metadata: Metadata = pageMetadata({
  title: "Press release",
  description:
    "The undead to shuffle through central London this October as World Zombie Day returns. " +
    "A free, family-friendly zombie walk on Saturday 10 October 2026, raising funds for The Dead Good Club.",
  path: "/press-release",
})

/** The body of the release, in order, one Notion row each. */
const BODY = [
  "release.body1",
  "release.body2",
  "release.body3",
  "release.body4",
  "release.cause1",
  "release.cause2",
  "release.cause3",
]

/** The paragraphs after the quote, which are the practical ones. */
const AFTER_QUOTE = [
  "release.access",
  "release.apolitical",
  "release.party",
  "release.zeffy",
]

/** The at-a-glance table, in the order an editor reads it. */
const DETAILS = ["what", "when", "where", "cost", "cause", "register"]

/** Notes to editors, each its own sub-heading. */
const NOTES = ["press", "wzd", "dgc", "partners", "assets"]

export default async function PressReleasePage() {
  const copy = await getSiteCopy()
  const T = makeT(copy)
  const S = makeS(copy)
  const Cta = makeCta(copy)
  const has = makeHas(copy)
  const any = makeAny(copy)
  const P = makeP(copy)

  /**
   * The release as a NewsArticle, so a search engine reads it as a dated
   * announcement rather than another page of the site.
   *
   * Through jsonLd() rather than JSON.stringify, like every other graph
   * here: the headline and the standfirst are Notion cells, and a cell
   * containing `</script>` would otherwise close the block and turn the
   * rest of it into live markup.
   */
  const articleLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: S("release.title"),
    description: S("release.standfirst"),
    datePublished: "2026-09-08",
    inLanguage: "en-GB",
    mainEntityOfPage: `${SITE_URL}/press-release`,
    author: { "@type": "Organization", name: EVENT.name },
    publisher: { "@type": "Organization", name: EVENT.name, url: SITE_URL },
  }

  return (
    <PageShell
      title={<T k="release.title" />}
      titleText={S("release.title")}
      path="/press-release"
      standfirst={<T k="release.standfirst" />}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(articleLd) }}
      />

      {/* The dateline, which is the one line an editor looks for to know
          whether they may run it and how old it is. Small and set apart
          rather than folded into the first paragraph, where it would be
          read as prose. */}
      {has("release.dateline") ? (
        <p className="display mt-4 text-sm tracking-wide text-accent-text">
          <T k="release.dateline" />
        </p>
      ) : null}

      <P k="release.hook" className="prose-wzd mt-6 font-body text-lg" />

      <Section>
        <div className="space-y-5">
          {BODY.filter(has).map((k) => (
            <p key={k} className="prose-wzd font-body">
              <T k={k} />
            </p>
          ))}
        </div>

        {/* The pull quote. A <blockquote> with the attribution in a
            <figcaption> outside it, because the name is not part of what
            was said — quoting it back inside the blockquote is how a
            screen reader ends up reading the speaker as their own words. */}
        {any("release.quote", "release.quote.who") ? (
          <figure className="cut-panel mt-8 p-6">
            {has("release.quote") ? (
              <blockquote className="prose-wzd font-body text-lg">
                <T k="release.quote" />
              </blockquote>
            ) : null}
            {has("release.quote.who") ? (
              <figcaption className="mt-4 font-body text-sm text-muted">
                — <T k="release.quote.who" />
              </figcaption>
            ) : null}
          </figure>
        ) : null}

        <div className="mt-8 space-y-5">
          {AFTER_QUOTE.filter(has).map((k) => (
            <p key={k} className="prose-wzd font-body">
              <T k={k} />
            </p>
          ))}
        </div>

        <P k="release.registration" className="prose-wzd mt-5 font-body" />
        {has("release.registration.cta") ? (
          <Cta
            k="release.registration.cta"
            href="/register"
            className="btn btn-primary mt-6"
          />
        ) : null}
      </Section>

      {any(...DETAILS.map((k) => `release.details.${k}.value`)) ? (
        <Section title={<T k="release.details.title" />}>
          {/* A definition list, not a table: this is six terms and their
              values, and a <table> would promise a grid that a reader
              could navigate by row and column. Each pair is filtered on
              its own value, so a cleared row takes its own term with it
              rather than leaving a <dt> holding open a gap. */}
          <dl className="grid gap-x-8 gap-y-4 font-body sm:grid-cols-[10rem_1fr]">
            {DETAILS.filter((k) => has(`release.details.${k}.value`)).map((k) => (
              <div key={k} className="contents">
                <dt className="display text-sm">
                  <T k={`release.details.${k}.term`} />
                </dt>
                <dd className="prose-wzd">
                  {k === "register" ? (
                    <Cta
                      k="release.details.register.value"
                      href="/register"
                      className="underline decoration-accent-text underline-offset-4"
                    />
                  ) : (
                    <T k={`release.details.${k}.value`} />
                  )}
                </dd>
              </div>
            ))}
          </dl>
        </Section>
      ) : null}

      {any(...NOTES.map((k) => `release.notes.${k}.body`)) ? (
        <Section title={<T k="release.notes.title" />}>
          <div className="space-y-8">
            {NOTES.filter((k) => has(`release.notes.${k}.body`)).map((k) => (
              <article key={k}>
                <h3 className="display text-lg">
                  <T k={`release.notes.${k}.title`} />
                </h3>
                <p className="prose-wzd mt-2 font-body">
                  <T k={`release.notes.${k}.body`} />
                </p>
                {k === "press" && has("release.notes.press.cta") ? (
                  <Cta
                    k="release.notes.press.cta"
                    href="/register"
                    className="btn btn-secondary mt-4"
                  />
                ) : null}
                {k === "dgc" && has("release.notes.dgc.cta") ? (
                  <p className="mt-4 font-body">
                    <Cta
                      k="release.notes.dgc.cta"
                      href={EVENT.cause.url}
                      className="underline decoration-accent-text underline-offset-4"
                    />
                  </p>
                ) : null}
                {k === "assets" && has("release.contact.kit.cta") ? (
                  <Cta
                    k="release.contact.kit.cta"
                    href="/press"
                    className="btn btn-secondary mt-4"
                  />
                ) : null}
              </article>
            ))}
          </div>
        </Section>
      ) : null}

      {/* The end-of-release mark. It means something to an editor — the
          release stops here and everything below is reference — and
          nothing at all read out as three hashes, so it is hidden from a
          screen reader and the heading below carries the same boundary. */}
      <p aria-hidden="true" className="display mt-12 text-center text-2xl text-muted">
        ###
      </p>

      <Section title={<T k="release.contact.title" />}>
        <P k="release.contact.kit" className="prose-wzd font-body" />
        <P k="release.contact.media" className="prose-wzd mt-4 font-body" />
        <p className="mt-6 flex flex-wrap gap-3">
          {has("release.contact.kit.cta") ? (
            <Cta k="release.contact.kit.cta" href="/press" className="btn btn-secondary" />
          ) : null}
          {has("release.contact.media.cta") ? (
            <Cta
              k="release.contact.media.cta"
              href={`mailto:${EVENT.photoSubmissions}`}
              className="btn btn-primary"
            />
          ) : null}
        </p>
      </Section>

      <Section title={<T k="release.links.title" />}>
        {/* The social accounts come from EVENT.social, which is the same
            list the footer renders — one list, so a channel added there
            appears here and a dead one disappears from both. */}
        <ul className="flex flex-wrap gap-x-6 gap-y-2 font-body">
          <li>
            <ExternalLink
              href={SITE_URL}
              className="underline decoration-accent-text underline-offset-4"
            >
              {S("release.links.web") || "Web"}
            </ExternalLink>
          </li>
          {EVENT.social.map((channel) => (
            <li key={channel.name}>
              <ExternalLink
                href={channel.url}
                className="underline decoration-accent-text underline-offset-4"
              >
                {channel.name}
              </ExternalLink>
            </li>
          ))}
          {has("release.links.more") ? (
            <li>
              <ExternalLink
                href={EVENT.linksUrl}
                className="underline decoration-accent-text underline-offset-4"
              >
                {S("release.links.more")}
              </ExternalLink>
            </li>
          ) : null}
        </ul>

        {has("release.links.hashtags.value") ? (
          <p className="mt-6 font-body">
            <span className="display text-sm">
              <T k="release.links.hashtags.term" />
            </span>{" "}
            <span className="text-muted">
              <T k="release.links.hashtags.value" />
            </span>
          </p>
        ) : null}
      </Section>
    </PageShell>
  )
}
