"use client"

import { useState } from "react"
import Image from "next/image"
import { useAuthStore } from "@/stores/auth-store"
import { Store, Loader2 } from "lucide-react"
import { AdminModal } from "@/components/admin/admin-modal"
import { CafeForm } from "@/components/admin/cafe-form"
import { ActionMenu } from "@/components/admin/action-menu"
import { ConfirmDialog } from "@/components/admin/confirm-dialog"
import { useCafes, useUsers, useCreateCafe, useUpdateCafe, useDeleteCafe, getErrorMessage } from "@/hooks/use-api"
import { resolveFileUrl } from "@/lib/api"
import type { ApiCafe } from "@/types/api"
import { toast } from "sonner"

interface EditingCafe {
  id: string
  name: string
  slug: string
  description?: string
  address?: string
  phone?: string
  admin?: string
  logo?: string
}

export default function CafesPage() {
  const user = useAuthStore((s) => s.user)
  const { data: cafes = [], isPending } = useCafes()
  const { data: users = [] } = useUsers()
  const createCafe = useCreateCafe()
  const updateCafe = useUpdateCafe()
  const deleteCafe = useDeleteCafe()

  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<EditingCafe | null>(null)
  const [deleting, setDeleting] = useState<ApiCafe | null>(null)

  if (user?.role !== "super_admin") {
    return <div className="p-4 text-center text-sm text-muted-foreground">Access restricted to super admins.</div>
  }

  const admins = users
    .filter((u) => u.isActive && u.role === "cafe_admin")
    .map((u) => ({ id: u._id, name: u.name }))

  const handleSubmit = async (data: { name: string; slug: string; description?: string; address?: string; phone?: string; admin?: string; logo?: string }) => {
    if (editing) {
      try {
        await updateCafe.mutateAsync({ id: editing.id, data: { name: data.name, slug: data.slug, description: data.description, address: data.address, phone: data.phone, logo: data.logo } })
        toast.success("Cafe updated")
      } catch (error) {
        toast.error(getErrorMessage(error))
        return
      }
    } else {
      if (!data.admin) {
        toast.error("Please select an admin user")
        return
      }
      try {
        await createCafe.mutateAsync(data)
        toast.success("Cafe created")
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
      await deleteCafe.mutateAsync(deleting._id)
      toast.success("Cafe removed")
    } catch (error) {
      toast.error(getErrorMessage(error))
    }
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

      {isPending ? (
        <div className="flex justify-center py-10 text-muted-foreground"><Loader2 className="size-5 animate-spin" /></div>
      ) : (
        <div className="space-y-2">
          {cafes.map((cafe) => (
            <div key={cafe._id} className="rounded-xl border bg-card p-4 flex items-center gap-3">
              <div className="size-10 rounded-lg bg-muted flex items-center justify-center shrink-0 overflow-hidden">
                {cafe.logo ? (
                  <Image src={resolveFileUrl(cafe.logo) ?? ""} alt={cafe.name} width={40} height={40} className="size-full object-cover" />) :
                  < Store className="size-5 text-muted-foreground" />
                }
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold truncate">{cafe.name}</p>
                  <span className={`size-1.5 rounded-full shrink-0 ${cafe.isActive ? "bg-emerald-500" : "bg-muted-foreground"}`} />
                </div>
                <p className="text-xs text-muted-foreground truncate">{cafe.adminName ?? "No admin"} · {cafe.dishCount ?? 0} dishes</p>
              </div>
              <ActionMenu
                actions={[
                  { label: "Edit", onClick: () => { setEditing({ id: cafe._id, name: cafe.name, slug: cafe.slug, description: cafe.description, address: cafe.address, phone: cafe.phone, admin: cafe.admin, logo: cafe.logo }); setModalOpen(true) } },
                  { label: cafe.isActive ? "Deactivate" : "Activate", onClick: () => updateCafe.mutateAsync({ id: cafe._id, data: { isActive: !cafe.isActive } }).then(() => toast.success(cafe.isActive ? "Cafe deactivated" : "Cafe activated")).catch((e) => toast.error(getErrorMessage(e))) },
                  { label: "Delete", onClick: () => setDeleting(cafe), destructive: true },
                ]}
              />
            </div>
          ))}
          {cafes.length === 0 && <p className="text-center text-sm text-muted-foreground py-8">No cafes yet</p>}
        </div>
      )}

      <AdminModal
        open={modalOpen}
        onOpenChange={(o) => { setModalOpen(o); if (!o) setEditing(null) }}
        title={editing ? "Edit Cafe" : "Add Cafe"}
        description={editing ? `Editing ${editing.name}` : "Create a new cafe"}
      >
        <CafeForm
          defaultValues={editing ?? undefined}
          admins={admins}
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