"use client"

import { useAuthStore } from "@/stores/auth-store"
import { Store, Users, UtensilsCrossed, Coffee } from "lucide-react"
import { useCafes, useUsers, useMyCafe, useDishes, useCategories } from "@/hooks/use-api"

interface Stat {
  label: string
  value: string
  icon: React.ReactNode
}

function StatCard({ stat }: { stat: Stat }) {
  return (
    <div className="rounded-xl border bg-card p-4 space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground font-medium">{stat.label}</span>
        <span className="text-muted-foreground size-5">{stat.icon}</span>
      </div>
      <p className="text-2xl font-bold">{stat.value}</p>
    </div>
  )
}

export default function AdminDashboard() {
  const user = useAuthStore((s) => s.user)

  const isSuper = user?.role === "super_admin"
  const { data: cafes = [] } = useCafes()
  const { data: users = [] } = useUsers()
  const { data: myCafe } = useMyCafe(!isSuper)
  const cafeId = myCafe?._id
  const { data: dishes = [] } = useDishes(cafeId)
  const { data: categories = [] } = useCategories(cafeId)

  let stats: Stat[]

  if (isSuper) {
    const totalDishes = cafes.reduce((sum, c) => sum + (c.dishCount ?? 0), 0)
    const activeAdmins = users.filter((u) => u.isActive && u.role === "cafe_admin").length
    stats = [
      { label: "Total Cafes", value: String(cafes.length), icon: <Store className="size-5" /> },
      { label: "Total Dishes", value: String(totalDishes), icon: <UtensilsCrossed className="size-5" /> },
      { label: "Active Admins", value: String(activeAdmins), icon: <Users className="size-5" /> },
      { label: "Users", value: String(users.length), icon: <Coffee className="size-5" /> },
    ]
  } else {
    const available = dishes.filter((d) => d.isAvailable).length
    const avgPrice = dishes.length ? (dishes.reduce((sum, d) => sum + d.price, 0) / dishes.length) : 0
    stats = [
      { label: "Total Dishes", value: String(dishes.length), icon: <UtensilsCrossed className="size-5" /> },
      { label: "Categories", value: String(categories.length), icon: <Coffee className="size-5" /> },
      { label: "Available", value: String(available), icon: <Store className="size-5" /> },
      { label: "Avg. Price", value: `ETB ${avgPrice.toFixed(2)}`, icon: <Users className="size-5" /> },
    ]
  }

  return (
    <div className="p-4 space-y-6">
      <div>
        <h1 className="text-xl font-bold">
          {isSuper ? "Super Admin Dashboard" : "Cafe Dashboard"}
        </h1>
        <p className="text-sm text-muted-foreground">
          {isSuper ? "Manage all cafes and users" : `Manage your cafe — ${myCafe?.name ?? "..."}`}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {stats.map((stat) => (
          <StatCard key={stat.label} stat={stat} />
        ))}
      </div>
    </div>
  )
}