import { useCallback, useMemo } from 'react'
import { router, usePage } from '@inertiajs/react'
import { api, getErrorMessage } from '@/lib/api'
import type { ApiUser } from '@/types/api'

export type Role = 'super_admin' | 'cafe_admin'

export interface AdminUser {
    id: string
    name: string
    email: string
    role: Role
    cafeId?: string
    cafeName?: string
    isActive: boolean
}

export interface AuthValue {
    user: AdminUser | null
    isAuthenticated: boolean
    isRestoring: boolean
    login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
    logout: () => Promise<void>
}

interface PageAuth {
    auth: {
        user: ApiUser | null
    }
}

const mapUser = (user: ApiUser): AdminUser => ({
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    isActive: user.isActive,
})

export function useAuthStore<T>(selector?: (state: AuthValue) => T): T extends undefined ? AuthValue : T {
    const props = usePage().props as unknown as PageAuth
    const apiUser = props.auth?.user ?? null

    const value = useMemo<AuthValue>(() => {
        const user = apiUser ? mapUser(apiUser) : null

        return {
            user,
            isAuthenticated: !!user,
            isRestoring: false,
            login: async (email: string, password: string) => {
                try {
                    await api.post('/auth/login', { email, password })
                    router.visit('/admin')
                    return { success: true }
                } catch (error) {
                    return { success: false, error: getErrorMessage(error, 'Invalid email or password') }
                }
            },
            logout: async () => {
                try {
                    await api.post('/auth/logout')
                } catch {
                    // local session cleared by the server redirect regardless
                }
                router.visit('/portal')
            },
        }
    }, [apiUser])

    return (selector ? selector(value) : value) as T extends undefined ? AuthValue : T
}