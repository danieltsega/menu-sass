"use client"

import { useState } from "react"
import type { MenuData } from "@/types"
import { CafeHeader } from "@/components/menu/cafe-header"
import { CategoryFilter } from "@/components/menu/category-filter"
import { DishGrid } from "@/components/menu/dish-grid"
import { MenuFooter } from "@/components/menu/menu-footer"

export function MenuContent({ menu }: { menu: MenuData }) {
  const [activeCategory, setActiveCategory] = useState(menu.categories[0].id)

  const currentCategory = menu.categories.find((c) => c.id === activeCategory)

  return (
    <div className="max-w-lg mx-auto min-h-screen bg-background flex flex-col">
      <CafeHeader name={menu.cafe.name} phone={menu.cafe.phone} logo={menu.cafe.logo} />

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

      <MenuFooter
        cafeName={menu.cafe.name}
        tagline={menu.cafe.description}
      />
    </div>
  )
}
