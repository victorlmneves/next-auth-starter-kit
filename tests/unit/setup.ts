import '@testing-library/jest-dom'
import { vi } from 'vitest'

// Mock next/navigation
vi.mock('next/navigation', () => ({
    useRouter: () => ({
        push: vi.fn(),
        replace: vi.fn(),
        back: vi.fn(),
        forward: vi.fn(),
        refresh: vi.fn(),
        prefetch: vi.fn(),
    }),
    useSearchParams: () => new URLSearchParams(),
    usePathname: () => '/',
    redirect: vi.fn(),
}))

// Mock next-auth
vi.mock('next-auth/react', () => ({
    useSession: () => ({
        data: null,
        status: 'unauthenticated',
        update: vi.fn(),
    }),
    signIn: vi.fn(),
    signOut: vi.fn(),
    SessionProvider: ({ children }: { children: React.ReactNode }) => children,
}))

// Mock next-themes
vi.mock('next-themes', () => ({
    useTheme: () => ({
        theme: 'light',
        setTheme: vi.fn(),
        systemTheme: 'light',
    }),
    ThemeProvider: ({ children }: { children: React.ReactNode }) => children,
}))

// Mock sonner
vi.mock('sonner', () => ({
    toast: {
        success: vi.fn(),
        error: vi.fn(),
        info: vi.fn(),
        warning: vi.fn(),
    },
    Toaster: () => null,
}))
