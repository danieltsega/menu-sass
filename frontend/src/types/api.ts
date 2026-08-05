export interface ApiUser {
  _id: string
  name: string
  email: string
  role: "super_admin" | "cafe_admin"
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface ApiCafe {
  _id: string
  name: string
  slug: string
  description?: string
  logo?: string
  address?: string
  phone?: string
  admin: string
  adminName?: string
  dishCount?: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface ApiCategory {
  _id: string
  name: string
  description?: string
  displayOrder: number
  cafe: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface ApiDish {
  _id: string
  name: string
  description?: string
  ingredients: string[]
  price: number
  image?: string
  category: string
  cafe: string
  isAvailable: boolean
  isFeatured: boolean
  createdAt: string
  updatedAt: string
}

export interface ApiCategoryWithDishes extends ApiCategory {
  dishes: ApiDish[]
}

export interface ApiMenu {
  cafe: ApiCafe
  categories: ApiCategoryWithDishes[]
}

export interface ApiTokens {
  accessToken: string
  refreshToken: string
}

export interface ApiAuthData {
  user: ApiUser
  tokens: ApiTokens
}

export interface PaginationMeta {
  page: number
  limit: number
  total: number
  totalPages: number
}

export interface ApiResponse<T> {
  success: boolean
  data: T
  pagination?: PaginationMeta
  error?: string
}
