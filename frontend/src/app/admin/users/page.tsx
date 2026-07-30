"use client"

import { useState } from "react"
import { useAuthStore } from "@/stores/auth-store"
import { AdminModal } from "@/components/admin/admin-modal"
import { UserForm } from "@/components/admin/user-form"
import { ActionMenu } from "@/components/admin/action-menu"
import { toast } from "sonner"

interface UserItem {
  id: string
  name: string
  email: string
  role: "super_admin" | "cafe_admin"
  cafe?: string
}

const INITIAL: UserItem[] = [
  { id: "u1", name: "Admin User", email: "admin@menusass.com", role: "super_admin" },
  { id: "u2", name: "Cafe Owner", email: "cafe@brewbean.com", role: "cafe_admin", cafe: "Brew & Bean" },
  { id: "u3", name: "Solomon A.", email: "solomon@greengarden.com", role: "cafe_admin", cafe: "Green Garden Bistro" },
  { id: "u4", name: "Meron T.", email: "meron@pizzapiazza.com", role: "cafe_admin", cafe: "Pizza Piazza" },
  { id: "u5", name: "Raj K.", email: "raj@tasteofindia.com", role: "cafe_admin", cafe: "Taste of India" },
]

export default function UsersPage() {
  const currentUser = useAuthStore((s) => s.user)
  const [users, setUsers] = useState(INITIAL)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<UserItem | null>(null)

  if (currentUser?.role !== "super_admin") {
    return <div className="p-4 text-center text-sm text-muted-foreground">Access restricted to super admins.</div>
  }

  const handleSubmit = (data: { name: string; email: string; password: string; role: "super_admin" | "cafe_admin" }) => {
    if (editing) {
      setUsers(users.map((u) => u.id === editing.id ? { ...u, name: data.name, email: data.email, role: data.role } : u))
      toast.success("User updated")
    } else {
      const newUser: UserItem = { id: `u${Date.now()}`, name: data.name, email: data.email, role: data.role }
      setUsers([newUser, ...users])
      toast.success("User created")
    }
    setModalOpen(false)
    setEditing(null)
  }

  const handleDelete = (id: string) => {
    setUsers(users.filter((u) => u.id !== id))
    toast.success("User removed")
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

      <div className="space-y-2">
        {users.map((u) => (
          <div key={u.id} className="rounded-xl border bg-card p-4 flex items-center gap-3">
            <div className="size-10 rounded-full bg-muted flex items-center justify-center shrink-0 text-sm font-medium">
              {u.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate">{u.name}</p>
              <p className="text-xs text-muted-foreground truncate">{u.email}{u.cafe ? ` · ${u.cafe}` : ""}</p>
            </div>
            <div className="text-right shrink-0">
              <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                {u.role.replace("_", " ")}
              </span>
            </div>
            <ActionMenu
              actions={[
                { label: "Edit", onClick: () => { setEditing(u); setModalOpen(true) } },
                { label: "Delete", onClick: () => handleDelete(u.id), destructive: true },
              ]}
            />
          </div>
        ))}
      </div>

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
    </div>
  )
}
