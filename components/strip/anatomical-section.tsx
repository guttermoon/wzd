import { IMG } from "./shared"
import type { SectionProps } from "./shared"

export function AnatomicalSection({ T }: SectionProps) {
  return (
    <>
      {/* ── 8 · Dark: Anatomical Anomalies ── */}
      <section id="anatomical-anomalies" className="relative h-[450px] bg-[#1a1a1a]">
        <div
          className="bg-cover-center absolute inset-0 brightness-75 contrast-150 grayscale sepia-[0.5]"
          style={{ backgroundImage: `url('${IMG}')` }}
        />
        <div className="absolute top-0 z-10 h-32 w-full bg-gradient-to-b from-black/80 to-transparent" />

        {/* Green readout boxes — Analysis stacked on top of Tissue, centred,
            overlapping up into the section above */}
        <div className="absolute left-1/2 top-0 z-30 flex w-[88%] max-w-[320px] -translate-x-1/2 -translate-y-16 flex-col items-center gap-4">
          <div className="w-full border border-black bg-[#a2d424]/90 p-3 shadow-xl">
            <p className="justified-text font-basker text-[13px] font-bold leading-tight text-black">
              <T k="anatomical.readout1">Analysis confirms isotope presence matching Sector 7 fallout
              patterns. Contamination vector: Airborne.</T>
            </p>
          </div>
          <div className="w-full border border-[#a2d424]/50 bg-black/60 p-3 backdrop-blur-sm">
            <p className="justified-text font-basker text-[13px] leading-tight text-[#a2d424]">
              <T k="anatomical.readout2">Tissue samples reveal rapid cellular degradation inconsistent
              with known pathogens. Connective tissues crystallized.</T>
            </p>
          </div>
        </div>

        <div className="relative z-20 flex h-full flex-col justify-end p-8">
          <h2 className="mt-auto pb-8 text-center font-display text-[80px] uppercase leading-[0.8] tracking-tight text-[#a2d424]/90 mix-blend-screen">
            <T k="anatomical.headline">Anatomical
            <br />
            Anomalies</T>
          </h2>
        </div>
      </section>
    </>
  )
}
