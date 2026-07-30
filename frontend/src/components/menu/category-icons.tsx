import type { ReactNode } from "react"
import {
  Coffee,
  CakeSlice,
  Sunrise,
  GlassWater,
  Tag,
} from "lucide-react"

const iconMap: Record<string, ReactNode> = {
  coffee: <Coffee className="size-4" />,
  pastries: <CakeSlice className="size-4" />,
  breakfast: <Sunrise className="size-4" />,
  "cold drinks": <GlassWater className="size-4" />,
}

export function getCategoryIcon(name: string): ReactNode {
  const key = name.toLowerCase()
  return iconMap[key] ?? <Tag className="size-4" />
}
