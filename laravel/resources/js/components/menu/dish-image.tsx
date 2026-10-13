import { useState } from 'react'
import { PlaceholderImage } from '@/components/menu/placeholder-image'
import { getCategoryIcon } from '@/components/menu/category-icons'

interface DishImageProps {
    src?: string
    alt: string
    categoryName?: string
    sizes: string
}

export function DishImage({ src, alt, categoryName }: DishImageProps) {
    const [errored, setErrored] = useState(false)

    if (!src || errored) {
        return <PlaceholderImage className="w-full h-full" icon={categoryName ? getCategoryIcon(categoryName) : undefined} />
    }

    return <img src={src} alt={alt} className="w-full h-full object-cover" onError={() => setErrored(true)} />
}