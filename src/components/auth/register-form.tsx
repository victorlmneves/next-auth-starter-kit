'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import Link from 'next/link'
import { toast } from 'sonner'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

export function RegisterForm() {
    const [isLoading, setIsLoading] = useState(false)
    const t = useTranslations('auth')

    const handleSignUp = async () => {
        setIsLoading(true)

        try {
            await signIn('auth0', { callbackUrl: '/dashboard' }, { screen_hint: 'signup' })
        } catch {
            toast.error('Failed to sign up')
            setIsLoading(false)
        }
    }

    return (
        <Card className="mx-auto w-full max-w-md">
            <CardHeader className="space-y-1">
                <CardTitle className="text-2xl font-bold tracking-tight">{t('registerTitle')}</CardTitle>
                <CardDescription>{t('registerDescription')}</CardDescription>
            </CardHeader>

            <CardContent>
                <Button className="w-full" size="lg" onClick={handleSignUp} loading={isLoading}>
                    <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
                        <path
                            fill="currentColor"
                            d="M21.98 7.448L19.62 0H4.347L2.02 7.448c-1.352 4.312.03 9.206 3.815 12.015L12.007 24l6.157-4.552c3.755-2.81 5.182-7.688 3.815-12.015"
                        />
                    </svg>
                    {t('signUpWith', { provider: 'Auth0' })}
                </Button>
            </CardContent>

            <CardFooter className="flex justify-center">
                <p className="text-muted-foreground text-sm">
                    {t('hasAccount')}{' '}
                    <Link
                        href="/login"
                        className="text-primary hover:text-primary/80 font-medium transition-colors"
                    >
                        {t('login')}
                    </Link>
                </p>
            </CardFooter>
        </Card>
    )
}
