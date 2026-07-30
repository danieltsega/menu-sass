"use client"

import { Dialog, DialogContent } from "@/components/ui/dialog"
import { PlaceholderImage } from "@/components/menu/placeholder-image"
import { getCategoryIcon } from "@/components/menu/category-icons"
import { Star } from "lucide-react"
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
          {dish.image ? (
            <div
              className="w-full h-full bg-cover bg-center"
              style={{ backgroundImage: `url(${dish.image})` }}
            />
          ) : (
            <PlaceholderImage
              className="w-full h-full"
              icon={
                categoryName
                  ? getCategoryIcon(categoryName)
                  : undefined
              }
            />
          )}
          {dish.isFeatured && (
            <span className="absolute top-3 left-3 inline-flex items-center gap-1 rounded-full bg-primary px-3 py-1 text-[11px] font-medium text-primary-foreground">
              <Star className="size-3 fill-current" />
              Featured
            </span>
          )}
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
