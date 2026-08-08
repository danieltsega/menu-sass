"use client"

import { useState } from "react"
import { DishCard } from "@/components/menu/dish-card"
import { DishDetailDialog } from "@/components/menu/dish-detail-dialog"
import type { Dish } from "@/types"

interface DishGridProps {
  dishes: Dish[]
  categoryName?: string
}

export function DishGrid({ dishes, categoryName }: DishGridProps) {
  const [selectedDish, setSelectedDish] = useState<Dish | null>(null)

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 px-4 pb-6 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 md:gap-4">
        {dishes.map((dish) => (
          <DishCard
            key={dish.id}
            dish={dish}
            categoryName={categoryName}
            onClick={() => setSelectedDish(dish)}
          />
        ))}
      </div>

      <DishDetailDialog
        dish={selectedDish}
        categoryName={categoryName}
        open={selectedDish !== null}
        onOpenChange={(open) => {
          if (!open) setSelectedDish(null)
        }}
      />
    </>
  )
}
