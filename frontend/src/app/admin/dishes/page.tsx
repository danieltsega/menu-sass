"use client"

import { useState } from "react"
import { UtensilsCrossed, Search } from "lucide-react"
import { AdminModal } from "@/components/admin/admin-modal"
import { DishForm } from "@/components/admin/dish-form"
import { ActionMenu } from "@/components/admin/action-menu"
import { ConfirmDialog } from "@/components/admin/confirm-dialog"
import { toast } from "sonner"

interface DishItem {
  id: string
  name: string
  category: string
  categoryId: string
  price: number
  description?: string
  ingredients: string[]
  isAvailable: boolean
  isFeatured: boolean
}

const CATEGORIES = [
  { id: "cat1", name: "Coffee" },
  { id: "cat2", name: "Pastries" },
  { id: "cat3", name: "Breakfast" },
  { id: "cat4", name: "Cold Drinks" },
]

const CAT_NAMES = ["All", ...CATEGORIES.map((c) => c.name)]

const INITIAL: DishItem[] = [
  { id: "d1", name: "Classic Espresso", category: "Coffee", categoryId: "cat1", price: 3.50, ingredients: ["Arabica beans", "Filtered water"], isAvailable: true, isFeatured: true },
  { id: "d2", name: "Cappuccino", category: "Coffee", categoryId: "cat1", price: 4.50, ingredients: ["Espresso", "Whole milk", "Cinnamon"], isAvailable: true, isFeatured: false },
  { id: "d3", name: "Iced Latte", category: "Coffee", categoryId: "cat1", price: 5.00, ingredients: ["Espresso", "Cold milk", "Ice"], isAvailable: true, isFeatured: false },
  { id: "d4", name: "Croissant", category: "Pastries", categoryId: "cat2", price: 3.00, ingredients: ["Puff pastry", "Butter", "Egg wash"], isAvailable: true, isFeatured: true },
  { id: "d5", name: "Blueberry Muffin", category: "Pastries", categoryId: "cat2", price: 3.50, ingredients: ["Flour", "Blueberries", "Sugar", "Butter"], isAvailable: true, isFeatured: false },
  { id: "d6", name: "Avocado Toast", category: "Breakfast", categoryId: "cat3", price: 8.00, ingredients: ["Sourdough bread", "Avocado", "Cherry tomatoes"], isAvailable: true, isFeatured: true },
  { id: "d7", name: "Granola Bowl", category: "Breakfast", categoryId: "cat3", price: 7.50, ingredients: ["Greek yogurt", "Granola", "Mixed berries"], isAvailable: false, isFeatured: false },
  { id: "d8", name: "Matcha Latte", category: "Cold Drinks", categoryId: "cat4", price: 5.50, ingredients: ["Matcha powder", "Oat milk", "Vanilla syrup"], isAvailable: true, isFeatured: false },
  { id: "d9", name: "Fresh Lemonade", category: "Cold Drinks", categoryId: "cat4", price: 4.00, ingredients: ["Fresh lemon juice", "Sugar", "Mint"], isAvailable: true, isFeatured: false },
  { id: "d10", name: "Flat White", category: "Coffee", categoryId: "cat1", price: 4.80, ingredients: ["Double espresso", "Steamed milk"], isAvailable: true, isFeatured: false },
  { id: "d11", name: "Affogato", category: "Coffee", categoryId: "cat1", price: 5.00, ingredients: ["Vanilla gelato", "Double espresso"], isAvailable: false, isFeatured: false },
  { id: "d12", name: "Cinnamon Roll", category: "Pastries", categoryId: "cat2", price: 4.50, ingredients: ["Dough", "Cinnamon", "Sugar", "Cream cheese"], isAvailable: true, isFeatured: false },
  { id: "d13", name: "Cold Brew", category: "Cold Drinks", categoryId: "cat4", price: 4.50, ingredients: ["Cold brew coffee", "Filtered water"], isAvailable: true, isFeatured: false },
  { id: "d14", name: "Spanish Latte", category: "Coffee", categoryId: "cat1", price: 5.50, ingredients: ["Espresso", "Condensed milk", "Whole milk"], isAvailable: true, isFeatured: false },
]

export default function DishesPage() {
  const [dishes, setDishes] = useState(INITIAL)
  const [activeCategory, setActiveCategory] = useState("All")
  const [search, setSearch] = useState("")
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<DishItem | null>(null)
  const [deleting, setDeleting] = useState<DishItem | null>(null)

  const filtered = dishes.filter((d) => {
    const matchesCategory = activeCategory === "All" || d.category === activeCategory
    const matchesSearch = d.name.toLowerCase().includes(search.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const handleSubmit = (data: { name: string; price: number; category: string; description?: string; isAvailable?: boolean; isFeatured?: boolean; ingredients: string[] }) => {
    const cat = CATEGORIES.find((c) => c.id === data.category)
    const catName = cat?.name ?? "Unknown"

    if (editing) {
      setDishes(dishes.map((d) => d.id === editing.id ? { ...d, ...data, category: catName, categoryId: data.category, isAvailable: data.isAvailable ?? d.isAvailable, isFeatured: data.isFeatured ?? d.isFeatured } : d))
      toast.success("Dish updated")
    } else {
      const newDish: DishItem = { id: `d${Date.now()}`, ...data, category: catName, categoryId: data.category, isAvailable: data.isAvailable ?? true, isFeatured: data.isFeatured ?? false }
      setDishes([newDish, ...dishes])
      toast.success("Dish added")
    }
    setModalOpen(false)
    setEditing(null)
  }

  const handleDelete = () => {
    if (!deleting) return
    setDishes(dishes.filter((d) => d.id !== deleting.id))
    toast.success("Dish removed")
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
        {CAT_NAMES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              activeCategory === cat
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-accent"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="space-y-2">
        {filtered.map((dish) => (
          <div key={dish.id} className="rounded-xl border bg-card p-4 flex items-center gap-3">
            <div className="size-10 rounded-lg bg-muted flex items-center justify-center shrink-0 text-muted-foreground">
              <UtensilsCrossed className="size-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-sm font-semibold truncate">{dish.name}</p>
                <span className={`size-1.5 rounded-full shrink-0 ${dish.isAvailable ? "bg-emerald-500" : "bg-muted-foreground"}`} />
              </div>
              <p className="text-xs text-muted-foreground">{dish.category} · {dish.price.toFixed(2)} ETB</p>
            </div>
            <ActionMenu
              actions={[
                { label: "Edit", onClick: () => { setEditing(dish); setModalOpen(true) } },
                { label: "Delete", onClick: () => setDeleting(dish), destructive: true },
              ]}
            />
          </div>
        ))}
        {filtered.length === 0 && <p className="text-center text-sm text-muted-foreground py-8">No dishes found</p>}
      </div>

      <AdminModal
        open={modalOpen}
        onOpenChange={(o) => { setModalOpen(o); if (!o) setEditing(null) }}
        title={editing ? "Edit Dish" : "Add Dish"}
        description={editing ? `Editing ${editing.name}` : "Add a new dish to your menu"}
      >
        <DishForm
          categories={CATEGORIES}
          defaultValues={editing ? { name: editing.name, price: editing.price, category: editing.categoryId, description: editing.description, isAvailable: editing.isAvailable, isFeatured: editing.isFeatured, ingredients: editing.ingredients } : undefined}
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
