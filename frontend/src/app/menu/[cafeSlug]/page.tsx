"use client"

import { useState } from "react"
import { dummyMenu } from "@/lib/dummy-data"
import { CafeHeader, CategoryFilter, DishCard } from "@/components/menu"

export default function MenuPage({ params }: { params: { cafeSlug: string } }) {
  const [activeCategory, setActiveCategory] = useState(dummyMenu.categories[0].id)

  const menu = dummyMenu
  const currentCategory = menu.categories.find((c) => c.id === activeCategory)

  return (
    <div className="max-w-lg mx-auto min-h-screen bg-background">
      <CafeHeader name={menu.cafe.name} description={menu.cafe.description} />

      <CategoryFilter
        categories={menu.categories.map((c) => ({ id: c.id, name: c.name }))}
        activeCategory={activeCategory}
        onSelect={setActiveCategory}
      />

      <div className="divide-y-0">
        {currentCategory && (
          <div>
            {currentCategory.dishes.length > 0 && (
              <div className="text-xs font-medium text-muted-foreground px-4 pt-3 pb-1">
                {currentCategory.name}
              </div>
            )}
            {currentCategory.dishes.map((dish) => (
              <DishCard key={dish.id} {...dish} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}