"use client"

import { useState } from "react"
import { Coffee, CakeSlice, Sunrise, GlassWater, Loader2 } from "lucide-react"
import { AdminModal } from "@/components/admin/admin-modal"
import { CategoryForm } from "@/components/admin/category-form"
import { ActionMenu } from "@/components/admin/action-menu"
import { ConfirmDialog } from "@/components/admin/confirm-dialog"
import { useCurrentCafeId } from "@/hooks/use-current-cafe"
import { useCategories, useDishes, useCreateCategory, useUpdateCategory, useDeleteCategory, getErrorMessage } from "@/hooks/use-api"
import type { ApiCategory } from "@/types/api"
import { toast } from "sonner"

const ICON_MAP: Record<string, React.ReactNode> = {
  Coffee: <Coffee className="size-5" />,
  Pastries: <CakeSlice className="size-5" />,
  Breakfast: <Sunrise className="size-5" />,
  "Cold Drinks": <GlassWater className="size-5" />,
}

interface EditingCategory {
  id: string
  name: string
  description?: string
  displayOrder: number
}

export default function CategoriesPage() {
  const cafeId = useCurrentCafeId()
  const { data: categories = [], isPending } = useCategories(cafeId)
  const { data: dishes = [] } = useDishes(cafeId)
  const createCategory = useCreateCategory(cafeId)
  const updateCategory = useUpdateCategory(cafeId)
  const deleteCategory = useDeleteCategory(cafeId)

  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<EditingCategory | null>(null)
  const [deleting, setDeleting] = useState<ApiCategory | null>(null)

  const dishCount = (categoryId: string) => dishes.filter((d) => d.category === categoryId).length

  const handleSubmit = async (data: { name: string; description?: string; displayOrder?: number }) => {
    if (editing) {
      try {
        await updateCategory.mutateAsync({ id: editing.id, data })
        toast.success("Category updated")
      } catch (error) {
        toast.error(getErrorMessage(error))
        return
      }
    } else {
      try {
        await createCategory.mutateAsync(data)
        toast.success("Category added")
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
      await deleteCategory.mutateAsync(deleting._id)
      toast.success("Category removed")
    } catch (error) {
      toast.error(getErrorMessage(error))
    }
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

      {isPending ? (
        <div className="flex justify-center py-10 text-muted-foreground"><Loader2 className="size-5 animate-spin" /></div>
      ) : (
        <div className="space-y-2">
          {categories.map((cat) => (
            <div key={cat._id} className="rounded-xl border bg-card p-4 flex items-center gap-3">
              <div className="size-10 rounded-lg bg-muted flex items-center justify-center shrink-0 text-muted-foreground">
                {ICON_MAP[cat.name] ?? <Coffee className="size-5" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold">{cat.name}</p>
                <p className="text-xs text-muted-foreground">{dishCount(cat._id)} dishes · Order {cat.displayOrder}</p>
              </div>
              <ActionMenu
                actions={[
                  { label: "Edit", onClick: () => { setEditing({ id: cat._id, name: cat.name, description: cat.description, displayOrder: cat.displayOrder }); setModalOpen(true) } },
                  { label: "Delete", onClick: () => setDeleting(cat), destructive: true },
                ]}
              />
            </div>
          ))}
          {categories.length === 0 && <p className="text-center text-sm text-muted-foreground py-8">No categories yet</p>}
        </div>
      )}

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