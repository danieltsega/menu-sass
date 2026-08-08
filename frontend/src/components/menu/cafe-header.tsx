"use client"

import { useState } from "react"
import Image from "next/image"
import { Store, Phone } from "lucide-react"
import { ThemeToggle } from "@/components/ui/theme-toggle"

export function CafeHeader({
  name,
  phone,
  logo,
}: {
  name: string
  phone?: string
  logo?: string
}) {
  const [logoError, setLogoError] = useState(false)

  return (
    <div className="bg-primary text-primary-foreground px-4 pb-6 pt-12">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="bg-primary-foreground/10 rounded-full p-2">
            {logo && !logoError ? (
              <Image
                src={logo}
                alt={name}
                width={48}
                height={48}
                className="size-12 rounded-full object-cover"
                onError={() => setLogoError(true)}
              />
            ) : (
              <Store className="size-12 p-1.5" />
            )}
          </div>
          <h1 className="text-2xl font-bold tracking-tight">{name}</h1>
        </div>
        <ThemeToggle />
      </div>
      {phone && (
        <a
          href={`tel:${phone}`}
          className="inline-flex items-center gap-2 rounded-full border border-destructive/40 bg-destructive/10 px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-destructive/20 transition-colors"
        >
          <Phone className="size-4" />
          Order us {phone}
        </a>
      )}
    </div>
  )
}
