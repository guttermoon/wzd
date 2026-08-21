import type { Metadata } from "next"
import { getSiteCopy } from "@/lib/site-copy"
import { makeT, makeS, makeHas, makeAny, makeP } from "@/components/notion-text"
import { makeCta } from "@/components/cta"
import { PageShell, Section } from "@/components/page-shell"
import { Photo, Graphic } from "@/components/photo"
import { ZeffyEmbed } from "@/components/zeffy-embed"
import { photo } from "@/lib/photos"
import { EVENT } from "@/lib/event"
import { ExternalLink } from "@/components/external-link"

export const revalidate = 60
export const metadata: Metadata = {
  title: "Donate",
  description:
    "Give to The Dead Good Club, the Community Interest Company World Zombie Day: London raises money for. The walk itself is free to join.",
  alternates: { canonical: "/donate" },
}

const WORK = ["1", "2", "3", "4", "5"]

export default async function DonatePage() {
  const copy = await getSiteCopy()
  const T = makeT(copy)
  const S = makeS(copy)
  const Cta = makeCta(copy)
  const has = makeHas(copy)
  const any = makeAny(copy)
  const P = makeP(copy)

  return (
    <PageShell
      title={<T k="donate.title" />}
      titleText={S("donate.title")}
      standfirst={<T k="donate.standfirst" />}
      banner={
        <Photo
          photo={photo("groaning-group")}
          priority
          bleed="full"
          ratio="80/27"
          sizes="100vw"
        />
      }
    >
      {/* The same form as /register: it takes a donation with or without a
          registration, so someone who cannot come on the day can still
          give. */}
      <Section title={<T k="donate.how.title" />} className="mt-10">
        {/* A panel cut into the right edge beside the list, the way the dog
            sits on /faq, sticky so it stays with the copy as it scrolls.
            The wolf puppet, because the list it sits beside is about
            celebrating horror and outsider creativity and that is a
            photograph of exactly that.

            The form sits in the text column, under the copy that argues
            for it, and takes that column's width. It used to run the full
            width below the grid, which left a hole the height of the
            photograph between the list and the form — the panel is
            sticky and taller than the copy beside it, so the space under
            the text was simply empty. */}
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-7">
            <P k="donate.cause.body" className="prose-wzd font-body" />
            <P k="donate.cause.donation" className="prose-wzd mt-4 font-body" />
            <ul className="prose-wzd mt-4 list-disc space-y-2 pl-5 font-body">
              {WORK.filter((n) => has(`donate.cause.work.${n}`)).map((n) => (
                <li key={n}><T k={`donate.cause.work.${n}`} /></li>
              ))}
            </ul>
            <P k="donate.cause.thanks" className="prose-wzd mt-4 font-body" />

            <div className="mt-8">
              <ZeffyEmbed
                form="donation"
                trouble={S("site.form.trouble")}
                troubleCta={S("site.form.trouble.cta")}
              />
            </div>
          </div>

          {/* 5/6 with the crop held to the top takes exactly the bottom
              fifth off and nothing off the head. The photograph is 2:3, so
              at this panel's width it stands 1.5 boxes tall; a box 1.2 of
              those high shows the top 80% of it and no more. The old 3/4
              was both taller and centred, which cropped a little off the
              top and left a stretch of skirt at the bottom. */}
          <Photo
            photo={photo("wolf-puppet")}
            bleed="right"
            ratio="5/6"
            focus="50% 0%"
            sizes="(min-width: 64rem) 22rem, 100vw"
            className="lg:col-span-5 lg:sticky lg:top-24 lg:self-start"
          />
        </div>

      </Section>

      {/* Who the money actually goes to, in their words rather than ours.
          This replaced a bare pair of links, which asked someone who had
          just read about the cause to go and find out what it was
          somewhere else.

          Their lock-up was drawn twice, once for each ground, so the
          right one is shown and the other is not rendered at all rather
          than hidden and downloaded anyway — `dark:` on the wrapper,
          which is how the theme is switched everywhere else. It carries
          no alt: the heading beside it already says the name, and a
          second announcement of it is noise. */}
      <Section title={<T k="donate.about.title" />}>
        <div className="grid items-start gap-8 lg:grid-cols-12 lg:gap-10">
          {/* The lock-up links to the club, and takes the accent colour
              on hover and on keyboard focus, by swapping to the hover
              artwork they supplied — see .dgc-mark in globals.css. It carries the name rather than an empty alt:
              it is a link now, and a link with nothing to announce is a
              link nobody can follow. Only one of the two is ever
              displayed, so the name is never said twice. */}
          <div className="lg:col-span-4">
            <ExternalLink
              href={EVENT.cause.url}
              className="mx-auto block w-full max-w-[14rem] lg:mx-0"
            >
              <span className="dgc-mark dark:hidden">
                <Graphic
                  src="/brand/dgc-light-bg.webp"
                  alt={EVENT.cause.name}
                  width={1083}
                  height={1536}
                  frame={false}
                  sizes="(min-width: 64rem) 14rem, 55vw"
                />
                <span className="dgc-mark-tint" aria-hidden="true" />
              </span>
              <span className="dgc-mark hidden dark:block">
                <Graphic
                  src="/brand/dgc-dark-bg.webp"
                  alt={EVENT.cause.name}
                  width={1083}
                  height={1536}
                  frame={false}
                  sizes="(min-width: 64rem) 14rem, 55vw"
                />
                <span className="dgc-mark-tint" aria-hidden="true" />
              </span>
            </ExternalLink>
          </div>

          <div className="lg:col-span-8">
            <P k="donate.about.body1" className="prose-wzd font-body" />
            <P k="donate.about.body2" className="prose-wzd mt-4 font-body" />
            <Cta
              k="donate.about.cta"
              href={EVENT.cause.manifestoUrl}
              className="btn btn-secondary mt-6"
            />
          </div>
        </div>
      </Section>

      <Section title={<T k="donate.other.title" />}>
        <P k="donate.other.body" className="prose-wzd font-body" />
        <Cta k="donate.other.cta" href="/become-a-sponsor" className="btn btn-primary mt-6" />
      </Section>
    </PageShell>
  )
}
