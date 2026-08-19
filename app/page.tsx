import { preload } from "react-dom"

import { VintageStrip } from "@/components/vintage-strip"
import { getHomeText } from "@/lib/homepage-content"

export const revalidate = 60

/**
 * Homepage — the vintage print archive strip, centered on a dark
 * mounting board exactly like the provided reproduction file.
 */
export default async function HomePage() {
  // the cover arch photo is the LCP element — fetch it with the document
  preload("/574b42abfa2555952d3273c85e9cec76.webp", { as: "image" })
  const content = await getHomeText()
  return (
    <div className="flex justify-center bg-[#F2F1EE] px-2 pb-0 pt-0 font-basker">
      <VintageStrip content={content} />
    </div>
  )
}
