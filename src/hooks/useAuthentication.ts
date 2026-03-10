'use client'

import { useEffect } from 'react'
import { useSession, signIn, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { logoutAction } from '@/actions/auth'
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

    const logout = async () => {
        try {
            // Revoke federated tokens server-side, get logout URL if provider supports it
            const { federatedLogoutUrl } = await logoutAction()

            if (federatedLogoutUrl) {
                // Open a real visible popup — user must interact (e.g. GitHub logout button)
                const w = 600,
                    h = 700
                const left = window.screenX + (window.outerWidth - w) / 2
                const top = window.screenY + (window.outerHeight - h) / 2
                const popup = window.open(
                    federatedLogoutUrl,
                    'auth-logout',
                    `width=${w},height=${h},top=${top},left=${left},toolbar=no,menubar=no,scrollbars=yes`,
                )

                if (!popup) {
                    // Popup was blocked — fall back to full redirect
                    await signOut({ redirectTo: '/login' })

                    return
                }

                // Wait for the user to close the popup, then clear local session
                await new Promise<void>((resolve) => {
                    const poll = setInterval(() => {
                        if (popup.closed) {
                            clearInterval(poll)
                            resolve()
                        }
                    }, 500)
                })
            }

            // Clear local NextAuth session and navigate to login
            await signOut({ redirect: false })
            router.push('/login')
        } catch (error) {
            if ((error as { digest?: string })?.digest?.startsWith('NEXT_REDIRECT')) {
                throw error
            }

            console.error('Logout error:', error)
            toast.error('Ocorreu um erro ao terminar sessão')
        }
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
