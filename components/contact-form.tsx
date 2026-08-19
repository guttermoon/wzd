"use client"

import type React from "react"

import { useState } from "react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "@/hooks/use-toast"

const inquiryTypes = [
  { value: "general", label: "General enquiry" },
  { value: "partnership", label: "Partnership" },
  { value: "business", label: "Business opportunity" },
  { value: "press", label: "Press & media" },
]

export function ContactForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    subject: "",
    message: "",
    type: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Simulate form submission
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Message sent!",
        description: "We'll get back to you within 24 hours.",
      })

      setFormData({
        name: "",
        email: "",
        company: "",
        subject: "",
        message: "",
        type: "",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const labelClass =
    "font-mono text-xs uppercase tracking-[0.18em] text-ink/70"
  const inputClass =
    "fill-in h-10 w-full text-base text-ink placeholder:text-ink/35"

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <label className="flex flex-col gap-1">
          <span className={labelClass}>Your name *</span>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            required
            className={inputClass}
            placeholder="Jane Doe"
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className={labelClass}>Email address *</span>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            required
            className={inputClass}
            placeholder="jane@example.com"
          />
        </label>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <label className="flex flex-col gap-1">
          <span className={labelClass}>Company</span>
          <input
            type="text"
            value={formData.company}
            onChange={(e) => handleInputChange("company", e.target.value)}
            className={inputClass}
            placeholder="Optional"
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className={labelClass}>Nature of enquiry *</span>
          <Select
            value={formData.type}
            onValueChange={(value) => handleInputChange("type", value)}
          >
            <SelectTrigger className="w-full rounded-none border-0 border-b-2 border-ink/80 bg-transparent px-1 font-mono text-sm uppercase tracking-wider focus:ring-0 focus:ring-offset-0">
              <SelectValue placeholder="Select one" />
            </SelectTrigger>
            <SelectContent className="rounded-none border border-ink bg-paper font-mono uppercase tracking-wide shadow-clip">
              {inquiryTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </label>
      </div>

      <label className="flex flex-col gap-1">
        <span className={labelClass}>Subject *</span>
        <input
          type="text"
          value={formData.subject}
          onChange={(e) => handleInputChange("subject", e.target.value)}
          required
          className={inputClass}
          placeholder="What's this about?"
        />
      </label>

      <label className="flex flex-col gap-1">
        <span className={labelClass}>Your letter *</span>
        <textarea
          value={formData.message}
          onChange={(e) => handleInputChange("message", e.target.value)}
          required
          rows={6}
          className="fill-in w-full resize-none border border-ink/40 p-3 text-base leading-relaxed text-ink placeholder:text-ink/35"
          placeholder="Dear editor…"
        />
      </label>

      <button
        type="submit"
        disabled={isLoading}
        className="stamp px-6 py-3 text-base transition-transform hover:scale-[1.03] disabled:opacity-60"
      >
        {isLoading ? "Posting…" : "Post letter"}
      </button>
    </form>
  )
}
