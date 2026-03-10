'use client'

import { useEffect, useState } from 'react'
import { signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { logoutAction } from '@/actions/auth'
import { Button } from '@/components/ui/button'

export default function LogoutPage() {
    const router = useRouter()
    const t = useTranslations('auth')
    const [federatedUrl, setFederatedUrl] = useState<string | null>(null)
    const [ready, setReady] = useState(false)

    useEffect(() => {
        logoutAction().then(({ federatedLogoutUrl }) => {
            if (federatedLogoutUrl) {
                setFederatedUrl(federatedLogoutUrl)
                setReady(true)
            } else {
                // No federated logout needed — clear session and redirect
                signOut({ redirect: false }).then(() => router.push('/login'))
            }
        })
    }, [router])

    const handleFederatedLogout = async () => {
        if (!federatedUrl) return

        const w = 600,
            h = 700
        const left = window.screenX + (window.outerWidth - w) / 2
        const top = window.screenY + (window.outerHeight - h) / 2
        const popup = window.open(
            federatedUrl,
            'auth-logout',
            `width=${w},height=${h},top=${top},left=${left},toolbar=no,menubar=no,scrollbars=yes`,
        )

        if (!popup) {
            // Popup was blocked — fall back to full redirect
            await signOut({ redirectTo: '/login' })
            return
        }

        // Wait for the user to close the popup/tab, then clear local session
        await new Promise<void>((resolve) => {
            const poll = setInterval(() => {
                if (popup.closed) {
                    clearInterval(poll)
                    resolve()
                }
            }, 500)
        })

        await signOut({ redirect: false })
        router.push('/login')
    }

    if (!ready) {
        return (
            <div className="flex h-screen flex-col items-center justify-center gap-4">
                <div className="border-primary h-8 w-8 animate-spin rounded-full border-4 border-t-transparent" />
                <p className="text-muted-foreground text-sm">{t('signingOut')}</p>
            </div>
        )
    }

    return (
        <div className="flex h-screen flex-col items-center justify-center gap-6">
            <div className="flex flex-col items-center gap-2 text-center">
                <p className="text-sm font-medium">{t('signingOut')}</p>
                <p className="text-muted-foreground max-w-xs text-xs">{t('federatedLogoutPrompt')}</p>
            </div>
            <Button onClick={handleFederatedLogout}>{t('completeFederatedLogout')}</Button>
        </div>
    )
}
