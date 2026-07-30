"use client"

import { Store } from "lucide-react"
import { ThemeToggle } from "@/components/ui/theme-toggle"

export function CafeHeader({
  name,
  description,
}: {
  name: string
  description?: string
}) {
  return (
    <div className="bg-primary text-primary-foreground px-4 pb-6 pt-12">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="bg-primary-foreground/10 rounded-full p-2">
            <Store className="size-6" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">{name}</h1>
        </div>
        <ThemeToggle />
      </div>
      {description && (
        <p className="text-primary-foreground/70 text-sm leading-relaxed">
          {description}
        </p>
      )}
    </div>
  )
}
