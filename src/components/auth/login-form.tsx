'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Github } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

interface LoginFormProps {
    enableGithub?: boolean
    enableGoogle?: boolean
}

export function LoginForm({ enableGithub = false, enableGoogle = false }: LoginFormProps) {
    const searchParams = useSearchParams()
    const callbackUrl = searchParams.get('callbackUrl') ?? '/dashboard'
    const [isLoading, setIsLoading] = useState<string | null>(null)

    const handleSignIn = async (provider: string) => {
        setIsLoading(provider)

        try {
            await signIn(
                provider,
                { callbackUrl },
                {
                    prompt: provider === 'google' ? 'consent' : 'signin',
                    ...(provider === 'github' && { scope: 'read:user user:email' }),
                },
            )
        } catch {
            toast.error('Failed to sign in')
            setIsLoading(null)
        }
    }

    return (
        <Card className="mx-auto w-full max-w-md">
            <CardHeader className="space-y-1">
                <CardTitle className="text-2xl font-bold tracking-tight">Sign in</CardTitle>
                <CardDescription>Choose your sign-in method to continue</CardDescription>
            </CardHeader>

            <CardContent className="space-y-3">
                <Button
                    variant="outline"
                    className="w-full"
                    size="lg"
                    onClick={() => handleSignIn('auth0')}
                    loading={isLoading === 'auth0'}
                    disabled={!!isLoading}
                >
                    <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
                        <path
                            fill="currentColor"
                            d="M21.98 7.448L19.62 0H4.347L2.02 7.448c-1.352 4.312.03 9.206 3.815 12.015L12.007 24l6.157-4.552c3.755-2.81 5.182-7.688 3.815-12.015"
                        />
                    </svg>
                    Continue with Auth0
                </Button>

                {enableGithub && (
                    <Button
                        variant="outline"
                        className="w-full"
                        size="lg"
                        onClick={() => handleSignIn('github')}
                        loading={isLoading === 'github'}
                        disabled={!!isLoading}
                    >
                        <Github className="h-4 w-4" />
                        Continue with GitHub
                    </Button>
                )}

                {enableGoogle && (
                    <Button
                        variant="outline"
                        className="w-full"
                        size="lg"
                        onClick={() => handleSignIn('google')}
                        loading={isLoading === 'google'}
                        disabled={!!isLoading}
                    >
                        <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
                            <path
                                fill="currentColor"
                                d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93s3.05-7.44 7-7.93v15.86zm2-15.86c1.03.13 2 .45 2.87.93H13v-.93zM13 7h5.24c.25.31.48.65.68 1H13V7zm0 3h6.74c.08.32.13.65.15.99L20 11H13v-1zm0 3h6.88c-.07.35-.17.69-.28 1.02L13 14v-1zm-.11 9.93V18h.11l5.36-1.68c-.51.44-1.07.82-1.68 1.13A9.975 9.975 0 0113 20.93z"
                            />
                        </svg>
                        Continue with Google
                    </Button>
                )}
            </CardContent>

            <CardFooter className="flex justify-center">
                <p className="text-muted-foreground text-sm">
                    Don&apos;t have an account?{' '}
                    <Link
                        href="/register"
                        className="text-primary hover:text-primary/80 font-medium transition-colors"
                    >
                        Sign up
                    </Link>
                </p>
            </CardFooter>
        </Card>
    )
}
