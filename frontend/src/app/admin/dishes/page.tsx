"use client"

import { useState } from "react"
import { UtensilsCrossed, Search, Loader2 } from "lucide-react"
import { AdminModal } from "@/components/admin/admin-modal"
import { DishForm } from "@/components/admin/dish-form"
import { ActionMenu } from "@/components/admin/action-menu"
import { ConfirmDialog } from "@/components/admin/confirm-dialog"
import { useCurrentCafeId } from "@/hooks/use-current-cafe"
import { useCategories, useDishes, useCreateDish, useUpdateDish, useDeleteDish, getErrorMessage } from "@/hooks/use-api"
import type { ApiDish } from "@/types/api"
import { toast } from "sonner"

interface EditingDish {
  id: string
  name: string
  price: number
  category: string
  description?: string
  ingredients: string[]
  isAvailable: boolean
  isFeatured: boolean
}

export default function DishesPage() {
  const cafeId = useCurrentCafeId()
  const { data: categories = [], isPending: categoriesPending } = useCategories(cafeId)
  const { data: dishes = [], isPending: dishesPending } = useDishes(cafeId)
  const createDish = useCreateDish(cafeId)
  const updateDish = useUpdateDish(cafeId)
  const deleteDish = useDeleteDish(cafeId)

  const [activeCategory, setActiveCategory] = useState("All")
  const [search, setSearch] = useState("")
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<EditingDish | null>(null)
  const [deleting, setDeleting] = useState<ApiDish | null>(null)

  const isPending = categoriesPending || dishesPending

  const filtered = dishes.filter((d) => {
    const cat = categories.find((c) => c._id === d.category)
    const catName = cat?.name ?? ""
    const matchesCategory = activeCategory === "All" || catName === activeCategory
    const matchesSearch = d.name.toLowerCase().includes(search.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const handleSubmit = async (data: { name: string; price: number; category: string; description?: string; isAvailable?: boolean; isFeatured?: boolean; ingredients: string[] }) => {
    if (editing) {
      try {
        await updateDish.mutateAsync({ id: editing.id, data })
        toast.success("Dish updated")
      } catch (error) {
        toast.error(getErrorMessage(error))
        return
      }
    } else {
      try {
        await createDish.mutateAsync(data)
        toast.success("Dish added")
      } catch (error) {
        toast.error(getErrorMessage(error))
        return
      }
    }
    setModalOpen(false)
    setEditing(null)
  }

  const handleDelete = async () => {
    if (!deleting) return
    try {
      await deleteDish.mutateAsync(deleting._id)
      toast.success("Dish removed")
    } catch (error) {
      toast.error(getErrorMessage(error))
    }
    setDeleting(null)
  }

  return (
    <div className="p-4 space-y-4 pb-24">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">Dishes</h1>
          <p className="text-sm text-muted-foreground">{dishes.length} total dishes</p>
        </div>
        <button onClick={() => { setEditing(null); setModalOpen(true) }} className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
          + Add Dish
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search dishes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-lg border border-input bg-background pl-9 pr-3 py-2.5 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
      </div>

      <div className="flex gap-2 overflow-x-auto scrollbar-hide -mx-4 px-4 pb-2">
        <button
          onClick={() => setActiveCategory("All")}
          className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
            activeCategory === "All" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-accent"
          }`}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat._id}
            onClick={() => setActiveCategory(cat.name)}
            className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              activeCategory === cat.name ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-accent"
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {isPending ? (
        <div className="flex justify-center py-10 text-muted-foreground"><Loader2 className="size-5 animate-spin" /></div>
      ) : (
        <div className="space-y-2">
          {filtered.map((dish) => {
            const catName = categories.find((c) => c._id === dish.category)?.name ?? "Uncategorized"
            return (
              <div key={dish._id} className="rounded-xl border bg-card p-4 flex items-center gap-3">
                <div className="size-10 rounded-lg bg-muted flex items-center justify-center shrink-0 text-muted-foreground">
                  <UtensilsCrossed className="size-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold truncate">{dish.name}</p>
                    <span className={`size-1.5 rounded-full shrink-0 ${dish.isAvailable ? "bg-emerald-500" : "bg-muted-foreground"}`} />
                  </div>
                  <p className="text-xs text-muted-foreground">{catName} · {dish.price.toFixed(2)} ETB</p>
                </div>
                <ActionMenu
                  actions={[
                    { label: "Edit", onClick: () => { setEditing({ id: dish._id, name: dish.name, price: dish.price, category: dish.category, description: dish.description, ingredients: dish.ingredients, isAvailable: dish.isAvailable, isFeatured: dish.isFeatured }); setModalOpen(true) } },
                    { label: "Delete", onClick: () => setDeleting(dish), destructive: true },
                  ]}
                />
              </div>
            )
          })}
          {filtered.length === 0 && <p className="text-center text-sm text-muted-foreground py-8">No dishes found</p>}
        </div>
      )}

      <AdminModal
        open={modalOpen}
        onOpenChange={(o) => { setModalOpen(o); if (!o) setEditing(null) }}
        title={editing ? "Edit Dish" : "Add Dish"}
        description={editing ? `Editing ${editing.name}` : "Add a new dish to your menu"}
      >
        <DishForm
          categories={categories.map((c) => ({ id: c._id, name: c.name }))}
          defaultValues={editing ? { name: editing.name, price: editing.price, category: editing.category, description: editing.description, isAvailable: editing.isAvailable, isFeatured: editing.isFeatured, ingredients: editing.ingredients } : undefined}
          onSubmit={handleSubmit}
          onCancel={() => { setModalOpen(false); setEditing(null) }}
        />
      </AdminModal>

      <ConfirmDialog
        open={deleting !== null}
        onOpenChange={(o) => { if (!o) setDeleting(null) }}
        title="Delete Dish"
        message={`Are you sure you want to delete "${deleting?.name}"? This action cannot be undone.`}
        onConfirm={handleDelete}
      />
    </div>
  )
}