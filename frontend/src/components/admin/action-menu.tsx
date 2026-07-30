"use client"

import { useState, useRef, useEffect } from "react"
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react"

interface Action {
  label: string
  icon?: React.ReactNode
  onClick: () => void
  destructive?: boolean
}

interface ActionMenuProps {
  actions: Action[]
}

export function ActionMenu({ actions }: ActionMenuProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    if (open) document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [open])

  return (
    <div ref={ref} className="relative">
      <button onClick={() => setOpen(!open)} className="text-muted-foreground p-1">
        <MoreHorizontal className="size-5" />
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1 z-50 min-w-[140px] rounded-lg border bg-card shadow-lg py-1">
          {actions.map((action) => (
            <button
              key={action.label}
              onClick={() => { action.onClick(); setOpen(false) }}
              className={`flex items-center gap-2 w-full px-3 py-2 text-sm text-left hover:bg-muted transition-colors ${
                action.destructive ? "text-destructive" : "text-foreground"
              }`}
            >
              {action.icon ?? (action.destructive ? <Trash2 className="size-4" /> : <Pencil className="size-4" />)}
              {action.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
