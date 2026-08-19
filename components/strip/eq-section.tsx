import { DOYLE } from "./shared"
import type { SectionProps } from "./shared"

export function EqSection({ T }: SectionProps) {
  return (
    <>
      {/* ── 12 · White: The Birth of… + coupon ── */}
      <section id="environmental-quality" className="bg-white p-12 text-black">
        <div className="mb-6 flex flex-col items-center gap-6 text-center">
          <h2 className="font-archblack text-[clamp(38px,7.4vw,84px)] font-normal leading-[0.94] tracking-tight">
            <T k="eq.title">The Birth of
            <br />
            Environmental Quality
            <br />
            Magazine</T>
          </h2>
          {/* Portrait — Conan Doyle with a thought-cloud */}
          <div
            className="aspect-[2286/3400] w-[52%] max-w-[280px] bg-contain bg-center bg-no-repeat"
            style={{ backgroundImage: `url('${DOYLE}')` }}
            role="img"
            aria-label="Portrait of a seated figure with a thought-cloud"
          />
        </div>

        <h3 className="mb-6 text-center font-oswald text-xl font-bold italic">
          <T k="eq.cta">Send for your Complimentary Copy Now!</T>
        </h3>

        <p className="justified-text mx-auto mb-6 max-w-[600px] font-basker text-[13px] leading-relaxed">
          <T k="eq.body">As of Nov. 1, 1970, a new magazine has been established in the ecology
          field. It is directed toward the consumer. Its goal is to make the
          layman aware of the critical state of our environment and to tell him
          what he as an individual can do about it. It is titled Environmental
          Quality Magazine. It is published quarterly.</T>
        </p>


      </section>
    </>
  )
}
