import { makeT, type SiteCopy } from "@/components/notion-text"
import { EmailSignup } from "@/components/email-signup"
import { TornEdge } from "@/components/torn-edge"

/**
 * The mailing-list band, sitting above the footer on every page.
 *
 * Its own block rather than part of the footer: the footer is small print
 * and navigation, and this is something we are asking people to do. It
 * takes the panel tint so it reads as a band of its own, with the torn
 * edge marking the change of ground the way it does everywhere else.
 */
export function SignupBand({ copy }: { copy: SiteCopy }) {
  const T = makeT(copy)

  return (
    <>
      <TornEdge />
      {/* An <aside>, not a <section>: this sits between <main> and the
          footer, so without a landmark of its own everything in it is
          outside every landmark, which axe fails on every page. The name
          is what makes the landmark useful rather than just present. */}
      <aside aria-label="Mailing list" className="w-full bg-surface py-14">
        <div className="mx-auto w-full max-w-page px-4 text-center sm:px-6">
          <h2 className="display text-[clamp(1.5rem,3.5vw,2.25rem)]">
            <T k="footer.signup.title" />
          </h2>
          <p className="mx-auto mt-3 max-w-[52ch] font-body text-muted">
            <T k="footer.signup.body" />
          </p>
          <div className="mt-8">
            <EmailSignup />
          </div>
        </div>
      </aside>
    </>
  )
}
