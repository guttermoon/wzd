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

const WORK = ["1", "2", "3", "4", "5"]
const VIP = ["1", "2", "3", "4"]

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
  const Cta = makeCta(copy)
  const has = makeHas(copy)
  const any = makeAny(copy)
  const P = makeP(copy)

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
      {/* The form first, at the owner's instruction. Someone who opens this
          page has come to register; the two columns below are the detail
          they can read once they have their place. It keeps its heading,
          because a form arriving straight under the standfirst with nothing
          naming it reads as an advertisement rather than the thing they
          came for. */}
      <Section title={<T k="register.status.title" />}>
        <ZeffyEmbed
          trouble={S("site.form.trouble")}
          troubleCta={S("site.form.trouble.cta")}
        />
      </Section>

      <div className="mt-12 grid gap-10 lg:grid-cols-2 lg:gap-14">
        <Section title={<T k="register.why.title" />} className="mt-0">
          <P k="register.why.body" className="prose-wzd font-body" />
        </Section>
        <Section title={<T k="register.cost.title" />} className="mt-0">
          <P k="register.cost.body" className="prose-wzd font-body" />
        </Section>
      </div>

      {/* Two panels side by side, the same treatment the sponsorship
          options get: a pair of cut panels of equal weight rather than two
          sections stacked, so who the walk is for and what it raises money
          for are read as a pair. The headings stay h2, because there is no
          umbrella heading over the pair for them to sit under: on the
          sponsors page the two options are h3 beneath "Sponsorship
          options", and here each panel is a topic of the page in its own
          right.

          They are <article>s because each stands on its own, and the grid
          stretches them to the same height however uneven the copy is. */}
      <Section>
        <div className="grid gap-8 lg:grid-cols-2">
          {any("register.access.title", "register.access.body") ? (
          <article className="cut-panel p-6">
            <h2 className="display text-xl"><T k="register.access.title" /></h2>
            <div className="prose-wzd mt-4 font-body">
              <P k="register.access.body" />
            </div>
          </article>
          ) : null}

          <article className="cut-panel p-6">
            <h2 className="display text-xl"><T k="register.cause.title" /></h2>
            <div className="prose-wzd mt-4 font-body">
              <P k="register.cause.body" />
              <P k="register.cause.donation" />
            </div>
            {/* Only the ones that still say something. An emptied row
                should take its bullet with it, not leave a stray marker. */}
            {WORK.some((n) => has(`register.cause.work.${n}`)) ? (
              <ul className="mt-4 list-disc space-y-2 pl-5 font-body">
                {WORK.filter((n) => has(`register.cause.work.${n}`)).map((n) => (
                  <li key={n}><T k={`register.cause.work.${n}`} /></li>
                ))}
              </ul>
            ) : null}
            <P k="register.cause.thanks" className="prose-wzd mt-4 font-body" />
          </article>
        </div>
      </Section>

      {/* The after-party is a separate venue with its own ticket, so it
          sits under the cause it raises money for rather than up with the
          walk. The address and the venue link are facts and live in
          lib/event.ts; the words around them are editable in Notion. */}
      <Section title={<T k="party.title" />}>
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-10">
          {/* The poster leads on a phone and sits beside the copy on a wide
              screen. Only the visual order changes: the artwork is
              decorative and carries an empty alt, so nothing is read out of
              turn by moving it. */}
          <div className="order-2 lg:order-1 lg:col-span-7">
            <P k="party.body1" className="prose-wzd font-body" />
            <P k="party.body2" className="prose-wzd mt-4 font-body" />
            <P k="party.doors" className="prose-wzd mt-4 font-body" />

            {any("party.vip.title", ...VIP.map((n) => `party.vip.${n}`)) ? (
              <>
                {has("party.vip.title") ? (
                  <h3 className="display mt-8 text-lg">
                    <T k="party.vip.title" />
                  </h3>
                ) : null}
                {VIP.some((n) => has(`party.vip.${n}`)) ? (
                  <ul className="prose-wzd mt-4 list-disc space-y-2 pl-5 font-body">
                    {VIP.filter((n) => has(`party.vip.${n}`)).map((n) => (
                      <li key={n}><T k={`party.vip.${n}`} /></li>
                    ))}
                  </ul>
                ) : null}
              </>
            ) : null}
            <P k="party.vip.limit" className="prose-wzd mt-4 font-body" />
            <P k="party.proceeds" className="prose-wzd mt-4 font-body" />

            <p className="mt-6 font-body">
              <ExternalLink className="link" href={EVENT.afterParty.url}>
                {EVENT.afterParty.venue}
              </ExternalLink>{" "}
              &middot; {EVENT.afterParty.address}
            </p>
            <P k="party.thanks" className="prose-wzd mt-4 font-body text-muted" />
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
            narrowStill="/After_Party_WZD-flyer.webp"
            alt=""
            width={1190}
            height={1683}
            sizes="(min-width: 64rem) 24rem, 100vw"
            className="order-1 lg:order-2 lg:col-span-5 lg:sticky lg:top-24 lg:self-start"
          />
        </div>
      </Section>

      <Section>
        <Cta k="register.rules.cta" href="/survival" className="btn btn-secondary" />
      </Section>
    </PageShell>
  )
}
