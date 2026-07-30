"use client"

import { useState } from "react"
import Image from "next/image"
import { Store } from "lucide-react"
import { ThemeToggle } from "@/components/ui/theme-toggle"

export function CafeHeader({
  name,
  description,
  logo,
}: {
  name: string
  description?: string
  logo?: string
}) {
  const [logoError, setLogoError] = useState(false)

  return (
    <div className="bg-primary text-primary-foreground px-4 pb-6 pt-12">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="bg-primary-foreground/10 rounded-full p-2">
            {logo && !logoError ? (
              <Image
                src={logo}
                alt={name}
                width={24}
                height={24}
                className="size-6 rounded-full object-cover"
                onError={() => setLogoError(true)}
              />
            ) : (
              <Store className="size-6" />
            )}
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
