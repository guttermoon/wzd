import type { Metadata } from "next"
import Link from "next/link"
import { getSiteCopy } from "@/lib/site-copy"
import { makeT } from "@/components/notion-text"
import { PageShell, Section } from "@/components/page-shell"
import { Photo } from "@/components/photo"
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

  return (
    <PageShell title={<T k="register.title" />} standfirst={<T k="register.standfirst" />}>
      {/* Registration status is the thing people came for — it goes first. */}
      <div className="cut-panel mt-10 p-6">
        <h2 className="display text-2xl">
          <T k="register.status.title" />
        </h2>
        <p className="prose-wzd mt-3 font-body">
          <T k="register.status.body" />
        </p>
        <p className="display mt-5 inline-block border-2 border-accent px-4 py-3 text-accent">
          <T k="register.status.cta" />
        </p>
      </div>

      <Photo
        photo={photo("leake-street-crowd")}
        sizes="(min-width: 72rem) 68rem, 100vw"
        className="mt-10"
        imageClassName="border-2 border-rule"
      />

      <div className="mt-12 grid gap-10 lg:grid-cols-2 lg:gap-14">
        <Section title={<T k="register.why.title" />} className="mt-0">
          <p className="prose-wzd font-body"><T k="register.why.body" /></p>
        </Section>
        <Section title={<T k="register.cost.title" />} className="mt-0">
          <p className="prose-wzd font-body"><T k="register.cost.body" /></p>
        </Section>
        <Section title={<T k="register.access.title" />} className="mt-0">
          <p className="prose-wzd font-body"><T k="register.access.body" /></p>
        </Section>
        <Section title={<T k="register.charity.title" />} className="mt-0">
          <p className="prose-wzd font-body"><T k="register.charity.body" /></p>
          <p className="mt-4">
            <a className="link font-body" href={EVENT.charity.donateUrl} rel="noopener noreferrer">
              {EVENT.charity.donateLabel}
            </a>
          </p>
        </Section>
      </div>

      <Section title={<T k="register.involved.title" />}>
        <p className="prose-wzd font-body"><T k="register.involved.body" /></p>
        <a href={`mailto:${EVENT.email}`} className="btn btn-primary mt-6">
          <T k="register.involved.cta" />
        </a>
      </Section>

      <Section>
        <p className="font-body">
          <Link href="/rules" className="link">Read the rules of conduct</Link>{" "}
          before you come.
        </p>
      </Section>
    </PageShell>
  )
}
