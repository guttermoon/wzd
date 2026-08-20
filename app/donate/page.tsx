import type { Metadata } from "next"
import Link from "next/link"
import { getSiteCopy } from "@/lib/site-copy"
import { makeT, makeS } from "@/components/notion-text"
import { PageShell, Section } from "@/components/page-shell"
import { Photo } from "@/components/photo"
import { ZeffyEmbed } from "@/components/zeffy-embed"
import { photo } from "@/lib/photos"
import { EVENT } from "@/lib/event"

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
          ratio="32/9"
          sizes="100vw"
        />
      }
    >
      {/* The same form as /register: it takes a donation with or without a
          registration, so someone who cannot come on the day can still
          give. */}
      <Section title={<T k="donate.how.title" />} className="mt-10">
        <p className="prose-wzd font-body"><T k="register.cause.body" /></p>
        <p className="prose-wzd mt-4 font-body"><T k="register.cause.donation" /></p>
        <ul className="prose-wzd mt-4 list-disc space-y-2 pl-5 font-body">
          {WORK.map((n) => (
            <li key={n}><T k={`register.cause.work.${n}`} /></li>
          ))}
        </ul>
        <p className="prose-wzd mt-4 font-body"><T k="register.cause.thanks" /></p>

        <div className="mt-8">
          <ZeffyEmbed />
        </div>

        <p className="mt-6 font-body">
          <a className="link" href={EVENT.cause.url} rel="noopener noreferrer">
            {EVENT.cause.name}
          </a>{" "}
          &middot;{" "}
          <a className="link" href={EVENT.cause.donateUrl} rel="noopener noreferrer">
            {EVENT.cause.donateLabel}
          </a>
        </p>
      </Section>

      <Section title={<T k="donate.other.title" />}>
        <p className="prose-wzd font-body"><T k="donate.other.body" /></p>
        <Link href="/become-a-sponsor" className="btn btn-primary mt-6">
          <T k="sponsors.title" />
        </Link>
      </Section>
    </PageShell>
  )
}
