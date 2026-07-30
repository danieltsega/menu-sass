import { create } from "zustand"

export type Role = "super_admin" | "cafe_admin"

export interface AdminUser {
  id: string
  name: string
  email: string
  role: Role
  cafeId?: string
  cafeName?: string
}

interface AuthState {
  user: AdminUser | null
  accessToken: string | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  logout: () => void
}

const DUMMY_USERS: { email: string; password: string; user: AdminUser }[] = [
  {
    email: "admin@menusass.com",
    password: "password123",
    user: {
      id: "u-super-001",
      name: "Admin User",
      email: "admin@menusass.com",
      role: "super_admin",
    },
  },
  {
    email: "cafe@brewbean.com",
    password: "password123",
    user: {
      id: "u-cafe-001",
      name: "Cafe Owner",
      email: "cafe@brewbean.com",
      role: "cafe_admin",
      cafeId: "cafe-001",
      cafeName: "Brew & Bean",
    },
  },
]

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  isAuthenticated: false,

  login: async (email: string, password: string) => {
    const match = DUMMY_USERS.find((u) => u.email === email && u.password === password)

    if (!match) {
      return { success: false, error: "Invalid email or password" }
    }

    const token = `dummy_token_${match.user.id}_${Date.now()}`

    set({
      user: match.user,
      accessToken: token,
      isAuthenticated: true,
    })

    return { success: true }
  },

  logout: () => {
    set({
      user: null,
      accessToken: null,
      isAuthenticated: false,
    })
  },
}))
