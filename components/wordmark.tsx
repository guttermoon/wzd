/**
 * The wordmark: WORLD ZOMBIE DAY set small and hard over a large LONDON,
 * with a brain-globe punched into the O — an original mark in the spirit of
 * the 2016 site's logo, not a copy of it.
 *
 * Every run of text is locked to an explicit `textLength`, so the lock-up
 * is identical whether Grandstander has loaded yet or the browser is still
 * showing the fallback. Nothing in the mark depends on font metrics.
 *
 * Widths add up across the lower line: 2 + 148 (LOND) + 46 (the globe
 * standing in for the O) + 52 (N) = 248, matching the 246-wide rule above.
 */
const LEFT = 2
const LOND_W = 148
const GLOBE_R = 23
const GLOBE_CX = LEFT + LOND_W + GLOBE_R
const N_X = LEFT + LOND_W + GLOBE_R * 2
const N_W = 52
const BASELINE = 92
const CAP_TOP = 46
const GLOBE_CY = (CAP_TOP + BASELINE) / 2

export function Wordmark({
  className = "",
  titleId = "wordmark-title",
}: {
  className?: string
  titleId?: string
}) {
  const display = 'var(--font-display), "Arial Black", Impact, sans-serif'

  return (
    <svg
      viewBox="0 0 250 100"
      role="img"
      aria-labelledby={titleId}
      className={className}
      fill="none"
    >
      <title id={titleId}>World Zombie Day: London</title>

      <text
        x={LEFT}
        y="28"
        textLength="246"
        lengthAdjust="spacingAndGlyphs"
        fill="currentColor"
        style={{ font: `700 27px ${display}` }}
      >
        WORLD ZOMBIE DAY
      </text>
      <rect x={LEFT} y="34" width="246" height="4" fill="currentColor" />

      <text
        x={LEFT}
        y={BASELINE}
        textLength={LOND_W}
        lengthAdjust="spacingAndGlyphs"
        fill="currentColor"
        style={{ font: `700 62px ${display}` }}
      >
        LOND
      </text>
      <text
        x={N_X}
        y={BASELINE}
        textLength={N_W}
        lengthAdjust="spacingAndGlyphs"
        fill="currentColor"
        style={{ font: `700 62px ${display}` }}
      >
        N
      </text>

      {/* Brain-globe: a disc, meridians, and a cortex fissure that still
          reads as a brain at favicon size. */}
      <g transform={`translate(${GLOBE_CX} ${GLOBE_CY})`}>
        <circle r={GLOBE_R} fill="var(--accent)" />
        <g stroke="var(--accent-text)" strokeWidth="1.8" opacity="0.4" fill="none">
          <path d="M-23 0h46M-19.5-11h39M-19.5 11h39" />
          <ellipse rx="9.5" ry={GLOBE_R} />
        </g>
        {/* Brain: a lobed silhouette with three folds, sized to stay
            readable down to favicon scale. */}
        <g fill="none" stroke="var(--accent-text)" strokeLinecap="round" strokeLinejoin="round">
          <path
            d="M-15 1c-2-7 3-12 7-11 2-4 14-4 16 1 5 1 7 7 4 10 1 5-4 8-9 7-3 3-11 3-13-1-5 0-6-4-5-6z"
            strokeWidth="2.6"
          />
          <path d="M0-10.5v19" strokeWidth="2.2" />
          <path d="M-7.5-8c2 3-2 5 0 8s-1 4 0 6" strokeWidth="1.8" />
          <path d="M7.5-8c-2 3 2 5 0 8s1 4 0 6" strokeWidth="1.8" />
        </g>
      </g>
    </svg>
  )
}
