"use client"

import { Utensils } from "lucide-react"
import { cn } from "@/lib/utils"

interface PlaceholderImageProps {
  icon?: React.ReactNode
  className?: string
}

export function PlaceholderImage({ icon, className }: PlaceholderImageProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-center bg-muted text-muted-foreground",
        className
      )}
    >
      {icon ?? <Utensils className="size-8" />}
    </div>
  )
}
