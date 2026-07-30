"use client"

import { useState } from "react"
import Image from "next/image"
import { useAuthStore } from "@/stores/auth-store"
import { Store } from "lucide-react"
import { AdminModal } from "@/components/admin/admin-modal"
import { CafeForm } from "@/components/admin/cafe-form"
import { ActionMenu } from "@/components/admin/action-menu"
import { ConfirmDialog } from "@/components/admin/confirm-dialog"
import { toast } from "sonner"

interface CafeItem {
  id: string
  name: string
  slug: string
  description?: string
  address?: string
  phone?: string
  logo?: string
  admin: string
  dishes: number
  active: boolean
}

const INITIAL: CafeItem[] = [
  { id: "c1", name: "Brew & Bean", slug: "brew-and-bean", description: "Artisan coffee & homemade pastries", admin: "Cafe Owner", dishes: 14, active: true, logo: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=48&h=48&fit=crop" },
  { id: "c2", name: "Green Garden Bistro", slug: "green-garden-bistro", admin: "Solomon A.", dishes: 22, active: true },
  { id: "c3", name: "Pizza Piazza", slug: "pizza-piazza", admin: "Meron T.", dishes: 18, active: true },
  { id: "c4", name: "Taste of India", slug: "taste-of-india", admin: "Raj K.", dishes: 30, active: true },
  { id: "c5", name: "Sushi Zen", slug: "sushi-zen", admin: "Yuki M.", dishes: 25, active: false },
]

export default function CafesPage() {
  const user = useAuthStore((s) => s.user)
  const [cafes, setCafes] = useState(INITIAL)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<CafeItem | null>(null)
  const [deleting, setDeleting] = useState<CafeItem | null>(null)

  if (user?.role !== "super_admin") {
    return <div className="p-4 text-center text-sm text-muted-foreground">Access restricted to super admins.</div>
  }

  const handleSubmit = (data: { name: string; slug: string; description?: string; address?: string; phone?: string; logo?: string }) => {
    if (editing) {
      setCafes(cafes.map((c) => c.id === editing.id ? { ...c, ...data } : c))
      toast.success("Cafe updated")
    } else {
      const newCafe: CafeItem = { id: `c${Date.now()}`, ...data, admin: user.name, dishes: 0, active: true }
      setCafes([newCafe, ...cafes])
      toast.success("Cafe created")
    }
    setModalOpen(false)
    setEditing(null)
  }

  const handleDelete = () => {
    if (!deleting) return
    setCafes(cafes.filter((c) => c.id !== deleting.id))
    toast.success("Cafe removed")
    setDeleting(null)
  }

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">Cafes</h1>
          <p className="text-sm text-muted-foreground">{cafes.length} registered cafes</p>
        </div>
        <button onClick={() => { setEditing(null); setModalOpen(true) }} className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
          + Add Cafe
        </button>
      </div>

      <div className="space-y-2">
        {cafes.map((cafe) => (
          <div key={cafe.id} className="rounded-xl border bg-card p-4 flex items-center gap-3">
            <div className="size-10 rounded-lg bg-muted flex items-center justify-center shrink-0 overflow-hidden">
              {cafe.logo ? (
                <Image src={cafe.logo} alt={cafe.name} width={40} height={40} className="size-full object-cover" />
              ) : (
                <Store className="size-5 text-muted-foreground" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-sm font-semibold truncate">{cafe.name}</p>
                <span className={`size-1.5 rounded-full shrink-0 ${cafe.active ? "bg-emerald-500" : "bg-muted-foreground"}`} />
              </div>
              <p className="text-xs text-muted-foreground truncate">{cafe.admin} · {cafe.dishes} dishes</p>
            </div>
            <ActionMenu
              actions={[
                { label: "Edit", onClick: () => { setEditing(cafe); setModalOpen(true) } },
                { label: "Delete", onClick: () => setDeleting(cafe), destructive: true },
              ]}
            />
          </div>
        ))}
      </div>

      <AdminModal
        open={modalOpen}
        onOpenChange={(o) => { setModalOpen(o); if (!o) setEditing(null) }}
        title={editing ? "Edit Cafe" : "Add Cafe"}
        description={editing ? `Editing ${editing.name}` : "Create a new cafe"}
      >
        <CafeForm
          defaultValues={editing ?? undefined}
          onSubmit={handleSubmit}
          onCancel={() => { setModalOpen(false); setEditing(null) }}
        />
      </AdminModal>

      <ConfirmDialog
        open={deleting !== null}
        onOpenChange={(o) => { if (!o) setDeleting(null) }}
        title="Delete Cafe"
        message={`Are you sure you want to delete "${deleting?.name}"? This will also remove all its categories and dishes. This action cannot be undone.`}
        onConfirm={handleDelete}
      />
    </div>
  )
}
