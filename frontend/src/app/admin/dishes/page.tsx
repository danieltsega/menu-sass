"use client"

import { useState } from "react"
import { UtensilsCrossed, Search, MoreHorizontal } from "lucide-react"

const ALL_DISHES = [
  { id: "d1", name: "Classic Espresso", category: "Coffee", price: 3.50, available: true },
  { id: "d2", name: "Cappuccino", category: "Coffee", price: 4.50, available: true },
  { id: "d3", name: "Iced Latte", category: "Coffee", price: 5.00, available: true },
  { id: "d4", name: "Croissant", category: "Pastries", price: 3.00, available: true },
  { id: "d5", name: "Blueberry Muffin", category: "Pastries", price: 3.50, available: true },
  { id: "d6", name: "Avocado Toast", category: "Breakfast", price: 8.00, available: true },
  { id: "d7", name: "Granola Bowl", category: "Breakfast", price: 7.50, available: false },
  { id: "d8", name: "Matcha Latte", category: "Cold Drinks", price: 5.50, available: true },
  { id: "d9", name: "Fresh Lemonade", category: "Cold Drinks", price: 4.00, available: true },
  { id: "d10", name: "Flat White", category: "Coffee", price: 4.80, available: true },
  { id: "d11", name: "Affogato", category: "Coffee", price: 5.00, available: false },
  { id: "d12", name: "Spanish Latte", category: "Coffee", price: 5.50, available: true },
  { id: "d13", name: "Cinnamon Roll", category: "Pastries", price: 4.50, available: true },
  { id: "d14", name: "Cold Brew", category: "Cold Drinks", price: 4.50, available: true },
]

const CATEGORIES = ["All", "Coffee", "Pastries", "Breakfast", "Cold Drinks"]

export default function DishesPage() {
  const [activeCategory, setActiveCategory] = useState("All")
  const [search, setSearch] = useState("")

  const filtered = ALL_DISHES.filter((d) => {
    const matchesCategory = activeCategory === "All" || d.category === activeCategory
    const matchesSearch = d.name.toLowerCase().includes(search.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <div className="p-4 space-y-4 pb-24">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">Dishes</h1>
          <p className="text-sm text-muted-foreground">{ALL_DISHES.length} total dishes</p>
        </div>
        <button className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
          + Add Dish
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search dishes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-lg border border-input bg-background pl-9 pr-3 py-2.5 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
      </div>

      <div className="flex gap-2 overflow-x-auto scrollbar-hide -mx-4 px-4 pb-2">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              activeCategory === cat
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-accent"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="space-y-2">
        {filtered.map((dish) => (
          <div key={dish.id} className="rounded-xl border bg-card p-4 flex items-center gap-3">
            <div className="size-10 rounded-lg bg-muted flex items-center justify-center shrink-0 text-muted-foreground">
              <UtensilsCrossed className="size-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-sm font-semibold truncate">{dish.name}</p>
                <span className={`size-1.5 rounded-full shrink-0 ${dish.available ? "bg-emerald-500" : "bg-muted-foreground"}`} />
              </div>
              <p className="text-xs text-muted-foreground">
                {dish.category} · ETB {dish.price.toFixed(2)}
              </p>
            </div>
            <button className="text-muted-foreground">
              <MoreHorizontal className="size-5" />
            </button>
          </div>
        ))}
        {filtered.length === 0 && (
          <p className="text-center text-sm text-muted-foreground py-8">No dishes found</p>
        )}
      </div>
    </div>
  )
}
