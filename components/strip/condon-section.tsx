import { IMG } from "./shared"
import type { SectionProps } from "./shared"

export function CondonSection({ T }: SectionProps) {
  return (
    <>
      {/* ── 5 · Red: Correlating Data Points ── */}
      <section id="condon-report" className="aged-magazine isolate relative overflow-hidden border-b-[6px] border-black bg-[#FD2824] text-[#f4f3ef]">
        {/* first row — all red: cream header quote, author line, 3 columns */}
        <div className="px-6 pb-8 pt-9 sm:px-8">
          <div className="mb-6 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between sm:gap-8">
            <h3 className="max-w-3xl font-basker text-[clamp(1.4rem,3.4vw,2.3rem)] italic leading-[1.15] text-[#f2e8d0]">
              <T k="condon.quote">&lsquo;There is Pay Dirt in a UFO Study&ndash;But Quicksand, Too&rsquo;</T>
            </h3>
            <p className="shrink-0 font-basker text-lg italic text-[#f2e8d0]">
              <T k="condon.attrib">&ndash;Dr. J. Allen Hynek</T>
            </p>
          </div>

          <p className="mb-3 font-oswald text-xs font-bold uppercase tracking-wide text-[#1c0a08]">
            <T k="condon.byline">By David Daniels</T>
          </p>
          <div className="columns-1 gap-6 sm:columns-3">
            <p className="justified-text mb-3 font-basker text-[13px] leading-snug text-[#1c0a08] first-letter:float-left first-letter:pr-2 first-letter:font-basker first-letter:text-[46px] first-letter:font-bold first-letter:leading-[0.72]">
              <T k="condon.col1">When the long-awaited Condon Report on Unidentified Flying Objects
              was issued early this year, it was accompanied by a vitriolic
              rebuttal. For on that same day Dr. David R. Saunders published his
              own version of what went on behind the</T>
            </p>
            <p className="justified-text mb-3 font-basker text-[13px] leading-snug text-[#1c0a08]">
              <T k="condon.col2">scenes at the University of Colorado, where the project was
              headquartered under the Directorship of Dr. Edward U. Condon. The
              Saunders&rsquo; &lsquo;expos&eacute;&rsquo; is titled &lsquo;UFO?
              YES!&rsquo; Its subtitle was &lsquo;Where The Condon Committee Went
              Wrong / The Inside Story By An Ex-Member Of The Official Study
              Group.&rsquo;</T>
            </p>
            <p className="justified-text mb-3 font-basker text-[13px] leading-snug text-[#1c0a08]">
              <T k="condon.col3">Dr. Saunders is a professor of psychology at the University of
              Colorado and assistant director of its Department of Testing and
              Counseling. He holds a Ph.D. (Illinois) in psychology. Yet he was
              fired from the Project by Dr. Condon for &lsquo;incompetence&rsquo;
              about a year before the scientific UFO study was completed.</T>
            </p>
          </div>

        </div>

        {/* full-bleed photo band with left-hand cover-line overlay */}
        <div className="relative">
          <div
            className="bg-cover-center h-[420px] w-full grayscale contrast-125 sm:h-[560px]"
            style={{ backgroundImage: `url('${IMG}')` }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
          {/* cover line over the image; full width on mobile, left half on
              wider screens. Type scales fluidly so it never overflows. */}
          <div className="absolute inset-0 grid grid-cols-1 sm:grid-cols-2">
            <div className="flex flex-col justify-end gap-4 px-6 pb-16 sm:px-10 sm:pb-24">
              <p className="font-grotesk text-[clamp(0.95rem,2.4vw,1.25rem)] leading-snug text-[#F3E9D0]">
                <T k="condon.deck">Two opposing points of view&mdash;one a strong defense of the
                Colorado group&rsquo;s findings, the other a searing blast at its
                methods, techniques and findings</T>
              </p>
              <div>
                <span
                  className="inline-block px-3 py-1 font-oswald text-[clamp(1rem,3.4vw,1.5rem)] font-bold uppercase tracking-tight text-[#F3E9D0]"
                  style={{
                    backgroundImage:
                      "repeating-linear-gradient(90deg,#d75542 0 3px,#b23f30 3px 6px)",
                  }}
                >
                  <T k="condon.band">The Condon Report:</T>
                </span>
                <h2 className="whitespace-nowrap font-oswald text-[clamp(2.4rem,9.5vw,72px)] font-normal uppercase leading-[0.9] tracking-tight text-[#F3E9D0]">
                  <T k="condon.headline">A Whitewash?</T>
                </h2>
              </div>
            </div>
            <div aria-hidden="true" />
          </div>
        </div>

        {/* repeat of the article block (columns only), below the image */}
        <div className="relative px-6 pb-8 pt-9 sm:px-8">
          <div className="flex flex-col gap-8 lg:flex-row">
            <p className="justified-text font-basker text-[13px] leading-relaxed text-[#1c0a08] lg:flex-1 first-letter:float-left first-letter:pr-2 first-letter:font-basker first-letter:text-[48px] first-letter:font-bold first-letter:leading-[0.72]">
              <T k="condon.body2">When the long-awaited Condon Report on Unidentified Flying Objects
              was issued early this year, it was accompanied by a vitriolic
              rebuttal. For on that same day Dr. David R. Saunders published his
              own version of what went on behind the scenes at the University of
              Colorado, where the project was headquartered under the
              Directorship of Dr. Edward U. Condon. The Saunders&rsquo;
              &lsquo;expos&eacute;&rsquo; is titled &lsquo;UFO? YES!&rsquo; The
              book charges that the study was mismanaged from the outset, that
              key evidence was set aside, and that its conclusions were largely
              predetermined. It is a detailed, and at times bitter, account of a
              project that promised much and, in the eyes of its critics,
              delivered a good deal less than the public had been led to expect.</T>
            </p>
            {/* right column carries the diagonal memo card; the wider column
                lets the body text wrap cleanly around its slanted edge */}
            <div className="relative lg:flex-1">
              <aside className="memo-card relative z-30 break-inside-avoid bg-[#efe7d1] p-4 text-[#1c1710]">
                <h3 className="mb-2 text-center font-basker text-base font-bold text-[#d41c16]">
                  <T k="condon.memo.title">The Controversial Memo</T>
                </h3>
                <p className="justified-text indent-6 font-basker text-[13px] leading-snug">
                  <T k="condon.memo.body">&lsquo;The trick would be, I think, to describe the project so
                  that, to the public, it would appear a totally objective study
                  but, to the scientific community, would present the image of a
                  group of nonbelievers trying their best to be objective but
                  having an almost zero expectation of finding a saucer. One way
                  to do this would be to stress investigation, not of the
                  physical phenomena, but rather of the people who do the
                  observing &mdash; the psychology and sociology of persons and
                  groups who report seeing UFO&rsquo;s. If the emphasis were put
                  here, rather than on examination of the old question of the
                  physical reality of the saucer, I think the scientific
                  community would quickly get the message.&rsquo;</T>
                </p>
              </aside>
              <p className="justified-text font-basker text-[13px] leading-relaxed text-[#1c0a08]">
                <T k="condon.body3">Its subtitle was &lsquo;Where The Condon Committee Went Wrong /
                The Inside Story By An Ex-Member Of The Official Study
                Group.&rsquo; Dr. Saunders is a professor of psychology at the
                University of Colorado and assistant director of its Department
                of Testing and Counseling. He holds a Ph.D. (Illinois) in
                psychology. Yet he was fired from the Project by Dr. Condon for
                &lsquo;incompetence&rsquo; about a year before the scientific UFO
                study was completed.</T>
              </p>
            </div>
          </div>
        </div>

      </section>
    </>
  )
}
