export function SettingsSkeleton() {
  return (
    <div className="p-4 space-y-4 pb-24">
      <div className="h-6 w-32 bg-muted rounded animate-pulse" />

      <div className="rounded-xl border bg-card p-4 space-y-4">
        <div className="flex items-center gap-4">
          <div className="size-16 rounded-xl bg-muted animate-pulse" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-1/2 bg-muted rounded animate-pulse" />
            <div className="h-3 w-1/3 bg-muted rounded animate-pulse" />
          </div>
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-1.5">
              <div className="h-3 w-24 bg-muted rounded animate-pulse" />
              <div className="h-3 w-3/4 bg-muted rounded animate-pulse" />
            </div>
          ))}
        </div>
        <div className="h-9 w-full bg-muted rounded-lg animate-pulse" />
      </div>

      <div className="rounded-xl border bg-card p-4 space-y-4">
        <div className="h-4 w-36 bg-muted rounded animate-pulse" />
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-10 w-full bg-muted rounded-lg animate-pulse" />
          ))}
        </div>
        <div className="h-9 w-full bg-muted rounded-lg animate-pulse" />
      </div>
    </div>
  )
}
