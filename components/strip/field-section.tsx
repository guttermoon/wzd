import { FIELD } from "./shared"
import type { SectionProps } from "./shared"

export function FieldSection({ T }: SectionProps) {
  return (
    <>
      {/* ── Grassy field full-bleed band with a vintage article card ── */}
      <section
        className="relative border-t-4 border-[#19191b] bg-[#141414]"
        style={{
          backgroundImage: `url('${FIELD}')`,
          backgroundSize: "cover",
          backgroundPosition: "center top",
          backgroundRepeat: "no-repeat",
        }}
        id="seeing-is-disbelieving"
        aria-label="Grassy field with distant sea"
      >
        <div className="mx-auto max-w-3xl px-4 pb-60 pt-32 sm:px-8">
          <article className="text-[#1c1710]">
            {/* box 1 — headline banner; alternate words are outlined
                (stroked) letters with a transparent centre */}
            <div className="mb-5 border border-[#1c1710]/35 bg-[#F4D6BA] px-5 py-3">
              <h2 className="whitespace-nowrap text-center font-display text-[26px] uppercase leading-none tracking-tight text-[#1c1710] sm:text-[46px]">
                <T k="field.w1">When</T>{" "}
                <span className="text-transparent [-webkit-text-stroke:1.5px_#1c1710] sm:[-webkit-text-stroke:2px_#1c1710]">
                  <T k="field.w2">Seeing</T>
                </span>{" "}
                <T k="field.w3">Is</T>{" "}
                <span className="text-transparent [-webkit-text-stroke:1.5px_#1c1710] sm:[-webkit-text-stroke:2px_#1c1710]">
                  <T k="field.w4">Disbelieving</T>
                </span>
              </h2>
            </div>

            {/* box 2 — caption + article body */}
            <div className="border border-[#1c1710]/35 bg-[#F4D6BA] px-6 py-7 sm:px-9 sm:py-9">
            {/* photo caption — centred italic, full width */}
            <p className="mb-5 text-center font-basker text-[13px] font-bold italic leading-snug">
              <T k="field.caption">Above right, like the one on the cover, was taken by Leo McCabe of
              Boston at Georgetown Harbour, P.E.I. Canada, in the early morning
              of June, 1968. There was solid overcast when the object appeared.
              Its speed ranged from 300 mph to hovering. He used a Brownie
              camera.</T>
            </p>

            {/* two-column article body */}
            <div className="columns-1 gap-6 sm:columns-2">
              <p className="dense-copy justified-text mb-3 font-basker text-[13px] leading-snug">
                <T k="field.body1">vacy of any citizen. If an individual has reported a sighting to
                the local news media, but does not want an official
                investigation as to its cause or possible causes, then no
                investigation can be conducted. If photographs are taken of
                lights or other objects in the sky and printed in the newspapers
                or magazines and the photographer refuses to submit the original
                negative to the Air Force for Scientific photo-analysis, no
                further action can be taken by the Air Force.</T>
              </p>
              <p className="dense-copy justified-text mb-3 font-basker text-[13px] leading-snug">
                <T k="field.body2">Also, the Air Force has no punitive power against perpetrators of
                hoaxes, even though the Air Force may have spent thousands of
                taxpayer dollars in uncovering a hoax. However, it should be
                pointed out that hoaxes are very rare. Most reports are made by
                individuals who have seen something that they did not understand
                and are reporting it out of curiosity because they feel that
                &ldquo;someone&rdquo; should look into the unusual situation.</T>
              </p>
              <p className="dense-copy justified-text mb-3 font-basker text-[13px] leading-snug">
                <T k="field.body3">With the foregoing as a background, how then does the analyst
                evaluate these reports? Draw names from a hat? Throw darts at a
                board? That might satisfy the statistician, but it would hardly
                impress the scientists who screen the files for data or the
                newsmen who look at specific cases. The main point to be made
                here is that the evaluation of all cases must withstand scrutiny
                by scientists for validity and by newsmen for logic.</T>
              </p>
              <p className="dense-copy justified-text mb-3 font-basker text-[13px] leading-snug">
                <T k="field.body4">The analyst, then, must have facts to support his evaluation. He
                cannot conduct the investigation himself, but he can redirect the
                investigator who submitted the original report to look for
                certain bits of data. He can send a form with questions about a
                particular sighting to the lady who wrote a letter to the Air
                Force describing something she had witnessed.</T>
              </p>
              <p className="dense-copy justified-text mb-3 font-basker text-[13px] leading-snug">
                <T k="field.body5">Before the analyst can make an evaluation of a report, three
                conditions must be met. First, he must have a minimum of
                background information including time, location of sighting,
                weather conditions, number of witnesses, and how to contact the
                witness for additional information. Second, he must have a
                general description of the object, light or phenomenon observed.</T>
              </p>
            </div>

            {/* footer — page number and continuation */}
            <div className="mt-5 flex items-end justify-between font-basker text-[10px]">
              <span className="font-bold"><T k="field.pageno">20</T></span>
              <span className="italic"><T k="field.continued">continued on page 51</T></span>
            </div>
            </div>
          </article>
        </div>
      </section>
    </>
  )
}
