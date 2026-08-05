"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

interface Tab {
  href: string
  label: string
  icon: React.ReactNode
}

export function BottomTabBar({ tabs }: { tabs: Tab[] }) {
  const pathname = usePathname()

  const isActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin"
    return pathname.startsWith(href)
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-card">
      <div className="flex items-center justify-around max-w-lg mx-auto">
        {tabs.map((tab) => (
          <Link
            key={tab.href}
            href={tab.href}
            className={cn(
              "flex flex-col items-center gap-0.5 py-2 px-3 min-w-0 flex-1 transition-colors",
              isActive(tab.href)
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <span className="size-5">{tab.icon}</span>
            <span className="text-[10px] font-medium leading-tight truncate">
              {tab.label}
            </span>
          </Link>
        ))}
      </div>
    </nav>
  )
}

export const SUPER_ADMIN_TABS: Tab[] = [
  {
    href: "/admin",
    label: "Dashboard",
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className="size-5">
        <path fillRule="evenodd" d="M2 3a1 1 0 00-1 1v1a1 1 0 001 1h16a1 1 0 001-1V4a1 1 0 00-1-1H2zm0 4.5a1 1 0 00-1 1v1a1 1 0 001 1h16a1 1 0 001-1v-1a1 1 0 00-1-1H2zm0 4.5a1 1 0 00-1 1v1a1 1 0 001 1h16a1 1 0 001-1v-1a1 1 0 00-1-1H2z" clipRule="evenodd" />
      </svg>
    ),
  },
  {
    href: "/admin/cafes",
    label: "Cafes",
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className="size-5">
        <path d="M4 3a2 2 0 100 4h12a2 2 0 100-4H4z" />
        <path fillRule="evenodd" d="M3 8h14v7a2 2 0 01-2 2H5a2 2 0 01-2-2V8zm2 2a1 1 0 011-1h.01a1 1 0 110 2H6a1 1 0 01-1-1zm5-1a1 1 0 00-1 1v.01a1 1 0 102 0V10a1 1 0 00-1-1zm3 1a1 1 0 011-1h.01a1 1 0 110 2H14a1 1 0 01-1-1z" clipRule="evenodd" />
      </svg>
    ),
  },
  {
    href: "/admin/users",
    label: "Users",
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className="size-5">
        <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
      </svg>
    ),
  },
]

export const CAFE_ADMIN_TABS: Tab[] = [
  {
    href: "/admin",
    label: "Dashboard",
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className="size-5">
        <path fillRule="evenodd" d="M2 3a1 1 0 00-1 1v1a1 1 0 001 1h16a1 1 0 001-1V4a1 1 0 00-1-1H2zm0 4.5a1 1 0 00-1 1v1a1 1 0 001 1h16a1 1 0 001-1v-1a1 1 0 00-1-1H2zm0 4.5a1 1 0 00-1 1v1a1 1 0 001 1h16a1 1 0 001-1v-1a1 1 0 00-1-1H2z" clipRule="evenodd" />
      </svg>
    ),
  },
  {
    href: "/admin/categories",
    label: "Menu",
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className="size-5">
        <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
      </svg>
    ),
  },
  {
    href: "/admin/dishes",
    label: "Dishes",
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className="size-5">
        <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
      </svg>
    ),
  },
  {
    href: "/admin/cafe",
    label: "Cafe",
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className="size-5">
        <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
      </svg>
    ),
  },
]
