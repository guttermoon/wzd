"use client"

import { useEffect, useRef, useState } from "react"

/**
 * The "Channel 56" spoof news broadcast.
 *
 * This clip contains rapid television static: measured at six large
 * luminance swings inside one second, which exceeds the three-per-second
 * limit in WCAG 2.3.1. So it never autoplays, it is labelled as flashing
 * before anyone starts it, and it stays a modest size rather than filling
 * the viewport. Nothing moves until the visitor asks it to.
 */
export function Broadcast({
  warning,
  label,
}: {
  warning: string
  label: string
}) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [playing, setPlaying] = useState(false)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    const sync = () => setPlaying(!video.paused)
    video.addEventListener("play", sync)
    video.addEventListener("pause", sync)
    video.addEventListener("ended", sync)
    return () => {
      video.removeEventListener("play", sync)
      video.removeEventListener("pause", sync)
      video.removeEventListener("ended", sync)
    }
  }, [])

  const toggle = () => {
    const video = videoRef.current
    if (!video) return
    if (video.paused) void video.play()
    else video.pause()
  }

  return (
    <div className="max-w-[600px]">
      <p className="mb-3 border-2 border-accent px-3 py-2 font-body text-sm font-semibold text-text">
        ⚠ {warning}
      </p>
      <video
        ref={videoRef}
        // Deliberately no autoPlay and no loop: see the note above.
        muted
        playsInline
        controls
        preload="none"
        poster="/video/world-zombie-poster.jpg"
        aria-label={label}
        className="w-full border-2 border-rule"
      >
        <source src="/video/world-zombie.webm" type="video/webm" />
        <source src="/video/world-zombie.mp4" type="video/mp4" />
        {label}
      </video>
      <button type="button" onClick={toggle} className="btn btn-secondary mt-3 text-sm">
        {playing ? "Pause" : "Play"}
        <span className="sr-only"> the Channel 56 broadcast</span>
      </button>
    </div>
  )
}
