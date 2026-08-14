"use client"

import { useMenu } from "@/hooks/use-api"
import { MenuContent } from "@/components/menu/menu-content"
import { MenuSkeleton } from "@/components/menu/menu-skeleton"
import { resolveFileUrl } from "@/lib/api"
import type { ApiMenu } from "@/types/api"

function toMenuData(menu: ApiMenu) {
  return {
    cafe: {
      id: menu.cafe._id,
      name: menu.cafe.name,
      slug: menu.cafe.slug,
      description: menu.cafe.description,
      logo: resolveFileUrl(menu.cafe.logo),
      phone: menu.cafe.phone,
      address: menu.cafe.address,
    },
    categories: menu.categories.map((c) => ({
      id: c._id,
      name: c.name,
      description: c.description,
      displayOrder: c.displayOrder,
      dishes: c.dishes.map((d) => ({
        id: d._id,
        name: d.name,
        description: d.description,
        ingredients: d.ingredients,
        price: d.price,
        image: resolveFileUrl(d.image),
        isAvailable: d.isAvailable,
        isFeatured: d.isFeatured,
      })),
    })),
  }
}

export function CafeMenu({ cafeSlug }: { cafeSlug: string }) {
  const { data, isPending, isError } = useMenu(cafeSlug)

  if (isPending) return <MenuSkeleton />

  if (isError || !data) {
    return (
      <div className="max-w-lg mx-auto min-h-screen bg-background flex items-center justify-center p-8 text-center">
        <p className="text-sm text-muted-foreground">Menu not available for this cafe.</p>
      </div>
    )
  }

  return <MenuContent menu={toMenuData(data)} />
}