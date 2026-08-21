import type { Metadata } from "next"
import { getSiteCopy } from "@/lib/site-copy"
import { makeT, makeS, makeHas, makeAny, makeP } from "@/components/notion-text"
import { makeCta } from "@/components/cta"
import { PageShell, Section } from "@/components/page-shell"
import { Photo } from "@/components/photo"
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

            The form is below the grid rather than in it: squeezed into
            seven of twelve columns it would be a worse form, and it is
            what the page is for. */}
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-7">
            <P k="register.cause.body" className="prose-wzd font-body" />
            <P k="register.cause.donation" className="prose-wzd mt-4 font-body" />
            <ul className="prose-wzd mt-4 list-disc space-y-2 pl-5 font-body">
              {WORK.filter((n) => has(`register.cause.work.${n}`)).map((n) => (
                <li key={n}><T k={`register.cause.work.${n}`} /></li>
              ))}
            </ul>
            <P k="register.cause.thanks" className="prose-wzd mt-4 font-body" />
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

        <div className="mt-8">
          <ZeffyEmbed form="donation" />
        </div>

        <p className="mt-6 font-body">
          <ExternalLink className="link" href={EVENT.cause.url}>
            {EVENT.cause.name}
          </ExternalLink>{" "}
          &middot;{" "}
          <ExternalLink className="link" href={EVENT.cause.donateUrl}>
            {EVENT.cause.donateLabel}
          </ExternalLink>
        </p>
      </Section>

      <Section title={<T k="donate.other.title" />}>
        <P k="donate.other.body" className="prose-wzd font-body" />
        <Cta k="donate.other.cta" href="/become-a-sponsor" className="btn btn-primary mt-6" />
      </Section>
    </PageShell>
  )
}
