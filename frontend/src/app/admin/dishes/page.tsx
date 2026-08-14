"use client"

import { useState, useMemo, useCallback } from "react"
import Image from "next/image"
import { UtensilsCrossed, Search, GripVertical, Loader2, ChevronDown } from "lucide-react"
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  closestCenter,
  useDroppable,
  type DragStartEvent,
  type DragOverEvent,
  type DragEndEvent,
} from "@dnd-kit/core"
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { AdminModal } from "@/components/admin/admin-modal"
import { DishForm } from "@/components/admin/dish-form"
import { ActionMenu } from "@/components/admin/action-menu"
import { ConfirmDialog } from "@/components/admin/confirm-dialog"
import { ListSkeleton } from "@/components/admin/list-skeleton"
import { useCurrentCafeId } from "@/hooks/use-current-cafe"
import { useCategories, useDishesPaginated, useCreateDish, useUpdateDish, useDeleteDish, useReorderDishes, getErrorMessage } from "@/hooks/use-api"
import { resolveFileUrl } from "@/lib/api"
import type { ApiDish } from "@/types/api"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

interface EditingDish {
  id: string
  name: string
  price: number
  category: string
  description?: string
  image?: string
  ingredients: string[]
  isAvailable: boolean
  isFeatured: boolean
}

type ContainerMap = Record<string, string[]>

function CategoryDropZone({ id, name, children }: { id: string; name: string; children: React.ReactNode }) {
  const { setNodeRef } = useDroppable({ id })

  return (
    <div ref={setNodeRef} className="space-y-2">
      <h2 className="text-sm font-bold uppercase tracking-wide text-muted-foreground">{name}</h2>
      {children}
    </div>
  )
}

function SortableDishRow({ dish, onEdit, onDelete }: { dish: ApiDish; onEdit: () => void; onDelete: () => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: dish._id,
  })

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={cn(
        "rounded-xl border bg-card p-3 flex items-center gap-3",
        isDragging && "opacity-40 shadow-lg ring-2 ring-primary"
      )}
    >
      <button
        type="button"
        className="cursor-grab touch-none text-muted-foreground/60 hover:text-muted-foreground active:cursor-grabbing"
        {...attributes}
        {...listeners}
        aria-label="Drag to reorder"
      >
        <GripVertical className="size-5" />
      </button>
      <div className="size-10 rounded-lg bg-muted flex items-center justify-center shrink-0 text-muted-foreground overflow-hidden">
        {dish.image ? (
          <Image src={resolveFileUrl(dish.image) ?? ""} alt={dish.name} width={40} height={40} className="size-full object-cover" />
        ) : (
          <UtensilsCrossed className="size-5" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-sm font-semibold truncate">{dish.name}</p>
          <span className={cn("size-1.5 rounded-full shrink-0", dish.isAvailable ? "bg-emerald-500" : "bg-muted-foreground")} />
        </div>
        <p className="text-xs text-muted-foreground">{dish.price.toFixed(2)} ETB</p>
      </div>
      <ActionMenu
        actions={[
          { label: "Edit", onClick: onEdit },
          { label: "Delete", onClick: onDelete, destructive: true },
        ]}
      />
    </div>
  )
}

export default function DishesPage() {
  const cafeId = useCurrentCafeId()
  const { data: categories = [], isPending: categoriesPending } = useCategories(cafeId)
  const {
    data: dishPages,
    isPending: dishesPending,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useDishesPaginated(cafeId)
  const dishes = useMemo(() => dishPages?.pages.flatMap((p) => p.data ?? []) ?? [], [dishPages])
  const createDish = useCreateDish(cafeId)
  const updateDish = useUpdateDish(cafeId)
  const deleteDish = useDeleteDish(cafeId)
  const reorderDishes = useReorderDishes(cafeId)

  const [search, setSearch] = useState("")
  const [activeCategory, setActiveCategory] = useState<string>("All")
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<EditingDish | null>(null)
  const [deleting, setDeleting] = useState<ApiDish | null>(null)
  const [dragging, setDragging] = useState<ApiDish | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  )

  const dishesById = useMemo(() => {
    const map = new Map<string, ApiDish>()
    dishes.forEach((d) => map.set(d._id, d))
    return map
  }, [dishes])

  const categoryNameById = useMemo(() => {
    const map = new Map<string, string>()
    categories.forEach((c) => map.set(c._id, c.name))
    return map
  }, [categories])

  const groupKey = useCallback(
    (dish: ApiDish) => (categoryNameById.has(dish.category) ? dish.category : "__uncategorized__"),
    [categoryNameById]
  )

  const buildContainers = useCallback((list: ApiDish[]): ContainerMap => {
    const containers: ContainerMap = {}
    const orderedDishes = [...list].sort((a, b) => {
      if (a.displayOrder !== b.displayOrder) return a.displayOrder - b.displayOrder
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    })
    orderedDishes.forEach((dish) => {
      const key = groupKey(dish)
      if (!containers[key]) containers[key] = []
      containers[key].push(dish._id)
    })
    return containers
  }, [groupKey])

  const serverContainers = useMemo(() => buildContainers(dishes), [dishes, buildContainers])

  const [dragContainers, setDragContainers] = useState<ContainerMap | null>(null)
  const containers = dragContainers ?? serverContainers

  const isPending = categoriesPending || dishesPending

  const filtered = dishes.filter((d) => {
    const matchesSearch = d.name.toLowerCase().includes(search.toLowerCase())
    const matchesCategory = activeCategory === "All" || d.category === activeCategory
    return matchesSearch && matchesCategory
  })

  const containerOrder = useMemo(() => {
    const ids = new Set(Object.keys(containers))
    const ordered = categories
      .filter((c) => ids.has(c._id))
      .map((c) => c._id)
    if (ids.has("__uncategorized__")) ordered.push("__uncategorized__")
    return ordered
  }, [categories, containers])

  const handleDragStart = (event: DragStartEvent) => {
    const id = String(event.active.id)
    setDragging(dishesById.get(id) ?? null)
  }

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event
    if (!over) return
    const activeId = String(active.id)
    const overId = String(over.id)

    if (activeId === overId) return

    const current = dragContainers ?? serverContainers
    const overContainer = current[overId] ? overId : null
    const activeContainer = Object.keys(current).find((key) =>
      (current[key] ?? []).includes(activeId)
    )

    if (!overContainer || !activeContainer) return
    if (activeContainer === overContainer) return

    const activeItems = [...(current[activeContainer] ?? [])]
    const overItems = [...(current[overContainer] ?? [])]
    const oldIndex = activeItems.indexOf(activeId)
    const newIndex = overItems.length
    if (oldIndex >= 0) activeItems.splice(oldIndex, 1)
    overItems.splice(newIndex, 0, activeId)
    setDragContainers({
      ...current,
      [activeContainer]: activeItems,
      [overContainer]: overItems,
    })
  }

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event
    setDragging(null)

    if (!over) return
    const activeId = String(active.id)
    const overId = String(over.id)

    if (activeId === overId) {
      setDragContainers(null)
      return
    }

    const current = dragContainers ?? serverContainers
    const isOverItem = Object.keys(current).some((key) =>
      (current[key] ?? []).includes(overId)
    )

    let next = current
    if (isOverItem) {
      const activeContainer = Object.keys(current).find((key) =>
        (current[key] ?? []).includes(activeId)
      )
      const overContainer = Object.keys(current).find((key) =>
        (current[key] ?? []).includes(overId)
      )
      if (activeContainer && overContainer && activeContainer === overContainer) {
        const items = current[activeContainer]
        const oldIndex = items.indexOf(activeId)
        const newIndex = items.indexOf(overId)
        if (oldIndex >= 0 && newIndex >= 0) {
          next = { ...current, [activeContainer]: arrayMove(items, oldIndex, newIndex) }
        }
      }
    }

    const items: { id: string; category: string; displayOrder: number }[] = []
    Object.entries(next).forEach(([key, ids]) => {
      const category = key === "__uncategorized__" ? "" : key
      ids.forEach((id, index) => {
        const dish = dishesById.get(id)
        const target = category || (dish?.category ?? "")
        items.push({ id, category: target, displayOrder: index })
      })
    })

    const changedDishes = items.filter((item) => {
      const dish = dishesById.get(item.id)
      return !dish || dish.category !== item.category || dish.displayOrder !== item.displayOrder
    })

    if (changedDishes.length === 0) {
      setDragContainers(null)
      return
    }

    setDragContainers(next)
    try {
      await reorderDishes.mutateAsync(items)
      toast.success("Dish order updated")
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to reorder dishes"))
    } finally {
      setDragContainers(null)
    }
  }

  const handleSubmit = async (data: { name: string; price: number; category: string; description?: string; image?: string; isAvailable?: boolean; isFeatured?: boolean; ingredients: string[] }) => {
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

  const visibleIds = useMemo(() => new Set(filtered.map((d) => d._id)), [filtered])

  return (
    <div className="p-4 space-y-4 pb-24">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">Dishes</h1>
          <p className="text-sm text-muted-foreground">{dishPages?.pages[0]?.pagination?.total ?? 0} total dishes</p>
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

      <div className="flex gap-2 overflow-x-auto scrollbar-hide -mx-4 px-4 pb-1">
        <button
          onClick={() => setActiveCategory("All")}
          className={cn(
            "shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
            activeCategory === "All" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-accent"
          )}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat._id}
            onClick={() => setActiveCategory(cat._id)}
            className={cn(
              "shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
              activeCategory === cat._id ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-accent"
            )}
          >
            {cat.name}
          </button>
        ))}
      </div>

      <p className="text-xs text-muted-foreground">
        Drag dishes to reorder them or move them to another category.
      </p>

      {isPending ? (
        <ListSkeleton rows={5} />
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
          onDragCancel={() => { setDragging(null); setDragContainers(null) }}
        >
          <div className="space-y-4">
            {containerOrder.map((categoryId) => {
              const name = categoryId === "__uncategorized__" ? "Uncategorized" : (categoryNameById.get(categoryId) ?? "Category")
              const ids = (containers[categoryId] ?? []).filter((id) => visibleIds.has(id))
              return (
                <CategoryDropZone key={categoryId} id={categoryId} name={name}>
                  <SortableContext items={ids} strategy={verticalListSortingStrategy}>
                    <div className="space-y-2">
                      {ids.map((id) => {
                        const dish = dishesById.get(id)
                        if (!dish) return null
                        return (
                          <SortableDishRow
                            key={id}
                            dish={dish}
                            onEdit={() => {
                              setEditing({ id: dish._id, name: dish.name, price: dish.price, category: dish.category, description: dish.description, image: dish.image, ingredients: dish.ingredients, isAvailable: dish.isAvailable, isFeatured: dish.isFeatured })
                              setModalOpen(true)
                            }}
                            onDelete={() => setDeleting(dish)}
                          />
                        )
                      })}
                    </div>
                  </SortableContext>
                </CategoryDropZone>
              )
            })}
            {filtered.length === 0 && (
              <p className="text-center text-sm text-muted-foreground py-8">No dishes found</p>
            )}
          </div>

          <DragOverlay>
            {dragging ? (
              <div className="rounded-xl border bg-card p-3 flex items-center gap-3 shadow-lg">
                <div className="size-10 rounded-lg bg-muted flex items-center justify-center shrink-0 text-muted-foreground overflow-hidden">
                  {dragging.image ? (
                    <Image src={resolveFileUrl(dragging.image) ?? ""} alt={dragging.name} width={40} height={40} className="size-full object-cover" />
                  ) : (
                    <UtensilsCrossed className="size-5" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate">{dragging.name}</p>
                  <p className="text-xs text-muted-foreground">{dragging.price.toFixed(2)} ETB</p>
                </div>
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      )}

      {hasNextPage && (
        <div className="flex justify-center">
          <button
            type="button"
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            className="inline-flex items-center gap-2 rounded-full border border-input bg-background px-5 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground disabled:opacity-60"
          >
            {isFetchingNextPage ? <Loader2 className="size-4 animate-spin" /> : <ChevronDown className="size-4" />}
            Show more
          </button>
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
          defaultValues={editing ? { name: editing.name, price: editing.price, category: editing.category, description: editing.description, image: editing.image, isAvailable: editing.isAvailable, isFeatured: editing.isFeatured, ingredients: editing.ingredients } : undefined}
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
