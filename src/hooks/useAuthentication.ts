'use client'

import { useEffect } from 'react'
import { useSession, signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import type { AuthSession, AuthUser } from '@/types'

export function useAuthentication() {
    const { data: rawSession, status, update } = useSession()
    const session = rawSession as AuthSession | null
    const router = useRouter()

    const isLoading = status === 'loading'
    const isAuthenticated = status === 'authenticated'
    const user = session?.user as AuthUser | undefined
    const hasTokenError = session?.error === 'RefreshAccessTokenError'

    useEffect(() => {
        if (hasTokenError) {
            toast.error('A tua sessão expirou. Por favor, inicia sessão novamente.')
            signIn()
        }
    }, [hasTokenError])

    const login = async (provider: string, options?: Record<string, unknown>) => {
        try {
            const result = await signIn(provider, {
                redirect: false,
                callbackUrl: '/dashboard',
                ...options,
            })

            if (result?.error) {
                toast.error('Failed to sign in')

                return false
            }

            if (result?.url) {
                router.push(result.url)
            }

            return true
        } catch (error) {
            console.error('Login error:', error)
            toast.error('An unexpected error occurred')

            return false
        }
    }

    const logout = () => {
        router.push('/logout')
    }

    const refreshSession = async (): Promise<boolean> => {
        try {
            await update()

            return true
        } catch (error) {
            console.error('Session refresh error:', error)

            return false
        }
    }

    const requireAuth = (callbackUrl?: string): boolean => {
        if (!isAuthenticated && !isLoading) {
            const loginUrl = callbackUrl ? `/login?callbackUrl=${encodeURIComponent(callbackUrl)}` : '/login'
            router.push(loginUrl)

            return false
        }

        return true
    }

    return {
        session,
        user,
        isLoading,
        isAuthenticated,
        hasTokenError,
        login,
        logout,
        refreshSession,
        requireAuth,
        // accessToken and refreshToken intentionally NOT exposed here —
        // tokens should never be accessible to client-side code.
        // Use server actions or route handlers to make authenticated API calls.
    }
}
