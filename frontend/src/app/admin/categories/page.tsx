"use client"

import { useState } from "react"
import { Coffee, CakeSlice, Sunrise, GlassWater } from "lucide-react"
import { AdminModal } from "@/components/admin/admin-modal"
import { CategoryForm } from "@/components/admin/category-form"
import { ActionMenu } from "@/components/admin/action-menu"
import { ConfirmDialog } from "@/components/admin/confirm-dialog"
import { toast } from "sonner"

interface CategoryItem {
  id: string
  name: string
  description?: string
  displayOrder: number
  dishes: number
}

const ICON_MAP: Record<string, React.ReactNode> = {
  Coffee: <Coffee className="size-5" />,
  Pastries: <CakeSlice className="size-5" />,
  Breakfast: <Sunrise className="size-5" />,
  "Cold Drinks": <GlassWater className="size-5" />,
}

const INITIAL: CategoryItem[] = [
  { id: "cat1", name: "Coffee", description: "Handcrafted espresso drinks", displayOrder: 1, dishes: 14 },
  { id: "cat2", name: "Pastries", description: "Freshly baked daily", displayOrder: 2, dishes: 8 },
  { id: "cat3", name: "Breakfast", description: "Served all day", displayOrder: 3, dishes: 6 },
  { id: "cat4", name: "Cold Drinks", description: "Refreshing beverages", displayOrder: 4, dishes: 10 },
]

export default function CategoriesPage() {
  const [categories, setCategories] = useState(INITIAL)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<CategoryItem | null>(null)
  const [deleting, setDeleting] = useState<CategoryItem | null>(null)

  const handleSubmit = (data: { name: string; description?: string; displayOrder?: number }) => {
    if (editing) {
      setCategories(categories.map((c) => c.id === editing.id ? { ...c, ...data } : c))
      toast.success("Category updated")
    } else {
      const newCat: CategoryItem = { id: `cat${Date.now()}`, ...data, dishes: 0, displayOrder: data.displayOrder ?? 0 }
      setCategories([...categories, newCat])
      toast.success("Category added")
    }
    setModalOpen(false)
    setEditing(null)
  }

  const handleDelete = () => {
    if (!deleting) return
    setCategories(categories.filter((c) => c.id !== deleting.id))
    toast.success("Category removed")
    setDeleting(null)
  }

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">Menu Categories</h1>
          <p className="text-sm text-muted-foreground">{categories.length} categories</p>
        </div>
        <button onClick={() => { setEditing(null); setModalOpen(true) }} className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
          + Add Category
        </button>
      </div>

      <div className="space-y-2">
        {categories.map((cat) => (
          <div key={cat.id} className="rounded-xl border bg-card p-4 flex items-center gap-3">
            <div className="size-10 rounded-lg bg-muted flex items-center justify-center shrink-0 text-muted-foreground">
              {ICON_MAP[cat.name] ?? <Coffee className="size-5" />}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold">{cat.name}</p>
              <p className="text-xs text-muted-foreground">{cat.dishes} dishes · Order {cat.displayOrder}</p>
            </div>
            <ActionMenu
              actions={[
                { label: "Edit", onClick: () => { setEditing(cat); setModalOpen(true) } },
                { label: "Delete", onClick: () => setDeleting(cat), destructive: true },
              ]}
            />
          </div>
        ))}
      </div>

      <AdminModal
        open={modalOpen}
        onOpenChange={(o) => { setModalOpen(o); if (!o) setEditing(null) }}
        title={editing ? "Edit Category" : "Add Category"}
        description={editing ? `Editing ${editing.name}` : "Create a new menu category"}
      >
        <CategoryForm
          defaultValues={editing ?? undefined}
          onSubmit={handleSubmit}
          onCancel={() => { setModalOpen(false); setEditing(null) }}
        />
      </AdminModal>

      <ConfirmDialog
        open={deleting !== null}
        onOpenChange={(o) => { if (!o) setDeleting(null) }}
        title="Delete Category"
        message={`Are you sure you want to delete "${deleting?.name}"? All dishes in this category will also be removed. This action cannot be undone.`}
        onConfirm={handleDelete}
      />
    </div>
  )
}
