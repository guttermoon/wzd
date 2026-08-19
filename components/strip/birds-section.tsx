import { IMG, TREES, FIELD } from "./shared"
import type { SectionProps } from "./shared"

export function BirdsSection({ T }: SectionProps) {
  return (
    <>
      {/* ── 7 · Rust: field note and birds ── */}
      <section id="bird-brains" className="relative h-auto overflow-hidden border-b-4 border-black bg-[#d37364] md:h-[600px]">
        <div
          className="bg-cover-center absolute inset-0 opacity-40 contrast-125 grayscale mix-blend-multiply"
          style={{ backgroundImage: `url('${IMG}')` }}
        />

        {/* Aged red bleed bar down the left edge */}
        <div
          aria-hidden="true"
          className="aged-magazine aged-no-edge absolute inset-y-0 left-0 z-10 w-[26px] isolate overflow-hidden bg-[#FD2824] md:w-[152px]"
        />

        {/* ── DESKTOP composition — absolute overlays ── */}
        <div className="hidden md:block">
          {/* Wavy hand-lettered headline, top centre */}
          <svg
            viewBox="0 0 1000 150"
            className="pointer-events-none absolute left-1/2 top-[60px] z-30 h-[96px] w-[78%] max-w-[820px] -translate-x-1/2"
            aria-label="Are bird brains calling the shots?"
          >
            <defs>
              <path id="birdWave" d="M30,95 C190,30 330,30 500,80 S810,140 970,70" fill="none" />
            </defs>
            <text
              className="font-spicy"
              fill="#efe7d1"
              stroke="#2a0806"
              strokeWidth="3"
              paintOrder="stroke"
              strokeLinejoin="round"
            >
              <textPath href="#birdWave" startOffset="50%" textAnchor="middle">
                <tspan fontSize="30">are&nbsp;</tspan>
                <tspan fontSize="60">BIRD BRAINS&nbsp;</tspan>
                <tspan fontSize="40">calling the&nbsp;</tspan>
                <tspan fontSize="60">SHOTS?</tspan>
              </textPath>
            </text>
          </svg>

          {/* Upper photo — overlays the red bar, flush to the left edge */}
          <div
            className="bg-cover-center absolute left-0 top-[5%] z-20 h-[30%] w-[31%] sepia contrast-125"
            style={{ backgroundImage: `url('${TREES}')` }}
          />

          {/* Lower photo — overlays the red bar, flush to the left edge */}
          <div
            className="bg-cover-center absolute bottom-[5%] left-0 z-20 h-[29%] w-[34%] sepia contrast-125"
            style={{ backgroundImage: `url('${FIELD}')` }}
          />

          {/* Two right-aligned caption blocks, upper right */}
          <div className="absolute right-[4%] top-[28%] z-20 w-[34%] max-w-[300px] text-right text-[#f3e7cf]">
            <p className="mb-1 font-basker text-[11px] italic tracking-wide text-[#f3e7cf]/75">
              <T k="birds.credit1">Courtesy American Museum of Natural History</T>
            </p>
            <p className="font-basker text-[13px] italic leading-snug">
              <T k="birds.cap1">Left, sea gulls need a highly developed cerebellum, because that is
              the part of the brain that controls balance, coordination for their
              diving.</T>
            </p>
          </div>

          <div className="absolute right-[26%] top-[60%] z-20 w-[32%] max-w-[280px] text-right text-[#f3e7cf]">
            <p className="mb-1 font-basker text-[11px] italic tracking-wide text-[#f3e7cf]/75">
              Wide World Photo
            </p>
            <p className="font-basker text-[13px] italic leading-snug">
              <T k="birds.cap2">Could an advanced species of birds control a Flying Saucer as shown
              below? Maybe. This UFO was photographed by a tourist in Romania on
              Sept. 9, 1968.</T>
            </p>
          </div>

          {/* Portrait photo overlay, bottom-right corner */}
          <div
            className="bg-cover-center absolute bottom-[2%] right-[3%] z-20 flex h-[38%] w-[22%] items-end justify-center p-4 sepia contrast-125 brightness-110"
            style={{ backgroundImage: `url('${IMG}')` }}
          >
            <a
              href="#"
              className="group inline-flex items-center gap-2 border-2 border-[#f4f3ef] bg-black/60 px-4 py-2 font-oswald text-[10px] font-bold uppercase tracking-widest text-[#f4f3ef] transition-colors hover:bg-[#f4f3ef] hover:text-black"
            >
              <T k="birds.examine">Examine Photo</T>
              <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">
                &rarr;
              </span>
            </a>
          </div>

          {/* Caption set on the red bar, between the two photos */}
          <div className="absolute left-0 top-[37%] z-20 w-[152px] px-3">
            <p className="mb-1 text-right font-oswald text-[8px] uppercase tracking-widest text-[#2a0806]">
              Wide World Photo
            </p>
            <p className="text-right font-basker text-[10px] leading-snug text-[#2a0806]">
              <T k="birds.barcap">Looking like an array of totems for Alfred Hitchcock&rsquo;s movie of
              &ldquo;The Birds,&rdquo; these early birds are actually TV antennas on
              rooftops in San Francisco. A colony took up residence over the
              city&rsquo;s Chinese District for no explainable reason.</T>
            </p>
          </div>
        </div>

        {/* ── MOBILE composition — clean vertical stack ── */}
        <div className="relative z-20 flex flex-col gap-6 pb-28 pl-11 pr-6 pt-8 md:hidden">
          <svg
            viewBox="0 -12 1000 174"
            className="pointer-events-none h-[104px] w-full"
            aria-label="Are bird brains calling the shots?"
          >
            <defs>
              <path id="birdWaveM" d="M30,95 C190,30 330,30 500,80 S810,140 970,70" fill="none" />
            </defs>
            <text
              className="font-spicy"
              fill="#efe7d1"
              stroke="#2a0806"
              strokeWidth="3"
              paintOrder="stroke"
              strokeLinejoin="round"
            >
              <textPath href="#birdWaveM" startOffset="50%" textAnchor="middle">
                <tspan fontSize="40">are&nbsp;</tspan>
                <tspan fontSize="80">BIRD BRAINS&nbsp;</tspan>
                <tspan fontSize="54">calling the&nbsp;</tspan>
                <tspan fontSize="80">SHOTS?</tspan>
              </textPath>
            </text>
          </svg>

          <div
            className="bg-cover-center h-44 w-full sepia contrast-125"
            style={{ backgroundImage: `url('${TREES}')` }}
          />

          <div>
            <p className="mb-1 font-oswald text-[9px] uppercase tracking-widest text-[#2a0806]">
              Wide World Photo
            </p>
            <p className="font-basker text-[13px] leading-snug text-[#2a0806]">
              <T k="birds.barcap">Looking like an array of totems for Alfred Hitchcock&rsquo;s movie of
              &ldquo;The Birds,&rdquo; these early birds are actually TV antennas on
              rooftops in San Francisco. A colony took up residence over the
              city&rsquo;s Chinese District for no explainable reason.</T>
            </p>
          </div>

          <div className="text-[#f6ecd8]">
            <p className="mb-1 font-basker text-[11px] italic tracking-wide text-[#f6ecd8]/80">
              <T k="birds.credit1">Courtesy American Museum of Natural History</T>
            </p>
            <p className="font-basker text-[14px] italic leading-snug">
              <T k="birds.cap1">Left, sea gulls need a highly developed cerebellum, because that is
              the part of the brain that controls balance, coordination for their
              diving.</T>
            </p>
          </div>

          <div
            className="bg-cover-center h-40 w-full sepia contrast-125"
            style={{ backgroundImage: `url('${FIELD}')` }}
          />

          <div className="text-[#f6ecd8]">
            <p className="mb-1 font-basker text-[11px] italic tracking-wide text-[#f6ecd8]/80">
              Wide World Photo
            </p>
            <p className="font-basker text-[14px] italic leading-snug">
              <T k="birds.cap2">Could an advanced species of birds control a Flying Saucer as shown
              below? Maybe. This UFO was photographed by a tourist in Romania on
              Sept. 9, 1968.</T>
            </p>
          </div>

          <div
            className="bg-cover-center mx-auto flex aspect-square w-3/4 items-end justify-center p-4 sepia contrast-125 brightness-110"
            style={{ backgroundImage: `url('${IMG}')` }}
          >
            <a
              href="#"
              className="group inline-flex items-center gap-2 border-2 border-[#f4f3ef] bg-black/60 px-4 py-2 font-oswald text-[11px] font-bold uppercase tracking-widest text-[#f4f3ef] transition-colors hover:bg-[#f4f3ef] hover:text-black"
            >
              <T k="birds.examine">Examine Photo</T>
              <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">
                &rarr;
              </span>
            </a>
          </div>
        </div>

      </section>
    </>
  )
}
