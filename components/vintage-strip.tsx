/**
 * Homepage master strip — the vintage print archive reproduction, one
 * component per section under components/strip/. Section anchor ids are
 * linked from the header's SECTIONS dropdown; text slots come from Notion
 * via the <T> renderer (see CLAUDE.md).
 */

import { makeT, type HomeContent } from "@/components/notion-text"
import { CoverSection } from "./strip/cover-section"
import { BirchSection } from "./strip/birch-section"
import { FieldSection } from "./strip/field-section"
import { CondonSection } from "./strip/condon-section"
import { EnemySection } from "./strip/enemy-section"
import { BirdsSection } from "./strip/birds-section"
import { AnatomicalSection } from "./strip/anatomical-section"
import { PosterSection } from "./strip/poster-section"
import { VoidSection } from "./strip/void-section"
import { SignalsSection } from "./strip/signals-section"
import { EqSection } from "./strip/eq-section"

export function VintageStrip({ content = {} }: { content?: HomeContent }) {
  const T = makeT(content)
  return (
    <div className="master-strip">
      <h1 className="sr-only">
        The Dead Good Club — a dead good periodical of dispatches, features,
        and curiosities
      </h1>
        <CoverSection T={T} />
        <BirchSection T={T} />
        <FieldSection T={T} />
        <CondonSection T={T} />
        <EnemySection T={T} />
        <BirdsSection T={T} />
        <AnatomicalSection T={T} />
        <PosterSection T={T} />
        <VoidSection />
        <SignalsSection T={T} />
        <EqSection T={T} />
    </div>
  )
}
