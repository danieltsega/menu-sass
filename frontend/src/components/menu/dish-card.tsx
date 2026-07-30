"use client"

import { PlaceholderImage } from "@/components/menu/placeholder-image"
import { getCategoryIcon } from "@/components/menu/category-icons"
import type { Dish } from "@/types"

interface DishCardProps {
  dish: Dish
  categoryName?: string
}

export function DishCard({ dish, categoryName }: DishCardProps) {
  return (
    <div className="rounded-xl bg-card text-card-foreground shadow-md overflow-hidden">
      <div className="relative aspect-square">
        {dish.image ? (
          <div
            className="w-full h-full bg-cover bg-center"
            style={{ backgroundImage: `url(${dish.image})` }}
          />
        ) : (
          <PlaceholderImage
            className="w-full h-full"
            icon={categoryName ? getCategoryIcon(categoryName) : undefined}
          />
        )}
      </div>
      <div className="p-3 space-y-1">
        <h3 className="font-semibold text-sm leading-tight line-clamp-1">
          {dish.name}
        </h3>
        <p className="text-sm font-medium text-primary">
          ETB {dish.price.toFixed(2)}
        </p>
      </div>
    </div>
  )
}
