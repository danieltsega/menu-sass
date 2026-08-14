"use client"

import { useState } from "react"
import { Loader2, ChevronDown } from "lucide-react"
import type { MenuData, Dish } from "@/types"
import { CafeHeader } from "@/components/menu/cafe-header"
import { CategoryFilter } from "@/components/menu/category-filter"
import { DishGrid } from "@/components/menu/dish-grid"
import { MenuFooter } from "@/components/menu/menu-footer"
import { fetchCategoryDishes, getErrorMessage } from "@/hooks/use-api"
import { resolveFileUrl } from "@/lib/api"
import type { ApiDish } from "@/types/api"
import { toast } from "sonner"

const DISH_PAGE_SIZE = 6

function toDish(d: ApiDish): Dish {
  return {
    id: d._id,
    name: d.name,
    description: d.description,
    ingredients: d.ingredients,
    price: d.price,
    image: resolveFileUrl(d.image),
    isAvailable: d.isAvailable,
    isFeatured: d.isFeatured,
  }
}

export function MenuContent({ menu }: { menu: MenuData }) {
  const [activeCategory, setActiveCategory] = useState(menu.categories[0].id)
  const [extraDishes, setExtraDishes] = useState<Record<string, Dish[]>>({})
  const [nextPages, setNextPages] = useState<Record<string, number>>({})
  const [loadingMore, setLoadingMore] = useState(false)

  const currentCategory = menu.categories.find((c) => c.id === activeCategory)

  const loadedDishes = currentCategory ? [...currentCategory.dishes, ...(extraDishes[currentCategory.id] ?? [])] : []
  const hasMore = currentCategory ? loadedDishes.length < currentCategory.dishCount : false

  const handleShowMore = async () => {
    if (!currentCategory || loadingMore) return
    setLoadingMore(true)
    const nextPage = nextPages[currentCategory.id] ?? 2
    try {
      const page = await fetchCategoryDishes(menu.cafe.slug, currentCategory.id, nextPage, DISH_PAGE_SIZE)
      setExtraDishes((prev) => ({
        ...prev,
        [currentCategory.id]: [...(prev[currentCategory.id] ?? []), ...page.map(toDish)],
      }))
      setNextPages((prev) => ({ ...prev, [currentCategory.id]: nextPage + 1 }))
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to load more dishes"))
    } finally {
      setLoadingMore(false)
    }
  }

  return (
    <div className="max-w-lg mx-auto min-h-screen bg-background flex flex-col md:max-w-2xl lg:max-w-4xl xl:max-w-5xl">
      <CafeHeader
        name={menu.cafe.name}
        phone={menu.cafe.phone}
        address={menu.cafe.address}
        logo={menu.cafe.logo}
      />

      <CategoryFilter
        categories={menu.categories.map((c) => ({ id: c.id, name: c.name }))}
        activeCategory={activeCategory}
        onSelect={setActiveCategory}
      />

      {currentCategory && loadedDishes.length > 0 && (
        <div className="pt-4">
          <DishGrid
            dishes={loadedDishes}
            categoryName={currentCategory.name}
          />
        </div>
      )}

      {hasMore && (
        <div className="flex justify-center pb-6">
          <button
            type="button"
            onClick={handleShowMore}
            disabled={loadingMore}
            className="inline-flex items-center gap-2 rounded-full border border-input bg-background px-5 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground disabled:opacity-60"
          >
            {loadingMore ? <Loader2 className="size-4 animate-spin" /> : <ChevronDown className="size-4" />}
            Show more
          </button>
        </div>
      )}

      <MenuFooter
        cafeName={menu.cafe.name}
        tagline={menu.cafe.description}
      />
    </div>
  )
}
