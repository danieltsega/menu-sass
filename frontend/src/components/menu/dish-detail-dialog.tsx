"use client"

import { Dialog, DialogContent } from "@/components/ui/dialog"
import { DishImage } from "@/components/menu/dish-image"
import type { Dish } from "@/types"

interface DishDetailDialogProps {
  dish: Dish | null
  categoryName?: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function DishDetailDialog({
  dish,
  categoryName,
  open,
  onOpenChange,
}: DishDetailDialogProps) {
  if (!dish) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <div className="relative aspect-square rounded-t-2xl overflow-hidden">
          <DishImage
            src={dish.image}
            alt={dish.name}
            categoryName={categoryName}
            sizes="(max-width: 640px) 100vw, 384px"
          />
        </div>

        <div className="p-5 space-y-4">
          <div className="space-y-1">
            <h2 className="text-xl font-bold leading-tight">{dish.name}</h2>
            <p className="text-lg font-semibold text-primary">
              ETB {dish.price.toFixed(2)}
            </p>
          </div>

          {dish.description && (
            <p className="text-sm text-muted-foreground leading-relaxed">
              {dish.description}
            </p>
          )}

          {dish.ingredients.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Ingredients
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {dish.ingredients.map((ingredient) => (
                  <span
                    key={ingredient}
                    className="rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground"
                  >
                    {ingredient}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
