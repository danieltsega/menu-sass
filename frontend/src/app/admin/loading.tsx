export default function AdminLoading() {
  return (
    <div className="p-4 space-y-4">
      <div className="h-6 w-40 bg-muted rounded animate-pulse" />
      <div className="space-y-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="rounded-xl border bg-card p-4 flex items-center gap-3 animate-pulse">
            <div className="size-10 rounded-lg bg-muted shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-3.5 w-1/3 bg-muted rounded" />
              <div className="h-3 w-1/2 bg-muted rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
