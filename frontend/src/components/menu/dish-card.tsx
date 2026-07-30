"use client"

import { cn } from "@/lib/utils"
import { PlaceholderImage } from "@/components/menu/placeholder-image"
import { getCategoryIcon } from "@/components/menu/category-icons"
import type { Dish } from "@/types"

interface DishCardProps {
  dish: Dish
  categoryName?: string
}

export function DishCard({ dish, categoryName }: DishCardProps) {
  return (
    <div
      className={cn(
        "rounded-xl bg-card text-card-foreground shadow-md overflow-hidden transition-opacity",
        !dish.isAvailable && "opacity-50"
      )}
    >
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
        {!dish.isAvailable && (
          <span className="absolute top-2 left-2 bg-destructive text-destructive-foreground text-[10px] font-medium px-2 py-0.5 rounded-full">
            Unavailable
          </span>
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
