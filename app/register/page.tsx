import type { Metadata } from "next"
import Link from "next/link"
import { getSiteCopy } from "@/lib/site-copy"
import { makeT, makeS } from "@/components/notion-text"
import { PageShell, Section } from "@/components/page-shell"
import { Photo, Graphic } from "@/components/photo"
import { ZeffyEmbed } from "@/components/zeffy-embed"
import { photo } from "@/lib/photos"
import { EVENT } from "@/lib/event"

export const revalidate = 60
export const metadata: Metadata = {
  title: "Register",
  description:
    "Registration for World Zombie Day: London 2026. Free to attend, with an optional pay-what-you-can donation.",
  alternates: { canonical: "/register" },
}

export default async function RegisterPage() {
  const copy = await getSiteCopy()
  const T = makeT(copy)
  const S = makeS(copy)

  return (
    <PageShell
      title={<T k="register.title" />}
      titleText={S("register.title")}
      standfirst={<T k="register.standfirst" />}
      banner={
        <Photo
          photo={photo("leake-street-crowd")}
          priority
          bleed="full"
          ratio="80/27"
          sizes="100vw"
        />
      }
    >
      <div className="mt-10 grid gap-10 lg:grid-cols-2 lg:gap-14">
        <Section title={<T k="register.why.title" />} className="mt-0">
          <p className="prose-wzd font-body"><T k="register.why.body" /></p>
        </Section>
        <Section title={<T k="register.cost.title" />} className="mt-0">
          <p className="prose-wzd font-body"><T k="register.cost.body" /></p>
        </Section>
      </div>

      <Section title={<T k="register.access.title" />}>
        <p className="prose-wzd font-body"><T k="register.access.body" /></p>
      </Section>

      <Section title={<T k="register.cause.title" />}>
        <p className="prose-wzd font-body"><T k="register.cause.body" /></p>
        <p className="prose-wzd mt-4 font-body"><T k="register.cause.donation" /></p>
        <ul className="prose-wzd mt-4 list-disc space-y-2 pl-5 font-body">
          {["1", "2", "3", "4", "5"].map((n) => (
            <li key={n}><T k={`register.cause.work.${n}`} /></li>
          ))}
        </ul>
        <p className="prose-wzd mt-4 font-body"><T k="register.cause.thanks" /></p>
        <p className="mt-4 font-body">
          <a className="link" href={EVENT.cause.url} rel="noopener noreferrer">
            {EVENT.cause.name}
          </a>{" "}
          &middot;{" "}
          <a className="link" href={EVENT.cause.donateUrl} rel="noopener noreferrer">
            {EVENT.cause.donateLabel}
          </a>
        </p>
      </Section>

      {/* The after-party is a separate venue with its own ticket, so it
          sits under the cause it raises money for rather than up with the
          walk. The address and the venue link are facts and live in
          lib/event.ts; the words around them are editable in Notion. */}
      <Section title={<T k="party.title" />}>
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-7">
            <p className="prose-wzd font-body"><T k="party.body1" /></p>
            <p className="prose-wzd mt-4 font-body"><T k="party.body2" /></p>
            <p className="prose-wzd mt-4 font-body"><T k="party.doors" /></p>

            <h3 className="display mt-8 text-lg">
              <T k="party.vip.title" />
            </h3>
            <ul className="prose-wzd mt-4 list-disc space-y-2 pl-5 font-body">
              {["1", "2", "3", "4"].map((n) => (
                <li key={n}><T k={`party.vip.${n}`} /></li>
              ))}
            </ul>
            <p className="prose-wzd mt-4 font-body"><T k="party.vip.limit" /></p>
            <p className="prose-wzd mt-4 font-body"><T k="party.proceeds" /></p>

            <p className="mt-6 font-body">
              <a
                className="link"
                href={EVENT.afterParty.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                {EVENT.afterParty.venue}
                <span className="sr-only"> (opens in a new tab)</span>
              </a>{" "}
              &middot; {EVENT.afterParty.address}
            </p>
            <p className="prose-wzd mt-4 font-body text-muted">
              <T k="party.thanks" />
            </p>
          </div>

          {/* The after-party artwork, plain: the mat and the cut so it sits
              in the page like everything else, and none of the tape
              treatment. It is a graphic rather than a photograph, so it
              carries no credit and its alt is empty: everything it says is
              said in the copy beside it, and announcing it twice helps
              nobody. The still is served instead when the visitor has
              asked for less motion, which is the only way to honour that
              for a GIF. See Graphic in components/photo.tsx. */}
          <Graphic
            src="/After_Party_WZD.gif"
            still="/After_Party_WZD-still.webp"
            alt=""
            width={1190}
            height={1683}
            sizes="(min-width: 64rem) 24rem, 100vw"
            className="lg:col-span-5 lg:sticky lg:top-24 lg:self-start"
          />
        </div>
      </Section>

      {/* The form sits at the end, after everything someone needs to know
          before they fill it in. */}
      <Section title={<T k="register.status.title" />}>
        <ZeffyEmbed />
      </Section>

      <Section>
        <Link href="/survival" className="btn btn-secondary">
          Read the rules of conduct
        </Link>
      </Section>
    </PageShell>
  )
}
