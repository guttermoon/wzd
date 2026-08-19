"use client"

import Link from "next/link"
import { useState } from "react"
import { Menu, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface HeaderProps {
  categories?: string[]
}

export function Header({ categories = [] }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false)

  const homeSections = [
    { name: "The Cover", href: "/#cover" },
    { name: "The Birch Trail", href: "/#birch-trail" },
    { name: "Seeing Is Disbelieving", href: "/#seeing-is-disbelieving" },
    { name: "The Condon Report", href: "/#condon-report" },
    { name: "The Other Enemy", href: "/#other-enemy" },
    { name: "Bird Brains", href: "/#bird-brains" },
    { name: "Anatomical Anomalies", href: "/#anatomical-anomalies" },
    { name: "The Redacted Report", href: "/#redacted-report" },
    { name: "Signals From Space", href: "/#signals-from-space" },
    { name: "Environmental Quality", href: "/#environmental-quality" },
    { name: "Join the Club", href: "/#join-the-club" },
  ]

  const navigation = [
    { name: "Home", href: "/" },
    { name: "Resources", href: "/blog" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ]

  return (
    <header className="sticky top-0 z-50">
      {/* Thin light nav */}
      <div className="border-b border-ink/15 bg-[#F2F1EE] text-ink">
        <div className="container">
          <div className="flex h-14 items-center justify-between gap-4">
            <Link href="/" className="group flex min-w-0 items-baseline gap-3">
              <span className="font-display text-xl uppercase tracking-[0.08em] text-ink sm:text-2xl">
                The Dead Good Club
              </span>
              <span className="hidden font-mono text-[10px] uppercase tracking-[0.2em] text-ink/75 md:inline">
                A dead good periodical
              </span>
            </Link>

            {/* Desktop navigation */}
            <nav className="hidden items-center gap-1 md:flex">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="px-3 py-1 font-mono text-sm uppercase tracking-[0.14em] text-ink/80 transition-colors hover:bg-ink hover:text-paper"
                >
                  {item.name}
                </Link>
              ))}

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="h-auto rounded-none px-3 py-1 font-mono text-sm uppercase tracking-[0.14em] text-ink/80 hover:bg-ink hover:text-paper"
                  >
                    Sections
                    <ChevronDown className="ml-1 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="rounded-none border border-ink bg-paper font-mono uppercase tracking-wide shadow-clip">
                  {homeSections.map((section) => (
                    <DropdownMenuItem key={section.name} asChild>
                      <Link href={section.href}>{section.name}</Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </nav>

            {/* Mobile menu */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-none border border-ink/40 text-ink hover:bg-ink hover:text-paper"
                >
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="paper w-[85vw] max-w-sm border-l border-ink p-6"
              >
                <p className="font-display text-lg uppercase tracking-wide">
                  The Dead Good Club
                </p>
                <div className="rule-double mt-2" />
                <nav className="mt-6 flex flex-col gap-2">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className="border-b border-ink/20 px-1 py-3 font-mono text-base uppercase tracking-[0.14em] transition-colors hover:bg-mustard/40"
                    >
                      {item.name}
                    </Link>
                  ))}
                  <div className="mt-4">
                    <p className="font-mono text-xs uppercase tracking-[0.2em] text-ink/60">
                      Sections
                    </p>
                    <div className="mt-2 flex flex-col">
                      {homeSections.map((section) => (
                        <Link
                          key={section.name}
                          href={section.href}
                          onClick={() => setIsOpen(false)}
                          className="border-b border-ink/20 px-1 py-2 font-serif text-lg italic transition-colors hover:bg-mustard/40"
                        >
                          {section.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}
