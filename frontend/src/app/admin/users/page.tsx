"use client"

import { useAuthStore } from "@/stores/auth-store"
import { MoreHorizontal } from "lucide-react"

const DUMMY_USERS = [
  { id: "u1", name: "Admin User", email: "admin@menusass.com", role: "super_admin", cafes: "-" },
  { id: "u2", name: "Cafe Owner", email: "cafe@brewbean.com", role: "cafe_admin", cafes: "Brew & Bean" },
  { id: "u3", name: "Solomon A.", email: "solomon@greengarden.com", role: "cafe_admin", cafes: "Green Garden Bistro" },
  { id: "u4", name: "Meron T.", email: "meron@pizzapiazza.com", role: "cafe_admin", cafes: "Pizza Piazza" },
  { id: "u5", name: "Raj K.", email: "raj@tasteofindia.com", role: "cafe_admin", cafes: "Taste of India" },
]

export default function UsersPage() {
  const user = useAuthStore((s) => s.user)

  if (user?.role !== "super_admin") {
    return (
      <div className="p-4 text-center text-sm text-muted-foreground">
        Access restricted to super admins.
      </div>
    )
  }

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">Users</h1>
          <p className="text-sm text-muted-foreground">{DUMMY_USERS.length} registered users</p>
        </div>
        <button className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
          + Add User
        </button>
      </div>

      <div className="space-y-2">
        {DUMMY_USERS.map((u) => (
          <div key={u.id} className="rounded-xl border bg-card p-4 flex items-center gap-3">
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
            </div>
            <button className="text-muted-foreground ml-1">
              <MoreHorizontal className="size-5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
