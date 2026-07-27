export interface Cafe {
  id: string
  name: string
  slug: string
  description?: string
  logo?: string
}

export interface Category {
  id: string
  name: string
  description?: string
  displayOrder: number
  dishes: Dish[]
}

export interface Dish {
  id: string
  name: string
  description?: string
  ingredients: string[]
  price: number
  image?: string
  isAvailable: boolean
  isFeatured: boolean
}

export interface MenuData {
  cafe: Cafe
  categories: Category[]
}