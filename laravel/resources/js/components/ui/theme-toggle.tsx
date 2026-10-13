import { useEffect, useState } from 'react'
import { useSyncExternalStore } from 'react'
import { Moon, Sun } from 'lucide-react'
import { Button } from '@/components/ui/button'

const emptySubscribe = () => () => {}

function getSystemDark(): boolean {
    return typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches
}

export function ThemeToggle() {
    const [theme, setTheme] = useState<'light' | 'dark'>('light')
    const mounted = useSyncExternalStore(emptySubscribe, () => true, () => false)

    useEffect(() => {
        const stored = localStorage.getItem('theme') as 'light' | 'dark' | null
        const initial = stored ?? (getSystemDark() ? 'dark' : 'light')
        setTheme(initial)
    }, [])

    useEffect(() => {
        const root = document.documentElement
        if (theme === 'dark') {
            root.classList.add('dark')
        } else {
            root.classList.remove('dark')
        }
        localStorage.setItem('theme', theme)
    }, [theme])

    if (!mounted) {
        return (
            <Button variant="ghost" size="icon" className="relative rounded-full shadow-md" disabled aria-label="Toggle theme">
                <Sun className="size-5" />
            </Button>
        )
    }

    return (
        <Button
            variant="ghost"
            size="icon"
            className="relative rounded-full shadow-md bg-primary-foreground/10 hover:bg-primary-foreground/20"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            aria-label="Toggle theme"
        >
            <Sun className="size-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute size-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        </Button>
    )
}