/**
 * The tape transfer, as an SVG filter.
 *
 * A CSS `filter` chain cannot separate colour channels, and the red/cyan
 * fringe of a worn tape is exactly that: the three channels laid down a few
 * pixels apart. So the split is done here — each channel isolated, offset,
 * and screened back together — with grain from feTurbulence composited
 * inside the image silhouette so it never spills past the frame.
 *
 * Rendered once, in the layout. It draws nothing itself: the <svg> is zero
 * by zero and absolutely positioned out of flow, and carries no accessible
 * name because there is nothing to announce.
 *
 * The tint, the scanlines and the vignette stay in CSS (`.vhs` in
 * globals.css) where they can respond to media queries.
 */
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
        <filter
          id="vhs-tape"
          x="-4%"
          y="-4%"
          width="108%"
          height="108%"
          colorInterpolationFilters="sRGB"
        >
          {/* Red pushed left, blue pushed right and a touch down — the
              misregistration reads as magenta on one edge, cyan on the
              other, which is what the tape actually does. */}
          <feColorMatrix
            in="SourceGraphic"
            type="matrix"
            values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0"
            result="red"
          />
          <feOffset in="red" dx="-2.5" dy="0" result="redShifted" />
          <feColorMatrix
            in="SourceGraphic"
            type="matrix"
            values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0"
            result="green"
          />
          <feOffset in="green" dx="0" dy="-0.5" result="greenShifted" />
          <feColorMatrix
            in="SourceGraphic"
            type="matrix"
            values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0"
            result="blue"
          />
          <feOffset in="blue" dx="2.5" dy="1" result="blueShifted" />
          <feBlend in="redShifted" in2="greenShifted" mode="screen" result="rg" />
          <feBlend in="rg" in2="blueShifted" mode="screen" result="split" />

          {/* Tape grain. One octave is enough at this scale and costs a
              fraction of two. */}
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.8"
            numOctaves="1"
            seed="7"
            result="noise"
          />
          <feColorMatrix in="noise" type="saturate" values="0" result="mono" />
          <feComponentTransfer in="mono" result="grain">
            <feFuncA type="linear" slope="0.14" intercept="-0.03" />
          </feComponentTransfer>
          <feBlend in="split" in2="grain" mode="overlay" result="grained" />

          {/* Clip everything back to the photograph, so the offsets and the
              grain cannot bleed outside the frame. */}
          <feComposite in="grained" in2="SourceGraphic" operator="in" />
        </filter>
      </defs>
    </svg>
  )
}
