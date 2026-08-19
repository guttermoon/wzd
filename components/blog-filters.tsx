"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { X } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface BlogFiltersProps {
  categories: string[]
  tags: string[]
}

export function BlogFilters({ categories, tags }: BlogFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [search, setSearch] = useState(searchParams.get("search") || "")

  const updateFilters = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value && value !== "all") {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    router.push(`/blog?${params.toString()}`)
  }

  const clearAllFilters = () => {
    setSearch("")
    router.push("/blog")
  }

  const activeFilters = [
    searchParams.get("category") && { key: "category", value: searchParams.get("category")! },
    searchParams.get("tag") && { key: "tag", value: searchParams.get("tag")! },
    searchParams.get("search") && { key: "search", value: searchParams.get("search")! },
  ].filter(Boolean) as { key: string; value: string }[]

  const selectTriggerClass =
    "w-full rounded-none border-0 border-b-2 border-ink/80 bg-transparent px-1 font-mono text-sm uppercase tracking-wider focus:ring-0 focus:ring-offset-0 sm:w-48"

  return (
    // full-width boxes stay unrotated — near-flat rotations rasterize as stepped borders
    <div className="clipping mb-10 bg-paper-2 p-5 sm:p-6">
      <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-ink/60">
        Reader&apos;s enquiry form
      </p>

      <div className="mt-4 flex flex-col gap-5 lg:flex-row lg:items-end">
        <label className="flex flex-1 flex-col gap-1">
          <span className="font-mono text-xs uppercase tracking-[0.18em] text-ink/70">
            Find:
          </span>
          <input
            placeholder="type your enquiry and press return"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                updateFilters("search", search || null)
              }
            }}
            className="fill-in h-10 w-full text-base text-ink placeholder:text-ink/35"
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="font-mono text-xs uppercase tracking-[0.18em] text-ink/70">
            Section:
          </span>
          <Select
            value={searchParams.get("category") || "all"}
            onValueChange={(value) => updateFilters("category", value)}
          >
            <SelectTrigger className={selectTriggerClass}>
              <SelectValue placeholder="All sections" />
            </SelectTrigger>
            <SelectContent className="rounded-none border border-ink bg-paper font-mono uppercase tracking-wide shadow-clip">
              <SelectItem value="all">All sections</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </label>

        <label className="flex flex-col gap-1">
          <span className="font-mono text-xs uppercase tracking-[0.18em] text-ink/70">
            Subject:
          </span>
          <Select
            value={searchParams.get("tag") || "all"}
            onValueChange={(value) => updateFilters("tag", value)}
          >
            <SelectTrigger className={selectTriggerClass}>
              <SelectValue placeholder="All subjects" />
            </SelectTrigger>
            <SelectContent className="rounded-none border border-ink bg-paper font-mono uppercase tracking-wide shadow-clip">
              <SelectItem value="all">All subjects</SelectItem>
              {tags.map((tag) => (
                <SelectItem key={tag} value={tag}>
                  {tag}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </label>

        <button
          onClick={() => updateFilters("search", search || null)}
          className="stamp stamp-cobalt self-start px-4 py-2 text-sm transition-transform hover:scale-[1.04] lg:self-auto"
        >
          Look it up
        </button>
      </div>

      {activeFilters.length > 0 && (
        <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-ink/30 pt-4">
          <span className="font-mono text-xs uppercase tracking-[0.18em] text-ink/60">
            On file:
          </span>
          {activeFilters.map((filter) => (
            <button
              key={`${filter.key}-${filter.value}`}
              onClick={() => updateFilters(filter.key, null)}
              className="stamp inline-flex items-center gap-1 px-2.5 py-1 text-[11px] transition-transform hover:scale-[1.05]"
              style={{ "--stamp-rot": "0deg" } as React.CSSProperties}
              aria-label={`Remove ${filter.key} filter ${filter.value}`}
            >
              {filter.key}: {filter.value}
              <X className="h-3 w-3" />
            </button>
          ))}
          <button
            onClick={clearAllFilters}
            className="font-mono text-xs uppercase tracking-[0.18em] text-press-red underline underline-offset-4 hover:bg-mustard/40"
          >
            Strike all
          </button>
        </div>
      )}
    </div>
  )
}
