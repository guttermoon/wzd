/**
 * The tape transfer, as an SVG filter.
 *
 * A CSS `filter` chain cannot separate colour channels, and the red/cyan
 * fringe of a worn tape is exactly that: the three channels laid down a few
 * pixels apart. So the split is done here, with the tracking tear and the
 * grain, and the tint, the scanlines and the vignette stay in CSS (`.vhs`
 * in globals.css) where they can respond to media queries.
 *
 * Three things make this read as tape rather than as a blurred photograph,
 * and the first is the one that matters most:
 *
 * 1. **Only the colour is soft.** VHS carries far less chroma bandwidth
 *    than luma, so the colour smears sideways while the picture stays
 *    sharp. The green channel — which is most of the luminance — is left
 *    alone, and the red and blue are offset and blurred horizontally only.
 *    Blurring all three is what made the earlier version look merely out
 *    of focus.
 * 2. **The offsets are large enough to see.** Two and a half pixels each
 *    way, not a fraction of one: at the size these photographs run, a
 *    sub-pixel split just muddies the edges instead of registering as an
 *    effect. Four was legible as an effect and illegible as a photograph,
 *    which is the wrong trade: the picture has to survive the treatment.
 * 3. **The tracking tears.** A displacement map driven by turbulence that
 *    is stretched flat — a very low frequency across, a high one down —
 *    which produces horizontal bands that slide sideways by different
 *    amounts, the way a tape does when the tracking is off. Kept small:
 *    the tear should be something you notice about the picture, not the
 *    thing standing between you and it.
 *
 * Everything is static. Nothing here animates, ever: a photograph that
 * flickers is a seizure risk and fails WCAG 2.3.1.
 *
 * Rendered once, in the layout. It draws nothing itself: the <svg> is zero
 * by zero and absolutely positioned out of flow, and carries no accessible
 * name because there is nothing to announce.
 */
/**
 * The same filter twice, at two strengths. Crowds get the weaker one: at
 * full strength the split and the tear read as texture on a single large
 * subject and as noise on two hundred small ones, where they cost the
 * picture the only thing it has. Which photographs count as crowds is a
 * `busy` flag in content/photos.json, not a guess made here.
 */
const STRENGTHS = [
  { id: "vhs-tape", tear: 2.5, split: 2.5, drop: 0.5, smear: 0.4, grain: 0.1 },
  { id: "vhs-tape-light", tear: 1.1, split: 1.2, drop: 0.25, smear: 0.25, grain: 0.06 },
] as const

export function VhsFilter() {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      width="0"
      height="0"
      className="pointer-events-none absolute"
    >
      <defs>
        {STRENGTHS.map((s) => (
        <filter
          key={s.id}
          id={s.id}
          x="-8%"
          y="-8%"
          width="116%"
          height="116%"
          colorInterpolationFilters="sRGB"
        >
          {/* ── Tracking ────────────────────────────────────────────────
              Turbulence stretched flat: almost no variation across, a lot
              of it down, so each band of rows is displaced by its own
              amount and the result is horizontal tearing rather than a
              general wobble. */}
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.0008 0.06"
            numOctaves="1"
            seed="11"
            result="trackingRaw"
          />
          {/* Alpha flattened to exactly 0.5, which is feDisplacementMap's
              zero. Selecting it for Y is what keeps the tear horizontal:
              take a varying channel for Y as well and the picture is
              scrambled in both directions, which is not what a tape does
              and is not legible. */}
          <feComponentTransfer in="trackingRaw" result="tracking">
            <feFuncA type="table" tableValues="0.5 0.5" />
          </feComponentTransfer>
          <feDisplacementMap
            in="SourceGraphic"
            in2="tracking"
            scale={s.tear}
            xChannelSelector="R"
            yChannelSelector="A"
            result="torn"
          />

          {/* ── The channel split ───────────────────────────────────────
              Red left, blue right and a touch down, both smeared sideways.
              Green is untouched: it carries the luminance, and leaving it
              sharp is the difference between a tape and a blur. */}
          <feColorMatrix
            in="torn"
            type="matrix"
            values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0"
            result="red"
          />
          <feOffset in="red" dx={-s.split} dy="0" result="redShifted" />
          <feGaussianBlur in="redShifted" stdDeviation={`${s.smear} 0`} result="redSmeared" />

          <feColorMatrix
            in="torn"
            type="matrix"
            values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0"
            result="greenSharp"
          />

          <feColorMatrix
            in="torn"
            type="matrix"
            values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0"
            result="blue"
          />
          <feOffset in="blue" dx={s.split} dy={s.drop} result="blueShifted" />
          <feGaussianBlur in="blueShifted" stdDeviation={`${s.smear} 0`} result="blueSmeared" />

          <feBlend in="redSmeared" in2="greenSharp" mode="screen" result="rg" />
          <feBlend in="rg" in2="blueSmeared" mode="screen" result="split" />

          {/* ── Tape grain ──────────────────────────────────────────────
              One octave is enough at this scale and costs a fraction of
              two. Heavier than it was, because the rest is heavier. */}
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.7"
            numOctaves="1"
            seed="7"
            result="noise"
          />
          <feColorMatrix in="noise" type="saturate" values="0" result="mono" />
          <feComponentTransfer in="mono" result="grain">
            <feFuncA type="linear" slope={s.grain} intercept="-0.03" />
          </feComponentTransfer>
          <feBlend in="split" in2="grain" mode="overlay" result="grained" />

          {/* Clip everything back to the photograph, so the offsets, the
              tear and the grain cannot bleed outside the frame. */}
          <feComposite in="grained" in2="SourceGraphic" operator="in" />
        </filter>
        ))}
      </defs>
    </svg>
  )
}
