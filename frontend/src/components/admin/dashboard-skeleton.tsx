export function DashboardSkeleton() {
  return (
    <div className="p-4 space-y-6">
      <div className="space-y-2">
        <div className="h-6 w-48 bg-muted rounded animate-pulse" />
        <div className="h-3.5 w-64 bg-muted rounded animate-pulse" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="rounded-xl border bg-card p-4 space-y-2 animate-pulse">
            <div className="h-3 w-24 bg-muted rounded" />
            <div className="h-7 w-16 bg-muted rounded" />
          </div>
        ))}
      </div>
    </div>
  )
}
