"use client"

import { cn } from "@/lib/utils"
import { getCategoryIcon } from "@/components/menu/category-icons"

export function CategoryFilter({
  categories,
  activeCategory,
  onSelect,
}: {
  categories: { id: string; name: string }[]
  activeCategory: string
  onSelect: (id: string) => void
}) {
  return (
    <div className="sticky top-0 z-10 bg-background border-b">
      <div className="flex gap-2 overflow-x-auto px-4 py-3 scrollbar-hide">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => onSelect(cat.id)}
            className={cn(
              "shrink-0 inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
              activeCategory === cat.id
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            )}
          >
            {getCategoryIcon(cat.name)}
            {cat.name}
          </button>
        ))}
      </div>
    </div>
  )
}
