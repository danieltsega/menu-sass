"use client"

import { useState } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ImageUpload } from "@/components/admin/image-upload"

const dishSchema = z.object({
  name: z.string().min(1, "Name is required").max(200),
  price: z.coerce.number().positive("Price must be positive"),
  category: z.string().min(1, "Category is required"),
  description: z.string().max(1000).optional(),
  isAvailable: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
})

type DishFormData = z.infer<typeof dishSchema>

interface DishFormProps {
  categories: { id: string; name: string }[]
  defaultValues?: DishFormData & { ingredients?: string[]; image?: string }
  onSubmit: (data: DishFormData & { ingredients: string[]; image?: string }) => void
  onCancel: () => void
}

export function DishForm({ categories, defaultValues, onSubmit, onCancel }: DishFormProps) {
  const [ingredients, setIngredients] = useState<string[]>(defaultValues?.ingredients ?? [])
  const [ingredientInput, setIngredientInput] = useState("")
  const [image, setImage] = useState(defaultValues?.image ?? "")

  const { register, handleSubmit, control, formState: { errors, isSubmitting } } = useForm<DishFormData>({
    resolver: zodResolver(dishSchema),
    defaultValues: { isAvailable: true, isFeatured: false, ...defaultValues },
  })

  const addIngredient = () => {
    const val = ingredientInput.trim()
    if (val && !ingredients.includes(val)) {
      setIngredients([...ingredients, val])
      setIngredientInput("")
    }
  }

  const removeIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index))
  }

  const handleFormSubmit = (data: DishFormData) => {
    onSubmit({ ...data, ingredients, image })
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label>Dish Photo</Label>
        <ImageUpload value={image} onChange={setImage} label="Upload photo" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="name">Dish Name</Label>
        <Input id="name" placeholder="Classic Espresso" {...register("name")} />
        {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label htmlFor="price">Price (ETB)</Label>
          <Input id="price" type="number" step="0.01" min="0" placeholder="4.50" {...register("price")} />
          {errors.price && <p className="text-xs text-destructive">{errors.price.message}</p>}
        </div>
        <div className="space-y-2">
          <Label>Category</Label>
          <Controller
            name="category"
            control={control}
            defaultValue={categories[0]?.id ?? ""}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.category && <p className="text-xs text-destructive">{errors.category.message}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" placeholder="Rich single-origin espresso shot" {...register("description")} />
      </div>

      <div className="space-y-2">
        <Label>Ingredients</Label>
        <div className="flex gap-2">
          <Input
            placeholder="Arabica beans"
            value={ingredientInput}
            onChange={(e) => setIngredientInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addIngredient() } }}
          />
          <Button type="button" variant="outline" onClick={addIngredient} className="shrink-0">Add</Button>
        </div>
        {ingredients.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {ingredients.map((ing, i) => (
              <span key={i} className="inline-flex items-center gap-1 rounded-full bg-muted px-3 py-1 text-xs">
                {ing}
                <button type="button" onClick={() => removeIngredient(i)} className="text-muted-foreground hover:text-foreground">
                  <X className="size-3" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between">
        <Label htmlFor="available">Available</Label>
        <Controller
          name="isAvailable"
          control={control}
          render={({ field }) => (
            <Switch id="available" checked={field.value} onCheckedChange={field.onChange} />
          )}
        />
      </div>

      <div className="flex gap-3 pt-2">
        <Button type="button" variant="outline" className="flex-1" onClick={onCancel}>Cancel</Button>
        <Button type="submit" className="flex-1" disabled={isSubmitting}>
          {defaultValues ? "Save Changes" : "Add Dish"}
        </Button>
      </div>
    </form>
  )
}
