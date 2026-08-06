"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/stores/auth-store"
import { BottomTabBar, SUPER_ADMIN_TABS, CAFE_ADMIN_TABS } from "@/components/admin/bottom-tab-bar"
import { LogOut } from "lucide-react"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { user, isAuthenticated, isRestoring, logout } = useAuthStore()

  useEffect(() => {
    if (!isRestoring && !isAuthenticated) {
      router.replace("/portal")
    }
  }, [isRestoring, isAuthenticated, router])

  if (isRestoring || !isAuthenticated || !user) {
    return null
  }

  const tabs = user.role === "super_admin" ? SUPER_ADMIN_TABS : CAFE_ADMIN_TABS

  return (
    <div className="min-h-screen bg-background pb-16">
      <header className="sticky top-0 z-40 border-b bg-card">
        <div className="max-w-lg mx-auto flex items-center justify-between px-4 h-12">
          <div className="flex items-center gap-2 min-w-0">
            <span className="size-2 rounded-full bg-primary shrink-0" />
            <span className="text-sm font-semibold truncate">{user.name}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="hidden sm:inline capitalize">{user.role.replace("_", " ")}</span>
            <button
              aria-label="Logout"
              onClick={() => {
                logout()
                router.replace("/portal")
              }}
              className="flex items-center gap-1 text-muted-foreground hover:text-destructive transition-colors"
            >
              <LogOut className="size-4" />
              <span className="text-xs hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-lg mx-auto">
        {children}
      </main>

      <BottomTabBar tabs={tabs} />
    </div>
  )
}
