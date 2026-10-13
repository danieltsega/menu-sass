import axios from 'axios'

const baseURL = '/api'

export const API_BASE = baseURL

export function resolveFileUrl(path?: string | null): string | undefined {
    if (!path) return undefined
    if (/^https?:\/\//.test(path)) return path
    return path
}

export const api = axios.create({
    baseURL,
    headers: { 'Content-Type': 'application/json' },
})

export function getErrorMessage(error: unknown, fallback = 'Something went wrong'): string {
    if (axios.isAxiosError(error)) {
        const message = (error.response?.data as { error?: string } | undefined)?.error
        if (message) return message
        if (error.response?.status === 401) return 'Unauthorized'
        if (error.code === 'ERR_NETWORK') return 'Cannot reach the server'
    }
    return fallback
}