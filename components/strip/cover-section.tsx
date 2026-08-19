import { IMG } from "./shared"
import type { SectionProps } from "./shared"

export function CoverSection({ T }: SectionProps) {
  return (
    <>
      {/* ── 1 · Cover: Penguin-style plate with arch window ── */}
      <section id="cover" className="relative bg-[#19191b] pb-0 pt-12 text-[#f4f3ef]">
        <div className="px-10">
          {/* top row: placeholder logo upper-left, series + author right */}
          <div className="flex items-start justify-between gap-6">
            <div
              role="img"
              aria-label="Logo placeholder"
              className="mt-1 flex h-16 w-11 shrink-0 items-center justify-center rounded-[50%] border-2 border-[#f4f3ef]/80"
            >
              <svg viewBox="0 0 24 32" className="h-9 w-6 fill-[#f4f3ef]/85" aria-hidden="true">
                <circle cx="12" cy="9" r="4.5" />
                <path d="M4 27 Q12 13 20 27 Z" />
              </svg>
            </div>
            <div className="text-right">
              <p className="mb-3 font-oswald text-[30px] font-light leading-none tracking-wide text-[#cfcfcf]">
                <T k="cover.series">Penguin Modern Classics</T>
              </p>
              <h2 className="font-oswald text-[68px] font-bold leading-[0.95] tracking-tight">
                <T k="cover.author">Mervyn Peake</T>
              </h2>
            </div>
          </div>
          {/* full-width rule between author and title */}
          <div className="my-4 h-px w-full bg-[#f4f3ef]/35" />
          <h2 className="text-right font-oswald text-[68px] font-normal leading-[0.95] tracking-tight text-[#d1d1d1]">
            <T k="cover.title">Titus Groan</T>
          </h2>
        </div>

        <div className="mb-4 mt-6 flex items-start justify-between px-10">
          <div className="w-1/2">
            <div className="mb-4 h-1 w-8 bg-[#444]" />
            <p className="max-w-[200px] font-oswald text-[10px] uppercase tracking-widest text-[#888]">
              <T k="cover.blurb">A brilliant, labyrinthine and Gothic masterpiece of the
              imagination.</T>
            </p>
            <a
              href="/blog"
              className="mt-5 inline-flex items-center gap-2 border border-[#f4f3ef]/70 px-4 py-2 font-oswald text-[10px] uppercase tracking-widest text-[#f4f3ef] transition-colors hover:bg-[#f4f3ef] hover:text-[#19191b]"
            >
              <T k="cover.cta">Read More</T>
              <span aria-hidden="true">&rarr;</span>
            </a>
          </div>
          {/* Abstract bird vector graphic */}
          <div className="flex w-1/2 justify-end">
            <svg
              viewBox="0 0 200 100"
              className="h-[90px] w-[180px] opacity-80"
              stroke="#fff"
              fill="none"
              strokeWidth="1.5"
            >
              <path d="M40,50 Q60,20 100,30 T160,20 Q150,60 120,70 T50,80 Z" strokeDasharray="2,2" />
              <circle cx="110" cy="35" r="4" fill="#fff" />
              <path d="M100,30 Q90,10 70,15" />
              <path d="M40,50 Q20,60 10,40" />
              <text
                x="150"
                y="80"
                fontFamily="monospace"
                fontSize="10"
                stroke="none"
                fill="#fff"
                transform="rotate(-10 150 80)"
              >
                Fig 1.A
              </text>
            </svg>
          </div>
        </div>

        <div className="relative">
          {/* photo plate — fixed-height arch with the poster type + colophon */}
          <div className="relative">
            <div
              className="arch-window bg-cover-center"
              style={{
                backgroundImage: `url('${IMG}')`,
                filter: "sepia(0.3) contrast(1.1) brightness(0.9)",
              }}
            />
            {/* Typographic display block — stacked bold-condensed poster type
                overlaid on the arch photo, upper left, aligned with the block */}
            <div
              className="absolute left-6 top-[52%] font-oswald font-normal uppercase leading-[0.82] tracking-tight text-[#BD9524] sm:left-8 sm:top-[50%]"
              style={{ textShadow: "2px 2px 0 #000, 0 0 14px rgba(0,0,0,0.7)" }}
            >
              <div className="text-[44px] sm:text-[72px]"><T k="cover.jet1">Jet</T></div>
              <div className="text-[17px] sm:text-[26px]"><T k="cover.jet2">Pilot&rsquo;s</T></div>
              <div className="text-[17px] sm:text-[26px]"><T k="cover.jet3">Return</T></div>
              <div className="text-[17px] sm:text-[26px]"><T k="cover.jet4">Match With A</T></div>
              <div className="text-[42px] sm:text-[68px]"><T k="cover.jet5">UFO</T></div>
            </div>
            <div className="absolute bottom-6 right-6 flex h-14 w-14 items-center justify-center rounded-full bg-[#e8e4d9]">
              <span className="font-playfair text-2xl font-black text-black">A</span>
            </div>
          </div>

          {/* aged-yellow magazine block — overlays the photo on desktop,
              stacks below it (thin column · photo · two columns) on mobile */}
          <div className="aged-magazine aged-no-edge isolate relative z-10 flex flex-col gap-4 overflow-hidden bg-[#c9a227] px-6 py-5 text-black shadow-lg sm:absolute sm:inset-x-8 sm:bottom-16 sm:flex-row sm:gap-5">
            {/* thin lead column */}
            <div className="w-full sm:w-1/5">
              <p className="dense-copy justified-text font-basker text-[13px] leading-snug">
                <T k="cover.mag.lead">Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Integer nec odio. Praesent libero. Sed cursus ante dapibus
                diam. Sed nisi. Nulla quis sem at nibh elementum imperdiet.
                Duis sagittis ipsum. Praesent mauris. Fusce nec tellus sed
                augue semper porta.</T>
              </p>
            </div>
            {/* photograph — reuse the placeholder webp */}
            <div className="w-full sm:w-2/5">
              <div
                className="bg-cover-center h-56 w-full border border-black/40 contrast-125 grayscale sepia-[0.35] sm:h-full sm:min-h-[200px]"
                style={{ backgroundImage: `url('${IMG}')` }}
              />
            </div>
            {/* two further columns */}
            <div className="w-full sm:w-2/5">
              <div className="columns-1 gap-5 sm:columns-2">
                <p className="dense-copy justified-text mb-3 font-basker text-[13px] leading-snug">
                  <T k="cover.mag.col1">Curabitur sodales ligula in libero. Sed dignissim lacinia
                  nunc. Curabitur tortor. Pellentesque nibh. Aenean quam. In
                  scelerisque sem at dolor. Maecenas mattis. Sed convallis
                  tristique sem. Proin ut ligula vel nunc egestas porttitor.
                  Morbi lectus risus, iaculis vel, suscipit quis, luctus non,
                  massa.</T>
                </p>
                <p className="dense-copy justified-text mb-3 font-basker text-[13px] leading-snug">
                  <T k="cover.mag.col2">Fusce ac turpis quis ligula lacinia aliquet. Mauris ipsum.
                  Nulla metus metus, ullamcorper vel, tincidunt sed, euismod
                  in, nibh. Quisque volutpat condimentum velit. Class aptent
                  taciti sociosqu ad litora torquent per conubia nostra.</T>
                </p>
                <p className="dense-copy justified-text font-basker text-[13px] leading-snug">
                  <T k="cover.mag.col3">Nam nec ante. Sed lacinia, urna non tincidunt mattis, tortor
                  neque adipiscing diam, a cursus ipsum ante quis turpis. Nulla
                  facilisi. Ut fringilla. Suspendisse potenti. Nunc feugiat mi
                  a tellus consequat imperdiet.</T>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
