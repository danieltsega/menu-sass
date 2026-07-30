"use client"

import { DishCard } from "@/components/menu/dish-card"
import type { Dish } from "@/types"

interface DishGridProps {
  dishes: Dish[]
  categoryName?: string
}

export function DishGrid({ dishes, categoryName }: DishGridProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 px-4 pb-6">
      {dishes.map((dish) => (
        <DishCard key={dish.id} dish={dish} categoryName={categoryName} />
      ))}
    </div>
  )
}
