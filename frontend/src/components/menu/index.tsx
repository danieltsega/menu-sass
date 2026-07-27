"use client"

import { cn } from "@/lib/utils"
import { Store } from "lucide-react"

export function CafeHeader({
  name,
  description,
}: {
  name: string
  description?: string
}) {
  return (
    <div className="bg-primary text-primary-foreground px-4 pb-6 pt-12">
      <div className="flex items-center gap-3 mb-3">
        <div className="bg-primary-foreground/10 rounded-full p-2">
          <Store className="size-6" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight">{name}</h1>
      </div>
      {description && (
        <p className="text-primary-foreground/70 text-sm leading-relaxed">
          {description}
        </p>
      )}
    </div>
  )
}

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
              "shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
              activeCategory === cat.id
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-accent"
            )}
          >
            {cat.name}
          </button>
        ))}
      </div>
    </div>
  )
}

export function DishCard({
  name,
  description,
  ingredients,
  price,
  image,
  isAvailable,
}: {
  name: string
  description?: string
  ingredients: string[]
  price: number
  image?: string
  isAvailable: boolean
}) {
  return (
    <div
      className={cn(
        "flex gap-4 px-4 py-4 border-b last:border-b-0 transition-colors",
        !isAvailable && "opacity-50"
      )}
    >
      {image && (
        <div className="shrink-0 size-20 rounded-lg bg-muted overflow-hidden">
          <div
            className="w-full h-full bg-cover bg-center"
            style={{ backgroundImage: `url(${image})` }}
          />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-sm leading-tight">{name}</h3>
          <span className="shrink-0 font-semibold text-sm tabular-nums">
            ${price.toFixed(2)}
          </span>
        </div>
        {description && (
          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
            {description}
          </p>
        )}
        <p className="text-[11px] text-muted-foreground/60 mt-1">
          {ingredients.join(" · ")}
        </p>
        {!isAvailable && (
          <span className="inline-block mt-1 text-[11px] font-medium text-destructive">
            Currently unavailable
          </span>
        )}
      </div>
    </div>
  )
}