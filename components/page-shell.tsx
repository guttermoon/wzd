import type React from "react"

/**
 * The masthead every inner page shares: a big cut-paper title block over a
 * torn bar. Keeps the pages visually identical so only the words differ.
 */
export function PageShell({
  title,
  standfirst,
  children,
}: {
  title: React.ReactNode
  standfirst?: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <div className="mx-auto w-full max-w-page px-4 py-10 sm:px-6 sm:py-14">
      <header>
        <h1 className="display text-[clamp(2.25rem,7vw,4.5rem)]">{title}</h1>
        <div className="slab-rule mt-4" />
        {standfirst ? (
          <p className="mt-5 max-w-[60ch] font-body text-lg leading-relaxed text-muted sm:text-xl">
            {standfirst}
          </p>
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
        <h2 className="display mb-4 text-[clamp(1.5rem,3.5vw,2.25rem)]">{title}</h2>
      ) : null}
      {children}
    </section>
  )
}
