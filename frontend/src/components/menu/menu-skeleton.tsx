export function MenuSkeleton() {
  return (
    <div className="max-w-lg mx-auto min-h-screen bg-background flex flex-col md:max-w-2xl lg:max-w-4xl xl:max-w-5xl">
      <div className="flex items-center gap-3 px-4 py-5 border-b">
        <div className="size-12 rounded-full bg-muted animate-pulse" />
        <div className="space-y-2 flex-1">
          <div className="h-4 w-40 bg-muted rounded animate-pulse" />
          <div className="h-3 w-64 bg-muted rounded animate-pulse" />
        </div>
      </div>

      <div className="flex gap-2 px-4 py-3 overflow-hidden">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-9 w-24 bg-muted rounded-full animate-pulse shrink-0" />
        ))}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 px-4 py-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 md:gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="rounded-2xl overflow-hidden animate-pulse">
            <div className="aspect-[4/3] bg-muted" />
            <div className="space-y-2 p-3">
              <div className="h-3 w-3/4 bg-muted rounded" />
              <div className="h-3 w-1/2 bg-muted rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}