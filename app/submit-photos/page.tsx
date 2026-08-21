import type { Metadata } from "next"
import { getSiteCopy } from "@/lib/site-copy"
import { makeT, makeS, makeP } from "@/components/notion-text"
import { makeCta } from "@/components/cta"
import { PageShell, Section } from "@/components/page-shell"
import { Photo } from "@/components/photo"
import { photo } from "@/lib/photos"
import { PhotoSubmission } from "@/components/photo-submission"
import { EVENT } from "@/lib/event"

export const revalidate = 60
export const metadata: Metadata = {
  title: "Submit your photos",
  description:
    "Send us the photographs you took at World Zombie Day: London. Every image is published with its photographer's credit.",
  alternates: { canonical: "/submit-photos" },
}

export default async function SubmitPhotosPage() {
  const copy = await getSiteCopy()
  const T = makeT(copy)
  const S = makeS(copy)
  const P = makeP(copy)
  const Cta = makeCta(copy)

  return (
    <PageShell
      title={<T k="submit.title" />}
      titleText={S("submit.title")}
      standfirst={<T k="submit.standfirst" />}
      banner={
        <Photo
          photo={photo("bridge-horde")}
          priority
          bleed="full"
          ratio="80/27"
          sizes="100vw"
        />
      }
    >
      <Section className="mt-10">
        <P k="submit.intro" className="prose-wzd font-body" />
        <Cta
          k="submit.policy.cta"
          href="/photo-policy"
          className="btn btn-secondary mt-6"
        />

        {/* The form is the site's own and posts to our own origin, so
            nothing third party runs in the page and there is nothing to
            gate behind the cookie dialog. */}
        <PhotoSubmission
          to={EVENT.photoSubmissions}
          copy={{
            creditLabel: S("submit.credit.label"),
            creditHelp: S("submit.credit.help"),
            linksLabel: S("submit.links.label"),
            linksHelp: S("submit.links.help"),
            notesLabel: S("submit.notes.label"),
            notesHelp: S("submit.notes.help"),
            required: S("submit.required"),
            send: S("submit.send"),
            sending: S("submit.sending"),
            done: S("submit.done"),
            missing: S("submit.missing"),
            failed: S("submit.failed"),
            failedCta: S("submit.failed.cta"),
          }}
        />
      </Section>
    </PageShell>
  )
}
