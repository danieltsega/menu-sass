"use client"

import { useAuthStore } from "@/stores/auth-store"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Store, MoreHorizontal } from "lucide-react"

const DUMMY_CAFES = [
  { id: "c1", name: "Brew & Bean", slug: "brew-and-bean", admin: "Cafe Owner", dishes: 14, active: true },
  { id: "c2", name: "Green Garden Bistro", slug: "green-garden-bistro", admin: "Solomon A.", dishes: 22, active: true },
  { id: "c3", name: "Pizza Piazza", slug: "pizza-piazza", admin: "Meron T.", dishes: 18, active: true },
  { id: "c4", name: "Taste of India", slug: "taste-of-india", admin: "Raj K.", dishes: 30, active: true },
  { id: "c5", name: "Sushi Zen", slug: "sushi-zen", admin: "Yuki M.", dishes: 25, active: false },
]

export default function CafesPage() {
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
          <h1 className="text-xl font-bold">Cafes</h1>
          <p className="text-sm text-muted-foreground">{DUMMY_CAFES.length} registered cafes</p>
        </div>
        <button className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
          + Add Cafe
        </button>
      </div>

      <div className="space-y-2">
        {DUMMY_CAFES.map((cafe) => (
          <div key={cafe.id} className="rounded-xl border bg-card p-4 flex items-center gap-3">
            <div className="size-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
              <Store className="size-5 text-muted-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-sm font-semibold truncate">{cafe.name}</p>
                <span className={`size-1.5 rounded-full shrink-0 ${cafe.active ? "bg-emerald-500" : "bg-muted-foreground"}`} />
              </div>
              <p className="text-xs text-muted-foreground truncate">
                {cafe.admin} · {cafe.dishes} dishes
              </p>
            </div>
            <button className="text-muted-foreground">
              <MoreHorizontal className="size-5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
