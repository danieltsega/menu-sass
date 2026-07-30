"use client"

import { useAuthStore } from "@/stores/auth-store"
import { Coffee, Store, Users, UtensilsCrossed, TrendingUp, TrendingDown } from "lucide-react"

interface Stat {
  label: string
  value: string
  change: string
  trend: "up" | "down"
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
      <div className="flex items-center gap-1 text-xs">
        {stat.trend === "up" ? (
          <TrendingUp className="size-3 text-emerald-500" />
        ) : (
          <TrendingDown className="size-3 text-destructive" />
        )}
        <span className={stat.trend === "up" ? "text-emerald-500" : "text-destructive"}>
          {stat.change}
        </span>
        <span className="text-muted-foreground">vs last month</span>
      </div>
    </div>
  )
}

export default function AdminDashboard() {
  const user = useAuthStore((s) => s.user)

  const superAdminStats: Stat[] = [
    { label: "Total Cafes", value: "12", change: "+2", trend: "up", icon: <Store className="size-5" /> },
    { label: "Total Dishes", value: "284", change: "+18", trend: "up", icon: <UtensilsCrossed className="size-5" /> },
    { label: "Active Admins", value: "8", change: "+1", trend: "up", icon: <Users className="size-5" /> },
    { label: "Categories", value: "36", change: "-2", trend: "down", icon: <Coffee className="size-5" /> },
  ]

  const cafeAdminStats: Stat[] = [
    { label: "Total Dishes", value: "14", change: "+3", trend: "up", icon: <UtensilsCrossed className="size-5" /> },
    { label: "Categories", value: "4", change: "0", trend: "up", icon: <Coffee className="size-5" /> },
    { label: "Active Dishes", value: "12", change: "+2", trend: "up", icon: <Store className="size-5" /> },
    { label: "Avg. Price", value: "ETB 5.20", change: "+0.50", trend: "down", icon: <TrendingUp className="size-5" /> },
  ]

  const stats = user?.role === "super_admin" ? superAdminStats : cafeAdminStats

  return (
    <div className="p-4 space-y-6">
      <div>
        <h1 className="text-xl font-bold">
          {user?.role === "super_admin" ? "Super Admin Dashboard" : "Cafe Dashboard"}
        </h1>
        <p className="text-sm text-muted-foreground">
          {user?.role === "super_admin"
            ? "Manage all cafes and users"
            : `Manage your cafe — ${user?.cafeName ?? ""}`}
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
