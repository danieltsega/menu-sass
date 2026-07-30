"use client"

import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

interface AdminModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description?: string
  children: React.ReactNode
}

export function AdminModal({ open, onOpenChange, title, description, children }: AdminModalProps) {
  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/50 transition-opacity data-[state=open]:opacity-100 data-[state=closed]:opacity-0" />
        <DialogPrimitive.Content className="fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-card shadow-lg transition-all data-[state=open]:opacity-100 data-[state=open]:scale-100 data-[state=closed]:opacity-0 data-[state=closed]:scale-95 max-h-[85vh] overflow-y-auto">
          <div className="flex items-center justify-between p-5 pb-0">
            <div className="space-y-1">
              <h2 className="text-lg font-semibold leading-tight">{title}</h2>
              {description && (
                <p className="text-sm text-muted-foreground">{description}</p>
              )}
            </div>
            <DialogPrimitive.Close className="rounded-full p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
              <X className="size-5" />
            </DialogPrimitive.Close>
          </div>
          <div className={cn("p-5", description ? "pt-4" : "pt-5")}>
            {children}
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}
