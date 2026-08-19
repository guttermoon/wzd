export function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center py-16" role="status">
      <span className="animate-pulse font-mono text-sm uppercase tracking-[0.3em] text-ink/60">
        Setting type…
      </span>
    </div>
  )
}
