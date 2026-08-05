"use client"

import { useState } from "react"
import { useAuthStore } from "@/stores/auth-store"
import { AdminModal } from "@/components/admin/admin-modal"
import { UserForm } from "@/components/admin/user-form"
import { ActionMenu } from "@/components/admin/action-menu"
import { ConfirmDialog } from "@/components/admin/confirm-dialog"
import { useUsers, useCreateUser, useUpdateUser, useDeleteUser, getErrorMessage } from "@/hooks/use-api"
import type { ApiUser } from "@/types/api"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

interface EditingUser {
  id: string
  name: string
  email: string
  role: "super_admin" | "cafe_admin"
}

export default function UsersPage() {
  const currentUser = useAuthStore((s) => s.user)
  const { data: users = [], isPending } = useUsers()
  const createUser = useCreateUser()
  const updateUser = useUpdateUser()
  const deleteUser = useDeleteUser()

  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<EditingUser | null>(null)
  const [deleting, setDeleting] = useState<ApiUser | null>(null)

  if (currentUser?.role !== "super_admin") {
    return <div className="p-4 text-center text-sm text-muted-foreground">Access restricted to super admins.</div>
  }

  const handleSubmit = async (data: { name: string; email: string; password: string; role: "super_admin" | "cafe_admin" }) => {
    if (editing) {
      try {
        await updateUser.mutateAsync({ id: editing.id, data: { name: data.name, email: data.email, role: data.role } })
        toast.success("User updated")
      } catch (error) {
        toast.error(getErrorMessage(error))
        return
      }
    } else {
      try {
        await createUser.mutateAsync(data)
        toast.success("User created")
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
      await deleteUser.mutateAsync(deleting._id)
      toast.success("User removed")
    } catch (error) {
      toast.error(getErrorMessage(error))
    }
    setDeleting(null)
  }

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">Users</h1>
          <p className="text-sm text-muted-foreground">{users.length} registered users</p>
        </div>
        <button onClick={() => { setEditing(null); setModalOpen(true) }} className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
          + Add User
        </button>
      </div>

      {isPending ? (
        <div className="flex justify-center py-10 text-muted-foreground"><Loader2 className="size-5 animate-spin" /></div>
      ) : (
        <div className="space-y-2">
          {users.map((u) => (
            <div key={u._id} className="rounded-xl border bg-card p-4 flex items-center gap-3">
              <div className="size-10 rounded-full bg-muted flex items-center justify-center shrink-0 text-sm font-medium">
                {u.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">{u.name}</p>
                <p className="text-xs text-muted-foreground truncate">{u.email}</p>
              </div>
              <div className="text-right shrink-0">
                <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                  {u.role.replace("_", " ")}
                </span>
                {!u.isActive && (
                  <p className="text-[10px] font-medium text-destructive">Inactive</p>
                )}
              </div>
              <ActionMenu
                actions={[
                  { label: "Edit", onClick: () => { setEditing({ id: u._id, name: u.name, email: u.email, role: u.role }); setModalOpen(true) } },
                  { label: u.isActive ? "Deactivate" : "Activate", onClick: () => updateUser.mutateAsync({ id: u._id, data: { isActive: !u.isActive } }).then(() => toast.success(u.isActive ? "User deactivated" : "User activated")).catch((e) => toast.error(getErrorMessage(e))) },
                  { label: "Delete", onClick: () => setDeleting(u), destructive: true },
                ]}
              />
            </div>
          ))}
          {users.length === 0 && <p className="text-center text-sm text-muted-foreground py-8">No users yet</p>}
        </div>
      )}

      <AdminModal
        open={modalOpen}
        onOpenChange={(o) => { setModalOpen(o); if (!o) setEditing(null) }}
        title={editing ? "Edit User" : "Add User"}
        description={editing ? `Editing ${editing.name}` : "Create a new admin user"}
      >
        <UserForm
          defaultValues={editing ? { name: editing.name, email: editing.email, password: "", role: editing.role } : undefined}
          onSubmit={handleSubmit}
          onCancel={() => { setModalOpen(false); setEditing(null) }}
        />
      </AdminModal>

      <ConfirmDialog
        open={deleting !== null}
        onOpenChange={(o) => { if (!o) setDeleting(null) }}
        title="Delete User"
        message={`Are you sure you want to delete "${deleting?.name}"? They will lose access to the admin panel. This action cannot be undone.`}
        onConfirm={handleDelete}
      />
    </div>
  )
}