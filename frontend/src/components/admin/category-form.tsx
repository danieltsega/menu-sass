"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

const categorySchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  description: z.string().max(500).optional(),
  displayOrder: z.coerce.number().int().min(0).optional(),
})

type CategoryFormData = z.infer<typeof categorySchema>

interface CategoryFormProps {
  defaultValues?: CategoryFormData
  onSubmit: (data: CategoryFormData) => void
  onCancel: () => void
}

export function CategoryForm({ defaultValues, onSubmit, onCancel }: CategoryFormProps) {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: { displayOrder: 0, ...defaultValues },
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Category Name</Label>
        <Input id="name" placeholder="Coffee" {...register("name")} />
        {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" placeholder="Handcrafted espresso drinks" {...register("description")} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="displayOrder">Display Order</Label>
        <Input id="displayOrder" type="number" min="0" {...register("displayOrder")} />
      </div>
      <div className="flex gap-3 pt-2">
        <Button type="button" variant="outline" className="flex-1" onClick={onCancel}>Cancel</Button>
        <Button type="submit" className="flex-1" disabled={isSubmitting}>
          {defaultValues ? "Save Changes" : "Add Category"}
        </Button>
      </div>
    </form>
  )
}
