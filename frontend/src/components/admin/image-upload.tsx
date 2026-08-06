"use client"

import { useRef, useState } from "react"
import Image from "next/image"
import { ImagePlus, Loader2, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useUploadImage } from "@/hooks/use-api"
import { resolveFileUrl } from "@/lib/api"
import { toast } from "sonner"

interface ImageUploadProps {
  value?: string
  onChange: (value: string) => void
  aspect?: string
}

export function ImageUpload({ value, onChange, aspect = "aspect-square" }: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [loading, setLoading] = useState(false)
  const uploadImage = useUploadImage()

  const handleFile = async (file: File | undefined) => {
    if (!file) return
    setLoading(true)
    try {
      const { url } = await uploadImage.mutateAsync(file)
      onChange(url)
    } catch {
      toast.error("Failed to upload image")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />

      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className={cn(
            "relative size-24 shrink-0 rounded-xl border-2 border-dashed border-input bg-muted flex items-center justify-center overflow-hidden transition-colors hover:border-primary",
            aspect
          )}
        >
          {value ? (
            <Image
              src={resolveFileUrl(value) ?? ""}
              alt="Preview"
              fill
              sizes="96px"
              className="size-full object-cover"
            />
          ) : (
            <div className="flex flex-col items-center gap-1 text-muted-foreground">
              {loading ? (
                <Loader2 className="size-6 animate-spin" />
              ) : (
                <ImagePlus className="size-6" />
              )}
              <span className="text-[10px]">Upload logo</span>
            </div>
          )}
        </button>

        <div className="flex flex-col gap-2 flex-1">
          <Button type="button" variant="outline" className="w-full" onClick={() => inputRef.current?.click()}>
            {value ? "Change Image" : "Choose Image"}
          </Button>
          {value && (
            <Button type="button" variant="ghost" size="sm" className="w-full text-destructive" onClick={() => onChange("")}>
              <X className="size-4 mr-1" /> Remove
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}