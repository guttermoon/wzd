import { MOON_LANDSCAPE, MOON } from "./shared"
import type { SectionProps } from "./shared"

export function SignalsSection({ T }: SectionProps) {
  return (
    <>
      {/* ── 11 · Dark: The Road Runner / (Beep Beep) In Space ── */}
      <section id="signals-from-space" className="relative overflow-hidden border-b-[8px] border-[#d41c16] bg-[#140c0a] text-[#c7c1bc]">
        {/* Pink lunar landscape rising across the bottom */}
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 z-0 h-[46%] bg-cover bg-bottom bg-no-repeat"
          style={{ backgroundImage: `url('${MOON_LANDSCAPE}')` }}
        />
        <div className="pointer-events-none absolute inset-0 z-0 bg-gradient-to-b from-[#140c0a] via-transparent to-[#140c0a]/40" />

        <div className="relative z-10 flex flex-col gap-8 px-5 pb-8 pt-5 md:flex-row md:gap-10 md:px-8 md:pb-12 md:pt-6">
          {/* ── THE ROAD RUNNER — side rail runs top and bottom, headline cuts
              across it ── */}
          <div className="md:w-1/2 md:min-w-0">
            {/* Row 1 · top of the rail */}
            <div className="flex shrink-0 flex-col gap-5 font-grotesk text-[13px] font-semibold leading-none text-[#efe7d1] md:gap-8">
              <p>Observatories</p>
              <p>here have</p>
              <p>been</p>
              <p>recording</p>
            </div>

            {/* Headline — spans the full width, sitting in a clean gap in the
                rail column */}
            <h2 className="mb-4 mt-[46px] font-grand text-[clamp(30px,4.4vw,52px)] font-medium uppercase leading-[0.95] tracking-tight text-[#FDE1C2] md:mb-3 md:mt-[42px]">
              <T k="signals.title1">The Road Runner</T>
            </h2>

            {/* Row 3 · bottom of the rail + the body copy */}
            <div className="mt-4 flex gap-5">
              <div className="flex shrink-0 flex-col gap-5 font-grotesk text-[13px] font-semibold leading-none text-[#efe7d1] md:gap-8">
                <p>strange</p>
                <p>sounds</p>
                <p>from space</p>
                <p>at precise,</p>
                <p>regular</p>
                <p>intervals.</p>
                <p>Is someone</p>
                <p>somewhere</p>
                <p>trying</p>
                <p>to make</p>
                <p>contact?</p>
              </div>

              <div className="min-w-0 flex-1">
                <div className="justified-text columns-1 gap-5 font-basker text-[11px] leading-snug text-[#cbc5c0] md:columns-2">
                  <p className="mb-3">
                    <span className="float-left mr-2 mt-1 font-display text-[46px] leading-[0.7] text-[#efe7d1]">
                      S
                    </span>
                    <T k="signals.body1">trange chirping radio signals that followed an intelligent
                    pattern were first heard by radio astronomers at Cambridge
                    University in England. At once they became convinced they had
                    detected the presence of a highly advanced intelligence.</T>
                  </p>
                  <p className="mb-3">
                    <T k="signals.body2">Most radio noises from the galaxies, novae, stars and planets
                    are not very discrete. But these signals were sharp — a series
                    of rough modulations, coded pulses drawn to couple.</T>
                  </p>
                  <p>
                    <T k="signals.body3">For three or four minutes the pattern would begin again, then
                    stop for another one-minute period, then repeat. The
                    components of each pulse vary with a precision no natural body
                    has shown.</T>
                  </p>
                </div>

                {/* IN SPACE — mobile only; flows after the body so it pushes
                    down when the body spills, and clears the rail on the left */}
                <div className="ml-auto mt-8 max-w-[230px] md:hidden">
                  <h2 className="text-right font-grand text-[46px] font-medium uppercase leading-[0.9] tracking-tight text-[#FDE1C2]">
                    <T k="signals.title2a">In Space</T>
                  </h2>
                  <p className="mb-4 text-right font-oswald text-[11px] uppercase tracking-widest text-[#a08076]">
                    <T k="signals.byline">By Lloyd Mallan</T>
                  </p>
                  <div className="justified-text font-basker text-[11px] leading-snug text-[#cbc5c0]">
                    <p className="mb-3">
                      <T k="signals.body4a">These astronomers refuse to make statements publicly about
                      their theories, since they have no shred of proof; but they
                      are seriously considering the possibility that the
                      abnormally accurate range of radio-sources is a superior
                      intelligence.</T>
                    </p>
                    <p>
                      <T k="signals.body5a">One of them told the New York Times: &ldquo;This is the most
                      exciting discovery of the past fifty years. But don&rsquo;t
                      quote me.&rdquo; If the radio signals from outer space keep
                      better time than the atomic clock at the Observatory, an
                      advanced civilisation may be calling.</T>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── Right column · moon + IN SPACE stacked ── */}
          <div className="flex flex-col md:w-1/2 md:min-w-0">
            {/* Moon + (BEEP BEEP) — pinned top-right on mobile, top of the
                column on desktop */}
            <svg
              viewBox="0 0 300 224"
              className="absolute right-2 top-4 z-20 h-auto w-[52%] max-w-[300px] md:static md:z-auto md:mb-2 md:w-[86%] md:max-w-none md:self-center"
              aria-label="(Beep Beep)"
            >
              <defs>
                {/* concentric with the moon dome (centre 154,122 · r≈85) */}
                <path id="beepArc" d="M64,122 A 90 90 0 0 1 244,122" fill="none" />
              </defs>
              <image
                href={MOON}
                x="52"
                y="30"
                width="200"
                height="176"
                preserveAspectRatio="xMidYMax meet"
              />
              <text
                className="font-spicy"
                fill="#FDE1C2"
                stroke="#140c0a"
                strokeWidth="2"
                paintOrder="stroke"
                strokeLinejoin="round"
                style={{ fontSize: "42px" }}
              >
                <textPath href="#beepArc" startOffset="50%" textAnchor="middle">
                  <T k="signals.beep">(BEEP BEEP)</T>
                </textPath>
              </text>
            </svg>

            {/* IN SPACE — desktop only, sits directly under the moon */}
            <div className="hidden w-full md:block">
              <h2 className="text-right font-grand text-[46px] font-medium uppercase leading-[0.9] tracking-tight text-[#FDE1C2] md:text-[58px]">
                <T k="signals.title2b">In Space</T>
              </h2>
              <p className="mb-4 text-right font-oswald text-[11px] uppercase tracking-widest text-[#a08076]">
                <T k="signals.byline">By Lloyd Mallan</T>
              </p>

              <div className="justified-text columns-1 gap-5 font-basker text-[11px] leading-snug text-[#cbc5c0] md:columns-2">
              <p className="mb-3">
                <T k="signals.body4b">These astronomers refuse to make statements publicly about their
                theories, since they have no shred of proof; but they are
                seriously considering the possibility that the abnormally
                accurate range of radio-sources is a superior intelligence.</T>
              </p>
              <p>
                <T k="signals.body5b">One of them told the New York Times: &ldquo;This is the most
                exciting discovery of the past fifty years. But don&rsquo;t quote
                me.&rdquo; If the radio signals from outer space keep better time
                than the atomic clock at the Observatory, an advanced
                civilisation may be calling.</T>
              </p>
            </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
