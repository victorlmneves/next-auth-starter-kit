'use client'

import { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'

export default function LogoutPage() {
    const searchParams = useSearchParams()
    const redirectTo = searchParams.get('redirectTo')

    useEffect(() => {
        if (redirectTo) {
            const timer = setTimeout(() => {
                window.location.href = decodeURIComponent(redirectTo)
            }, 1500)
            return () => clearTimeout(timer)
        }
    }, [redirectTo])

    return (
        <div className="flex h-screen flex-col items-center justify-center gap-4">
            <p className="text-muted-foreground text-sm">Signing you out...</p>
            <p className="text-muted-foreground text-xs">You will be redirected to complete sign out.</p>
        </div>
    )
}
