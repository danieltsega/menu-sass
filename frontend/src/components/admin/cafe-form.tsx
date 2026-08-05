"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { ImageUpload } from "@/components/admin/image-upload"

const cafeSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  slug: z.string().min(1, "Slug is required").regex(/^[a-z0-9-]+$/, "Only lowercase letters, numbers, and hyphens"),
  description: z.string().max(500).optional(),
  address: z.string().max(200).optional(),
  phone: z.string().max(30).optional(),
})

type CafeFormData = z.infer<typeof cafeSchema>

interface CafeFormProps {
  defaultValues?: CafeFormData & { logo?: string }
  onSubmit: (data: CafeFormData & { logo?: string }) => void
  onCancel: () => void
}

export function CafeForm({ defaultValues, onSubmit, onCancel }: CafeFormProps) {
  const [logo, setLogo] = useState(defaultValues?.logo ?? "")
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<CafeFormData>({
    resolver: zodResolver(cafeSchema),
    defaultValues,
  })

  const handleFormSubmit = (data: CafeFormData) => {
    onSubmit({ ...data, logo })
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label>Cafe Logo</Label>
        <ImageUpload value={logo} onChange={setLogo} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="name">Cafe Name</Label>
        <Input id="name" placeholder="Brew & Bean" {...register("name")} />
        {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="slug">Slug</Label>
        <Input id="slug" placeholder="brew-and-bean" {...register("slug")} />
        {errors.slug && <p className="text-xs text-destructive">{errors.slug.message}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" placeholder="Artisan coffee & homemade pastries..." {...register("description")} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="address">Address</Label>
        <Input id="address" placeholder="Bole Road, Addis Ababa" {...register("address")} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="phone">Phone</Label>
        <Input id="phone" placeholder="+251 911 234 567" {...register("phone")} />
      </div>
      <div className="flex gap-3 pt-2">
        <Button type="button" variant="outline" className="flex-1" onClick={onCancel}>Cancel</Button>
        <Button type="submit" className="flex-1" disabled={isSubmitting}>
          {defaultValues ? "Save Changes" : "Create Cafe"}
        </Button>
      </div>
    </form>
  )
}
