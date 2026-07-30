"use client"

import { useState } from "react"
import type { MenuData } from "@/types"
import { CafeHeader } from "@/components/menu/cafe-header"
import { CategoryFilter } from "@/components/menu/category-filter"
import { DishGrid } from "@/components/menu/dish-grid"

export function MenuContent({ menu }: { menu: MenuData }) {
  const [activeCategory, setActiveCategory] = useState(menu.categories[0].id)

  const currentCategory = menu.categories.find((c) => c.id === activeCategory)

  return (
    <div className="max-w-lg mx-auto min-h-screen bg-background">
      <CafeHeader name={menu.cafe.name} description={menu.cafe.description} />

      <CategoryFilter
        categories={menu.categories.map((c) => ({ id: c.id, name: c.name }))}
        activeCategory={activeCategory}
        onSelect={setActiveCategory}
      />

      {currentCategory && currentCategory.dishes.length > 0 && (
        <div className="pt-4">
          <DishGrid
            dishes={currentCategory.dishes}
            categoryName={currentCategory.name}
          />
        </div>
      )}
    </div>
  )
}
