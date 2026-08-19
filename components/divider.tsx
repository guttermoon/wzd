import { Bars, type Bar } from "@/components/bars"

/**
 * A section break made of slabs rather than a rule.
 *
 * Three bars of different lengths and weights drive in from alternating
 * sides, 100ms apart, and stop — the credit-roll bars from the Golden Arm
 * title, doing the job a horizontal rule used to do.
 *
 * The block reserves its own height, so nothing reflows when the bars
 * arrive, and the whole thing is decorative.
 */
const LEFT_FIRST: Bar[] = [
  { from: "left", top: "0", left: "0", width: "46%", height: "14px", tilt: -0.6, delay: 0 },
  { from: "right", top: "22px", right: "0", width: "34%", height: "10px", tilt: 0.5, tone: "ink", delay: 100 },
  { from: "left", top: "40px", left: "12%", width: "20%", height: "8px", tilt: -0.4, tone: "text", delay: 200 },
]

const RIGHT_FIRST: Bar[] = [
  { from: "right", top: "0", right: "0", width: "52%", height: "14px", tilt: 0.6, delay: 0 },
  { from: "left", top: "22px", left: "0", width: "30%", height: "10px", tilt: -0.5, tone: "ink", delay: 100 },
  { from: "right", top: "40px", right: "16%", width: "18%", height: "8px", tilt: 0.4, tone: "text", delay: 200 },
]

export function Divider({
  lead = "left",
  className = "",
}: {
  lead?: "left" | "right"
  className?: string
}) {
  return (
    <div className={`relative h-[52px] w-full overflow-hidden ${className}`} aria-hidden="true">
      <Bars bars={lead === "left" ? LEFT_FIRST : RIGHT_FIRST} />
    </div>
  )
}
