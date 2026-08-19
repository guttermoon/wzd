"use client"

import type React from "react"
import { useState } from "react"
import { toast } from "@/hooks/use-toast"
import { makeT, type HomeContent } from "@/components/notion-text"

/**
 * Vintage footer — recreation of the Universe Book Club coupon strip from
 * the reference scan: a heavy-ruled mail-in coupon with a circle-a-number
 * grid, the "Psychic Pendulum" free-gift column, three typographic book
 * covers with dense captions, and the black SEND NO MONEY! banner.
 * Rendered beneath the existing site footer while both are in play.
 */

const NUMBERS = [
  ["298", "357", "950", "951", "953", "957", "958", "962"],
  ["963", "964", "968", "970", "971", "972", "975", "976"],
]

export function VintageFooter({ content = {} }: { content?: HomeContent }) {
  const T = makeT(content)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [done, setDone] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name }),
      })
      if (!response.ok) throw new Error("Failed to subscribe")
      toast({
        title: "Coupon received!",
        description: "You are enrolled for the Club's dispatches.",
      })
      setDone(true)
    } catch {
      toast({
        title: "Error",
        description: "The mail was lost in transit. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section
      id="join-the-club"
      aria-label="Universe Book Club coupon"
      className="stained-paper isolate relative overflow-hidden border-t-2 border-black bg-white px-3 py-4 text-black sm:px-5 sm:py-5"
    >
      <div className="mx-auto max-w-[1200px]">
      {/* cropped running heads from the page above, like the scan's top edge */}
      <div className="mb-2 flex justify-between px-2 font-sans text-[8px] font-bold text-black/60">
        <span>Pub. ed. $4.95</span>
        <span className="hidden sm:inline">Pub. ed. $3.95</span>
        <span className="hidden sm:inline">Pub. ed. $4.00</span>
        <span>Pub. ed. $4.95</span>
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-stretch">
        {/* ── 1 · the mail-in coupon ── */}
        <div className="rounded-lg border-2 border-dashed border-black p-3 md:flex md:w-[55%] md:flex-col">
          <h3 className="font-sans text-[15px] font-black leading-tight tracking-tight">
            <T k="coupon.header">THE UNIVERSE BOOK CLUB, Dept. 94-FEY</T>
          </h3>
          <p className="mb-2 font-sans text-[13px] font-black leading-tight">
            <T k="coupon.address">Garden City, N.Y. 11530</T>
          </p>
          <p className="mb-2 font-sans text-[9px] leading-[1.3]">
            <T k="coupon.intro">Please accept my application for charter membership in the new
            UNIVERSE BOOK CLUB and send me the 4 books whose numbers I have
            circled below. Bill me 98&cent; (plus shipping and handling) for
            all 4 books.</T>
          </p>

          {/* circle-a-number grid */}
          <div className="mx-auto mb-2 w-[92%] rounded-md border-2 border-black px-3 py-1">
            {NUMBERS.map((row) => (
              <div key={row[0]} className="flex justify-between">
                {row.map((n) => (
                  <span key={n} className="font-sans text-[13px] font-black tracking-wide">
                    {n}
                  </span>
                ))}
              </div>
            ))}
          </div>

          <p className="mb-1 font-sans text-[8px] leading-[1.3]">
            <T k="coupon.terms">New selections will be described in advance. A convenient form
            will always be provided on which I may refuse selections I do not
            want. I pay only $2.49, plus shipping and handling, for each
            selection I accept (unless I take an extra-value selection). I
            need take only 4 books in the coming year, and may resign any
            time after that.</T>
          </p>
          <p className="mb-1 font-sans text-[9px] font-black leading-[1.3]">
            <T k="coupon.free">FREE! Also include &lsquo;Psychic Pendulum&rsquo; as an EXTRA
            bonus gift.</T>
          </p>
          <p className="mb-3 font-sans text-[8px] leading-[1.3]">
            <span className="font-black">NO-RISK GUARANTEE:</span> <T k="coupon.guarantee">If not
            delighted with my introductory shipment, I may return it in 10
            days and membership will be cancelled. I will owe nothing.</T>
          </p>

          {/* write-in lines — now a live enrolment form */}
          <form onSubmit={handleSubmit} className="md:flex md:flex-1 md:flex-col md:justify-between">
            <div className="mb-1 flex items-end gap-2 font-sans text-[9px] font-bold">
              <label htmlFor="coupon-name"><T k="coupon.name.label">FIRST NAME</T></label>
              <input
                id="coupon-name"
                type="text"
                autoComplete="given-name"
                placeholder="D. Goode"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="coupon-input h-6 min-w-0 flex-grow"
              />
              <span className="font-normal italic"><T k="coupon.print">(please print)</T></span>
            </div>
            <div className="mb-2 flex items-end gap-2 font-sans text-[9px] font-bold">
              <label htmlFor="coupon-email"><T k="coupon.email.label">EMAIL ADDRESS</T></label>
              <input
                id="coupon-email"
                type="email"
                required
                autoComplete="email"
                placeholder="you@deadgood.club"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="coupon-input h-6 min-w-0 flex-grow"
              />
            </div>
            {/* marketing opt-in, in the fine-print voice */}
            <label className="mb-2 flex min-h-[24px] cursor-pointer items-start gap-2 font-sans text-[8px] leading-[1.3]">
              <input
                type="checkbox"
                required
                className="mt-[1px] h-3 w-3 shrink-0 cursor-pointer border-black accent-black"
              />
              <span>
                <span className="font-black">YES!</span> <T k="coupon.optin">Enroll me for the
                Club&rsquo;s electronic dispatches. I agree to receive The
                Dead Good Club newsletter and occasional promotional mailings
                by e-mail. I may cancel at any time via the unsubscribe link
                in every issue &mdash; my details will never be sold, rented,
                or traded.</T>
              </span>
            </label>
            <div className="mt-2 flex items-center justify-center gap-4">
              <button
                type="submit"
                disabled={isLoading || done}
                className="bg-black px-4 py-1.5 font-sans text-[10px] font-black uppercase tracking-widest text-[#f5f1e4] transition-colors hover:bg-[#2e2c26] disabled:opacity-70"
              >
                {done ? "Enrolled!" : isLoading ? "Posting\u2026" : "Mail This Coupon"}
              </button>
              <span className="font-sans text-[10px] font-black"><T k="coupon.code">2-U5A</T></span>
            </div>
          </form>
        </div>

        {/* right cluster: pendulum and books share the top row; the
            arrowed banner runs beneath both, pointing at the coupon */}
        <div className="flex flex-col gap-3 md:w-[45%]">
        <div className="flex flex-col gap-4 md:flex-row md:items-stretch">
        {/* ── 2 · Psychic Pendulum free-gift column ── */}
        <div className="border border-black/60 p-3 md:w-[36%]">
          <h3 className="text-center font-sans text-[17px] font-black leading-none tracking-tight">
            <T k="pendulum.title">&ldquo;PSYCHIC
            <br />
            PENDULUM&rdquo;</T>
          </h3>
          {/* hand holding a pendulum on a chain — floats right so the
              copy wraps down its left side, as in the scan */}
          <svg viewBox="0 0 80 116" className="float-right -mr-1 ml-1 h-28 w-16" aria-hidden="true">
              <g fill="none" stroke="#111" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                {/* cuff entering from the top right */}
                <path d="M78 4 L60 8 M78 14 L62 16" />
                {/* fist, seen from the side */}
                <path d="M60 8 C 50 6 42 10 40 17 C 38 24 42 30 49 31 C 55 32 60 29 62 24" />
                {/* curled fingers */}
                <path d="M44 18 q -3 4 1 7" />
                <path d="M50 17 q -3 4 1 8" />
                <path d="M56 16 q -3 4 1 8" />
                {/* thumb and forefinger pinching the chain */}
                <path d="M46 31 C 44 34 46 37 49 37" />
              </g>
              {/* chain */}
              <path d="M49 37 q -1 10 0 20" fill="none" stroke="#111" strokeWidth="1.2" strokeDasharray="2.5 2.5" />
              <circle cx="49" cy="59" r="2.4" fill="#111" />
              {/* spinning-top bob */}
              <path d="M49 61 l 7 11 l -7 30 l -7 -30 z" fill="#111" />
              {/* motion ellipses */}
              <ellipse cx="49" cy="74" rx="15" ry="3.5" fill="none" stroke="#111" strokeWidth="0.8" opacity="0.55" />
              <ellipse cx="49" cy="80" rx="10" ry="2.5" fill="none" stroke="#111" strokeWidth="0.7" opacity="0.4" />
            </svg>
          <p className="mb-2 font-basker text-[15px] font-bold italic leading-none">
            FREE <span className="font-sans text-[10px] not-italic">to new</span>
            <br />
            <span className="font-sans text-[10px] not-italic">members</span>
          </p>
          <p className="justified-text font-sans text-[8px] leading-[1.35]">
            <T k="pendulum.body">Used for centuries as test for &lsquo;ESP.&rsquo; (Perhaps you
            have psychic powers and don&rsquo;t know it!) Also used to
            &lsquo;see&rsquo; future, win at gambling and love,
            &lsquo;talk&rsquo; to spirit world, find treasure, lost items,
            water.</T> <span className="font-black"><T k="pendulum.bold">N.Y. TIMES reports our GIs in
            Vietnam use same principle to locate enemy tunnels. It works
            though science can&rsquo;t say why!</T></span> <T k="pendulum.tail">Will pendulum work for
            you? Mail coupon for FREE GIFT now.</T>
          </p>
        </div>

        {/* ── 3 · the four books ── */}
        <div className="md:w-[64%]">
          <div className="grid grid-cols-3 gap-3">
            {/* 975 · Venture Inward */}
            <div>
              <div className="mb-1 flex h-28 flex-col justify-between border border-black bg-[#20221f] p-2 shadow-[2px_2px_0_rgba(0,0,0,0.4)]">
                <p className="font-basker text-[11px] italic leading-tight text-[#e8e2cf]">
                  <T k="books.1.title">Venture
                  <br />
                  Inward</T>
                </p>
                <p className="font-sans text-[6px] uppercase tracking-widest text-[#e8e2cf]/70">
                  <T k="books.1.author">Hugh Lynn Cayce</T>
                </p>
              </div>
              <p className="font-sans text-[7.5px] leading-[1.3]">
                <span className="font-black">975. VENTURE INWARD.</span> <T k="books.1.caption">Hugh
                Cayce, Son of Edgar Cayce describes his father&rsquo;s
                &ldquo;methods.&rdquo; Reveals how to develop your own psychic
                powers!</T> <span className="font-black">Pub. ed. $4.95</span>
              </p>
            </div>
            {/* 976 · The World Within */}
            <div>
              <div className="mb-1 flex h-28 flex-col justify-between border border-black bg-[#191919] p-2 shadow-[2px_2px_0_rgba(0,0,0,0.4)]">
                <p className="font-oswald text-[13px] font-bold uppercase leading-[1.05] text-[#d9c470]">
                  <T k="books.2.title">The
                  <br />
                  World
                  <br />
                  Within</T>
                </p>
                <p className="font-sans text-[6px] uppercase tracking-widest text-[#d9c470]/70">
                  <T k="books.2.author">Gina Cerminara</T>
                </p>
              </div>
              <p className="font-sans text-[7.5px] leading-[1.3]">
                <span className="font-black">976. THE WORLD WITHIN.</span>{" "}
                <T k="books.2.caption">Gina Cerminara. Reincarnation&mdash;fact or fiction? Author
                reviews new scientific evidence as proof you will be reborn.</T>{" "}
                <span className="font-black">Pub. ed. $4.95</span>
              </p>
            </div>
            {/* 971 · Beyond Space and Time */}
            <div>
              <div className="mb-1 flex h-28 flex-col justify-between border border-black bg-[#b7b2a4] p-2 shadow-[2px_2px_0_rgba(0,0,0,0.4)]">
                <p className="font-basker text-[11px] font-bold italic leading-tight text-[#26241f]">
                  <T k="books.3.title">Beyond Space
                  <br />
                  and Time&mdash;</T>
                </p>
                <p className="font-sans text-[6px] uppercase tracking-widest text-[#26241f]/70">
                  <T k="books.3.author">Ed. by M. Ebon</T>
                </p>
              </div>
              <p className="font-sans text-[7.5px] leading-[1.3]">
                <span className="font-black">971. BEYOND SPACE AND TIME.</span>{" "}
                <T k="books.3.caption">Ed. by M. Ebon. Case histories of people who &ldquo;saw&rdquo;
                future events before they happened. Find out if you have ESP
                powers.</T> <span className="font-black">Pub. ed. $4.00</span>
              </p>
            </div>
          </div>

          {/* zigzag-stitched correspondence box in the space under the books */}
          <div className="zigzag-box mx-auto mt-4 w-full md:max-w-[340px]">
            <div className="border-2 border-black px-4 py-3 text-center">
              <p className="mb-1 font-sans text-[11px] font-black uppercase tracking-wide">
                <T k="orchids.title">Orchids from our readers</T>
              </p>
              <p className="font-sans text-[9px] leading-[1.45]">
                <T k="orchids.intro">Send letters, clippings and specimens to:</T>
                <br />
                <span className="font-black"><T k="orchids.name">The Dead Good Club</T></span>
                <br />
                <T k="orchids.line1">P.O. Box 1970, Dept. DG-13</T>
                <br />
                <T k="orchids.line2">Gutter Moon Station, London N1 0AA</T>
              </p>
            </div>
          </div>
        </div>
        </div>
          {/* black banner — solid triangular arrowhead bursting out of
              the bar's left end, bold type filling the bar */}
          <div className="coupon-banner order-first relative ml-0 mt-6 md:order-none md:ml-4 md:mt-auto">
            <svg
              viewBox="0 0 40 60"
              preserveAspectRatio="none"
              className="coupon-arrow absolute right-full top-1/2 hidden h-[140%] w-8 md:block"
              aria-hidden="true"
            >
              <path d="M40 0 L2 30 L40 60 Z" fill="#0c0c0c" />
            </svg>
            {/* stacked (mobile): the arrow points up at the coupon instead */}
            <svg
              viewBox="0 0 60 40"
              preserveAspectRatio="none"
              className="absolute bottom-full left-1/2 h-8 w-14 -translate-x-1/2 translate-y-[1px] md:hidden"
              aria-hidden="true"
            >
              <path d="M0 40 L30 2 L60 40 Z" fill="#0c0c0c" />
            </svg>
            <div className="bg-black px-4 py-2">
              <svg
                viewBox="0 0 560 26"
                preserveAspectRatio="none"
                className="h-7 w-full"
                role="img"
                aria-label="This coupon brings you all 4 books. SEND NO MONEY!"
              >
                <text
                  x="0"
                  y="20"
                  textLength="560"
                  lengthAdjust="spacingAndGlyphs"
                  className="font-sans"
                  fontWeight="800"
                  fontSize="19"
                  fill="#f5f1e4"
                >
                  This coupon brings you all 4 books. SEND NO MONEY !
                </text>
              </svg>
            </div>
          </div>
        </div>
      </div>
      </div>
    </section>
  )
}
