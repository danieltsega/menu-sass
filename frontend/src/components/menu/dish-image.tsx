"use client"

import { useState } from "react"
import Image from "next/image"
import { PlaceholderImage } from "@/components/menu/placeholder-image"
import { getCategoryIcon } from "@/components/menu/category-icons"

interface DishImageProps {
  src?: string
  alt: string
  categoryName?: string
  sizes: string
}

export function DishImage({ src, alt, categoryName, sizes }: DishImageProps) {
  const [errored, setErrored] = useState(false)

  if (!src || errored) {
    return (
      <PlaceholderImage
        className="w-full h-full"
        icon={categoryName ? getCategoryIcon(categoryName) : undefined}
      />
    )
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      className="object-cover"
      onError={() => setErrored(true)}
    />
  )
}
