import { create } from "zustand"
import type { ApiUser, ApiTokens } from "@/types/api"
import { api } from "@/lib/api"

export type Role = "super_admin" | "cafe_admin"

export interface AdminUser {
  id: string
  name: string
  email: string
  role: Role
  cafeId?: string
  cafeName?: string
  isActive: boolean
}

interface Session {
  user: ApiUser
  accessToken: string
  refreshToken: string
}

interface AuthState {
  user: AdminUser | null
  accessToken: string | null
  refreshToken: string | null
  isAuthenticated: boolean
  isRestoring: boolean
  setSession: (session: Session) => void
  setUser: (user: AdminUser) => void
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  logout: () => Promise<void>
  restoreSession: () => Promise<void>
}

const STORAGE_KEY = "menusass.auth"

const readStoredSession = (): Session | null => {
  if (typeof window === "undefined") return null
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw) as Session
  } catch {
    return null
  }
}

const mapUser = (user: ApiUser): AdminUser => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  isActive: user.isActive,
})

const persist = (session: Session | null) => {
  if (typeof window === "undefined") return
  if (session) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session))
  } else {
    window.localStorage.removeItem(STORAGE_KEY)
  }
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  isRestoring: true,

  setSession: ({ user, accessToken, refreshToken }) => {
    persist({ user, accessToken, refreshToken })
    set({
      user: mapUser(user),
      accessToken,
      refreshToken,
      isAuthenticated: true,
      isRestoring: false,
    })
  },

  setUser: (user) => {
    const current = readStoredSession()
    if (current) persist({ ...current, user: { ...current.user, name: user.name, email: user.email } })
    set({ user })
  },

  login: async (email: string, password: string) => {
    try {
      const { data } = await api.post<{ success: boolean; data: { user: ApiUser; tokens: ApiTokens } }>(
        "/auth/login",
        { email, password }
      )
      const { user, tokens } = data.data
      get().setSession({ user, accessToken: tokens.accessToken, refreshToken: tokens.refreshToken })
      return { success: true }
    } catch (error) {
      const { getErrorMessage } = await import("@/lib/api")
      return { success: false, error: getErrorMessage(error, "Invalid email or password") }
    }
  },

  logout: async () => {
    const refreshToken = get().refreshToken
    persist(null)
    set({ user: null, accessToken: null, refreshToken: null, isAuthenticated: false, isRestoring: false })
    if (refreshToken) {
      try {
        await api.post("/auth/logout", { refreshToken })
      } catch {
        // ignore logout errors; local session already cleared
      }
    }
  },

  restoreSession: async () => {
    const stored = readStoredSession()
    if (!stored) {
      set({ isRestoring: false })
      return
    }

    try {
      const { data } = await api.post<{ success: boolean; data: { user: ApiUser; tokens: ApiTokens } }>(
        "/auth/refresh",
        { refreshToken: stored.refreshToken }
      )
      const { user, tokens } = data.data
      get().setSession({ user, accessToken: tokens.accessToken, refreshToken: tokens.refreshToken })
    } catch {
      persist(null)
      set({ user: null, accessToken: null, refreshToken: null, isAuthenticated: false, isRestoring: false })
    }
  },
}))
