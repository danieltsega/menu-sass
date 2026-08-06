import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios"
import { useAuthStore } from "@/stores/auth-store"

const baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api"

export const API_BASE = baseURL

export function resolveFileUrl(path?: string | null): string | undefined {
  if (!path) return undefined
  if (/^https?:\/\//.test(path)) return path
  if (path.startsWith("/")) {
    return path
  }
  return path
}

export const api = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
})

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

interface RetriableConfig extends InternalAxiosRequestConfig {
  _retry?: boolean
}

const refreshAccessToken = async (refreshToken: string) => {
  const { data } = await axios.post(`${baseURL}/auth/refresh`, { refreshToken })
  return data.data as { user: import("@/types/api").ApiUser; tokens: import("@/types/api").ApiTokens }
}

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config as RetriableConfig | undefined
    const refreshToken = useAuthStore.getState().refreshToken

    if (error.response?.status === 401 && original && !original._retry && refreshToken) {
      original._retry = true
      try {
        const { user, tokens } = await refreshAccessToken(refreshToken)
        useAuthStore.getState().setSession({ user, accessToken: tokens.accessToken, refreshToken: tokens.refreshToken })
        original.headers.Authorization = `Bearer ${tokens.accessToken}`
        return api(original)
      } catch {
        useAuthStore.getState().logout()
      }
    }

    return Promise.reject(error)
  }
)

export function getErrorMessage(error: unknown, fallback = "Something went wrong"): string {
  if (axios.isAxiosError(error)) {
    const message = (error.response?.data as { error?: string } | undefined)?.error
    if (message) return message
    if (error.response?.status === 401) return "Unauthorized"
    if (error.code === "ERR_NETWORK") return "Cannot reach the server"
  }
  return fallback
}