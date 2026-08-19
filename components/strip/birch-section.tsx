import { TREES } from "./shared"
import type { SectionProps } from "./shared"

export function BirchSection({ T }: SectionProps) {
  return (
    <>
      {/* ── Birch wood full-bleed band with wavy "type-trail" overlay ── */}
      <section
        className="bg-cover-center relative h-[480px] overflow-hidden border-t-4 border-[#19191b] bg-[#141414] sm:h-[640px]"
        style={{ backgroundImage: `url('${TREES}')` }}
        id="birch-trail"
        aria-label="Birch wood"
      >
        <div className="absolute inset-0 bg-black/40" />
        <svg
          className="pointer-events-none absolute inset-0 h-full w-full"
          viewBox="0 0 1200 640"
          preserveAspectRatio="xMidYMid slice"
          aria-hidden="true"
        >
          <defs>
            <path id="trail-a" fill="none" d="M -240 175 Q -40 95 160 175 T 560 175 T 960 175 T 1360 175" />
            <path id="trail-b" fill="none" d="M -240 330 Q -40 410 160 330 T 560 330 T 960 330 T 1360 330" />
            <path id="trail-c" fill="none" d="M -240 490 Q -40 410 160 490 T 560 490 T 960 490 T 1360 490" />
          </defs>
          {[
            { id: "trail-a", dur: "26s", from: "0", to: "-800", size: 66, op: 0.92 },
            { id: "trail-b", dur: "34s", from: "-800", to: "0", size: 66, op: 0.55 },
            { id: "trail-c", dur: "30s", from: "0", to: "-800", size: 66, op: 0.8 },
          ].map((t) => (
            <text
              key={t.id}
              className="font-display uppercase"
              fill="#f4f3ef"
              fillOpacity={t.op}
              fontSize={t.size}
              letterSpacing="10"
            >
              <textPath href={`#${t.id}`} startOffset={t.from}>
                <T k="birch.trail">Titus Groan&nbsp;&middot;&nbsp;Mervyn Peake&nbsp;&middot;&nbsp;Titus
                Groan&nbsp;&middot;&nbsp;Mervyn Peake&nbsp;&middot;&nbsp;Titus
                Groan&nbsp;&middot;&nbsp;Mervyn Peake&nbsp;&middot;&nbsp;</T>
                <animate
                  attributeName="startOffset"
                  from={t.from}
                  to={t.to}
                  dur={t.dur}
                  repeatCount="indefinite"
                />
              </textPath>
            </text>
          ))}
        </svg>
      </section>
    </>
  )
}
