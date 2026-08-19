import type React from "react"
import { Reveal } from "@/components/reveal"
import { Swipe } from "@/components/swipe"

/**
 * The masthead every inner page shares: a big cut-paper title block over a
 * torn bar. Keeps the pages visually identical so only the words differ.
 */
export function PageShell({
  title,
  titleText,
  standfirst,
  banner,
  children,
}: {
  title: React.ReactNode
  /**
   * The same heading as a plain string, from `makeS`. When it is given the
   * heading arrives a word at a time instead of in one block; `title` still
   * has to be passed, because it is what renders without JavaScript.
   */
  titleText?: string
  standfirst?: React.ReactNode
  /**
   * An optional band across the top of the page, above the title. For the
   * pages where a photograph genuinely sets the scene; most pages are
   * better without one, and the prop is left off there.
   */
  banner?: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <div className="mx-auto w-full max-w-page px-4 py-10 sm:px-6 sm:py-14">
      {/* The title card, played once: a panel wipes off the heading, the
          rule drives in from the left, the standfirst follows, 90ms apart,
          which is the middle of the 80-120ms house stagger.

          Where there is a banner the heading sits on it, on a hard slab of
          --blood rather than straight on the photograph. White on that slab
          is 6.02:1 whatever the picture underneath is doing, which type set
          directly over a photograph can never promise. Below lg the band is
          only a couple of hundred pixels deep, so the heading drops back
          underneath it instead. */}
      {banner ? (
        <div className="breakout relative -mt-10 mb-10 sm:-mt-14">
          {banner}
          {/* z-10: the photograph's frame sets z-index 1 on itself (see
              .panel-ground in globals.css), so an overlay at auto paints
              underneath it. */}
          <div className="relative z-10 mt-6 lg:absolute lg:inset-0 lg:mt-0 lg:flex lg:items-end lg:pb-14">
            {/* on-blood: the panel each word comes out from has to be the
                slab it sits on, not the page behind it. */}
            <div className="on-blood mx-auto w-full max-w-page px-4 sm:px-6">
              <Reveal variant="slide-right" className="inline-block">
                {titleText ? (
                  <Swipe
                    text={titleText}
                    as="h1"
                    delay={220}
                    className="display bg-blood px-5 py-3 text-[clamp(2.25rem,6vw,4rem)] text-blood-text"
                  />
                ) : (
                  <h1 className="display bg-blood px-5 py-3 text-[clamp(2.25rem,6vw,4rem)] text-blood-text">
                    {title}
                  </h1>
                )}
              </Reveal>
            </div>
          </div>
        </div>
      ) : null}

      <header>
        {banner ? null : (
          <>
            <Reveal variant="wipe">
              <h1 className="display text-[clamp(2.25rem,7vw,4.5rem)]">{title}</h1>
            </Reveal>
            <Reveal variant="slide-right" delay={90} className="slab-rule mt-4" />
          </>
        )}
        {standfirst ? (
          <Reveal
            variant="slide-up"
            delay={180}
            as="p"
            className="max-w-[60ch] font-body text-lg leading-relaxed text-muted sm:text-xl"
          >
            {standfirst}
          </Reveal>
        ) : null}
      </header>
      {children}
    </div>
  )
}

/** A titled block within a page. */
export function Section({
  id,
  title,
  children,
  className = "",
}: {
  id?: string
  title?: React.ReactNode
  children: React.ReactNode
  className?: string
}) {
  return (
    <section id={id} className={`mt-12 ${className}`}>
      {title ? (
        <Reveal variant="wipe" className="mb-4">
          <h2 className="display text-[clamp(1.5rem,3.5vw,2.25rem)]">{title}</h2>
        </Reveal>
      ) : null}
      <Reveal variant="slide-up" delay={90}>
        {children}
      </Reveal>
    </section>
  )
}
