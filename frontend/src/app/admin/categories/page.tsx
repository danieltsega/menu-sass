"use client"

import { Coffee, CakeSlice, Sunrise, GlassWater, MoreHorizontal } from "lucide-react"

const DUMMY_CATEGORIES = [
  { id: "cat1", name: "Coffee", icon: <Coffee className="size-5" />, dishes: 14 },
  { id: "cat2", name: "Pastries", icon: <CakeSlice className="size-5" />, dishes: 8 },
  { id: "cat3", name: "Breakfast", icon: <Sunrise className="size-5" />, dishes: 6 },
  { id: "cat4", name: "Cold Drinks", icon: <GlassWater className="size-5" />, dishes: 10 },
]

export default function CategoriesPage() {
  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">Menu Categories</h1>
          <p className="text-sm text-muted-foreground">{DUMMY_CATEGORIES.length} categories</p>
        </div>
        <button className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
          + Add Category
        </button>
      </div>

      <div className="space-y-2">
        {DUMMY_CATEGORIES.map((cat) => (
          <div key={cat.id} className="rounded-xl border bg-card p-4 flex items-center gap-3">
            <div className="size-10 rounded-lg bg-muted flex items-center justify-center shrink-0 text-muted-foreground">
              {cat.icon}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold">{cat.name}</p>
              <p className="text-xs text-muted-foreground">{cat.dishes} dishes</p>
            </div>
            <button className="text-muted-foreground">
              <MoreHorizontal className="size-5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
