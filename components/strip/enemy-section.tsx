import { IMG } from "./shared"
import type { SectionProps } from "./shared"

export function EnemySection({ T }: SectionProps) {
  return (
    <>
      {/* ── 6 · Grey bento grid: The 'Other' Enemy / Over Vietnam ──
          Reflows the vintage magazine spread: a black rule, a narrow body
          column, then a main area whose top row pairs THE with a boxless text
          block at matching height, and whose lower row runs the display stack
          ('OTHER' set vertically · deck box · ENEMY) beside the UFO plate and
          OVER VIETNAM title. Stacks on mobile. */}
      <section id="other-enemy" className="aged-magazine aged-no-edge relative isolate overflow-hidden border-b-2 border-black bg-[#b3b4b6] p-4 md:p-6">
        <div className="flex flex-col gap-5 md:flex-row md:items-stretch">
          {/* black rule down the left edge */}
          <div aria-hidden="true" className="hidden w-[35px] shrink-0 bg-black md:block lg:w-[57px]" />

          {/* main content — two horizontally-aligned bands */}
          <div className="flex flex-1 flex-col gap-6">
            {/* ── BAND 1: body + THE/OTHER (left) · text block + plate (right).
                items-stretch ties the plate height to the OTHER column, so the
                image bottom lands on the R. ── */}
            <div className="flex flex-col gap-5 md:flex-row md:items-start">
              {/* far-left: body column */}
              <div className="md:flex-[1.4] lg:flex-[1]">
                <p className="justified-text font-basker text-[13px] leading-snug text-[#1a1a1a] first-letter:float-left first-letter:pr-1 first-letter:font-display first-letter:text-[38px] first-letter:leading-[0.66]">
                  <T k="enemy.body1">Not much, if anything, has been heard by the American press or
                  public about Flying Saucers over South Vietnam. This is not
                  surprising in view of the war. Any sighting by military
                  personnel of an Unidentified Flying Object is classified for
                  reasons of military security. It doesn&rsquo;t pay to take
                  chances with aerial objects when their identity cannot be
                  established. They may be some new reconnaissance or weapon
                  system devised by the enemy or his allies.</T>
                </p>
                <p className="justified-text mt-3 font-basker text-[13px] leading-snug text-[#1a1a1a]">
                  <T k="enemy.body2">About a year ago, one of the strangest UFO sightings reported
                  in South Vietnam was declassified after it was determined the
                  sighting had no military significance. This and three other
                  sightings, one of them over Laos, have never before been made
                  public. So in a true sense, this article is a
                  &lsquo;scoop.&rsquo;</T>
                </p>
                <p className="justified-text mt-3 font-basker text-[13px] leading-snug text-[#1a1a1a]">
                  <span className="hand-highlight">
                    <T k="enemy.body3">In the first case, where two UFO&rsquo;s were observed over To
                    Chou, there were three witnesses, all of them military
                    personnel. I&rsquo;ll let one of these men tell his own story.
                    Here is the verbatim report submitted to military
                    intelligence by Sergeant First Class James G. Ringland, III.</T>
                  </span>
                </p>
                <p className="justified-text mt-3 font-basker text-[13px] leading-snug text-[#1a1a1a]">
                  <T k="enemy.body4">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                  eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                  enim ad minim veniam, quis nostrud exercitation ullamco laboris
                  nisi ut aliquip ex ea commodo consequat.</T>
                </p>
              </div>

              {/* cluster: two stretch-aligned rows so THE matches the paragraph
                  height, and OTHER + the plate share a row (tops aligned). */}
              <div className="flex flex-[2.4] flex-col gap-5 lg:flex-[3]">
                {/* TOP row — THE stretches to the paragraph height beside it */}
                <div className="flex flex-col gap-3 md:flex-row md:items-stretch md:gap-5">
                  <div className="hidden flex-1 md:block">
                    <svg
                      viewBox="0 0 100 30"
                      preserveAspectRatio="none"
                      className="h-full min-h-[64px] w-full"
                      role="img"
                      aria-label="The"
                    >
                      <text
                        x="0"
                        y="25"
                        textLength="100"
                        lengthAdjust="spacingAndGlyphs"
                        className="font-display"
                        fontSize="30"
                        fill="#5B5B5B"
                      >
                        THE
                      </text>
                    </svg>
                  </div>
                  <p className="flex-[2] justified-text font-basker text-[13px] leading-snug text-[#1a1a1a]">
                    <T k="enemy.quote">&ldquo;This light traveled to an altitude of from
                    10&ndash;15,000 feet. When it reached its peak, it started to
                    travel to the left. It went to the left quite a
                    ways&mdash;distance undetermined&mdash;where it started to
                    blink, by getting real dim and then going back to its normal
                    brightness.&rdquo;</T>
                  </p>
                </div>

                {/* BOTTOM row — vertical OTHER beside the plate; sharing the row
                    top-aligns them, and the plate bleeds left to sit near OTHER */}
                <div className="flex flex-col gap-3 md:flex-row md:items-stretch md:gap-5">
                  <div className="relative z-10 hidden md:flex md:w-[82px] md:flex-none">
                    <div className="flex origin-left flex-col items-center gap-3 self-start font-display uppercase leading-none [transform:scaleX(1.55)] md:gap-4">
                      {["O", "T", "H", "E", "R"].map((l) => (
                        <span key={l} className="other-stack text-[clamp(48px,12vw,180px)] md:text-[104px]">
                          <span className="ol-outer">{l}</span>
                          <span className="ol-mid">{l}</span>
                          <span className="ol-inner">{l}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-1 gap-3">
                    <div className="relative min-h-[340px] flex-grow overflow-hidden border-2 border-black">
                      <div
                        className="bg-cover-center h-full w-full brightness-90 contrast-125 grayscale"
                        style={{ backgroundImage: `url('${IMG}')` }}
                      />
                      <div className="absolute right-8 top-10 h-2 w-8 rounded-[50%] bg-black blur-[1px]" />
                      <div className="absolute right-14 top-14 h-3 w-12 rounded-[50%] bg-black blur-[1px]" />
                      <span className="absolute bottom-2 right-2 bg-black/70 px-2 py-1 font-oswald text-[9px] font-bold uppercase tracking-wide text-white">
                        <T k="enemy.photocredit">Wide World Photo</T>
                      </span>
                    </div>
                    {/* right-edge bar, only as tall as the image */}
                    <div aria-hidden="true" className="hidden w-[35px] bg-black md:block lg:w-[57px]" />
                  </div>
                </div>
              </div>
            </div>

            {/* ── BAND 2: OVER VIETNAM (left) · ENEMY + two columns (right) ── */}
            <div className="flex flex-col gap-5 md:flex-row md:items-stretch">
              <div className="flex flex-[1] flex-col gap-6 md:order-2">
                {/* ENEMY — typewriter, solid black; the whole word tilted 45°. Hidden on mobile. */}
                <div className="hidden h-[200px] items-center justify-center md:flex xl:h-[260px]">
                  <div
                    aria-label="Enemy"
                    suppressHydrationWarning
                    className="enemy-arch inline-flex rotate-[20deg] items-end gap-1 text-[clamp(64px,9.6vw,134px)] leading-none"
                  >
                    <span className="enemy-letter">E</span>
                    <span className="enemy-letter">N</span>
                    <span className="enemy-letter">E</span>
                    <span className="enemy-letter">M</span>
                    <span className="enemy-letter">Y</span>
                  </div>
                </div>

                {/* two columns beneath ENEMY. Forced (desktop-only) line breaks
                    step the first lines short-to-long so the copy nests up into
                    the wedge left by the tilted word, trimming the block height. */}
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  <p className="font-basker text-[13px] leading-snug text-[#1a1a1a] md:-mt-[8vw]">
                    <T k="enemy.col1">Orange<br className="hidden md:block" />
                    light rising<br className="hidden md:block" />
                    up into the<br className="hidden md:block" />
                    sky on an approximate azimuth of 285 degrees, checked by
                    compass on this day.</T>
                  </p>
                  <p className="font-basker text-[13px] font-bold leading-snug text-[#1a1a1a] md:-mt-[2vw]">
                    <T k="enemy.col2">Strange,<br className="hidden md:block" />
                    exploding lights,<br className="hidden md:block" />
                    five oval-shaped<br className="hidden md:block" />
                    illuminated objects, speeds five times faster than our own
                    jets.</T>
                  </p>
                </div>
              </div>

              {/* left: OVER VIETNAM, filling the band height */}
              <div className="flex flex-[1.15] md:order-1">
                <div className="flex flex-grow flex-col justify-between bg-[#1a1a1a] p-6">
                  <div className="mb-3 flex items-start justify-between">
                    <span className="bg-[#f4f3ef] px-2 py-1 font-oswald text-[10px] font-bold uppercase tracking-widest text-black">
                      <T k="enemy.declass">Declass 1978</T>
                    </span>
                    <span className="font-oswald text-[10px] uppercase tracking-widest text-[#8f8f8f]">
                      <T k="enemy.byline1">By Lloyd Mallan</T>
                    </span>
                  </div>
                  <div className="flex flex-wrap items-end justify-between gap-x-4 gap-y-5">
                    <h2 className="font-display text-[clamp(44px,5vw,60px)] uppercase leading-[0.82] tracking-tighter text-transparent [-webkit-text-stroke:2px_#f4f3ef]">
                      <T k="enemy.title">Over
                      <br />
                      Vietnam</T>
                    </h2>
                    <a
                      href="#"
                      className="group inline-flex shrink-0 items-center gap-2 border-2 border-[#f4f3ef] bg-transparent px-5 py-3 font-oswald text-[12px] font-bold uppercase tracking-widest text-[#f4f3ef] transition-colors hover:bg-[#f4f3ef] hover:text-[#1a1a1a]"
                    >
                      <T k="enemy.cta">Read the Dossier</T>
                      <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">
                        &rarr;
                      </span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Release the ENEMY letter animation when the word scrolls into view */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "(function(){function init(){var h=document.querySelector('.enemy-arch');if(!h||!('IntersectionObserver' in window))return;if(h.getAttribute('data-enemy-init'))return;h.setAttribute('data-enemy-init','1');h.classList.add('is-armed');var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){h.classList.remove('is-armed');h.classList.add('is-go');io.disconnect();}});},{threshold:0.35});io.observe(h)}init();window.addEventListener('load',function(){setTimeout(init,120);setTimeout(init,1200)})})();",
          }}
        />
      </section>
    </>
  )
}
