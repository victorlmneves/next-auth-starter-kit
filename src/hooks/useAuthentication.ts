'use client'

import { useSession, signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import type { AuthSession, AuthUser } from '@/types'

export function useAuthentication() {
    const { data: session, status, update } = useSession()
    const router = useRouter()

    const isLoading = status === 'loading'
    const isAuthenticated = status === 'authenticated'
    const user = session?.user as AuthUser | undefined

    // Check if token needs refresh
    const hasTokenError = (session as AuthSession)?.error === 'RefreshAccessTokenError'

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
        // Navigate to the federated logout endpoint which clears all auth
        // cookies (including CSRF token) and redirects to Auth0 /v2/logout
        // so the Auth0 session is also cleared.
        window.location.href = '/api/auth/federated-logout'
    }

    const refreshSession = async () => {
        try {
            await update()
        } catch (error) {
            console.error('Session refresh error:', error)
        }
    }

    const requireAuth = (callbackUrl?: string) => {
        if (!isAuthenticated && !isLoading) {
            const loginUrl = callbackUrl ? `/login?callbackUrl=${encodeURIComponent(callbackUrl)}` : '/login'
            router.push(loginUrl)

            return false
        }

        return true
    }

    return {
        session: session as AuthSession | null,
        user,
        isLoading,
        isAuthenticated,
        hasTokenError,
        login,
        logout,
        refreshSession,
        requireAuth,
        accessToken: (session as AuthSession)?.accessToken,
        refreshToken: (session as AuthSession)?.refreshToken,
    }
}
