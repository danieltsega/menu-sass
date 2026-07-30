"use client"

import { DishImage } from "@/components/menu/dish-image"
import type { Dish } from "@/types"

interface DishCardProps {
  dish: Dish
  categoryName?: string
  onClick?: () => void
}

export function DishCard({ dish, categoryName, onClick }: DishCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-xl bg-card text-card-foreground shadow-md overflow-hidden text-left w-full cursor-pointer hover:ring-2 hover:ring-primary/20 transition-all active:scale-[0.98]"
    >
      <div className="relative aspect-square">
        <DishImage
          src={dish.image}
          alt={dish.name}
          categoryName={categoryName}
          sizes="(max-width: 640px) 50vw, 33vw"
        />
      </div>
      <div className="p-3 space-y-1">
        <h3 className="font-semibold text-sm leading-tight line-clamp-1">
          {dish.name}
        </h3>
        <p className="text-sm font-medium text-primary">
          ETB {dish.price.toFixed(2)}
        </p>
      </div>
    </button>
  )
}
