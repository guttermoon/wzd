import type { Metadata } from "next"
import Link from "next/link"
import { getSiteCopy } from "@/lib/site-copy"
import { makeT } from "@/components/notion-text"
import { PageShell, Section } from "@/components/page-shell"
import { EVENT } from "@/lib/event"

export const revalidate = 60
export const metadata: Metadata = {
  title: "Privacy policy",
  description: "How World Zombie Day: London handles your information.",
  alternates: { canonical: "/privacy" },
}

export default async function PrivacyPage() {
  const copy = await getSiteCopy()
  const T = makeT(copy)

  return (
    <PageShell title={<T k="privacy.title" />} standfirst={<T k="privacy.standfirst" />}>
      <div className="cut-panel mt-10 p-6">
        <h2 className="display text-xl"><T k="privacy.placeholder.title" /></h2>
        <p className="prose-wzd mt-3 font-body"><T k="privacy.placeholder.body" /></p>
      </div>

      <Section title={<T k="privacy.interim.title" />}>
        <p className="prose-wzd font-body"><T k="privacy.interim.body" /></p>
        <p className="mt-4 font-body">
          <a className="link" href={`mailto:${EVENT.email}`}>{EVENT.email}</a>
        </p>
      </Section>

      <Section title={<T k="privacy.photos.title" />}>
        <p className="prose-wzd font-body"><T k="privacy.photos.body" /></p>
        <p className="mt-4 font-body">
          <Link href="/photo-policy" className="link">Read the photo policy</Link>
        </p>
      </Section>
    </PageShell>
  )
}
