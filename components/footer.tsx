import Link from "next/link"
import { Github, Twitter, Linkedin } from "lucide-react"
import { getSectionContent } from "@/lib/notion-content"

const DEFAULT_TAGLINE =
  "A dead good periodical of dispatches, features, and curiosities. Typeset in the cloud, delivered on digital paper."

export async function Footer() {
  const content = await getSectionContent("footer")

  return (
    <footer className="bg-black text-paper">
      <div className="container py-12">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2">
          <div>
            <h3 className="font-display text-2xl uppercase tracking-wide">
              The Dead Good Club
            </h3>
            {content?.html ? (
              <div
                className="mt-4 font-serif italic text-paper/70 [&_p]:my-2"
                dangerouslySetInnerHTML={{ __html: content.html }}
              />
            ) : (
              <p className="mt-4 font-serif italic text-paper/70">
                {DEFAULT_TAGLINE}
              </p>
            )}
          </div>

          <div className="space-y-10">
          <div>
            <h4 className="border-b border-paper/30 pb-2 font-mono text-sm uppercase tracking-[0.2em] text-paper/60">
              Contents
            </h4>
            <ul className="mt-4 space-y-2 font-mono text-sm uppercase tracking-wider">
              {[
                { name: "Home", href: "/" },
                { name: "Resources", href: "/blog" },
                { name: "Sections", href: "/categories" },
                { name: "About", href: "/about" },
              ].map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="inline-block py-1 text-paper/80 transition-colors hover:bg-paper hover:text-ink"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="border-b border-paper/30 pb-2 font-mono text-sm uppercase tracking-[0.2em] text-paper/60">
              Directory
            </h4>
            <div className="mt-4 flex gap-3">
              <Link
                href="#"
                aria-label="Twitter"
                className="border border-paper/40 p-2 text-paper/80 transition-colors hover:bg-paper hover:text-ink"
              >
                <Twitter className="h-5 w-5" />
              </Link>
              <Link
                href="#"
                aria-label="GitHub"
                className="border border-paper/40 p-2 text-paper/80 transition-colors hover:bg-paper hover:text-ink"
              >
                <Github className="h-5 w-5" />
              </Link>
              <Link
                href="#"
                aria-label="LinkedIn"
                className="border border-paper/40 p-2 text-paper/80 transition-colors hover:bg-paper hover:text-ink"
              >
                <Linkedin className="h-5 w-5" />
              </Link>
            </div>
          </div>
          </div>
        </div>

        <div className="mt-10 border-t border-paper/20 pt-6 text-center">
          <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-paper/50">
            © 2026 The Dead Good Club — printed in the cloud — all rights reserved
          </p>
        </div>
      </div>
    </footer>
  )
}
