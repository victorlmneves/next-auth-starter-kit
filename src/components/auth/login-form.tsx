'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Eye, EyeOff, Mail, Lock, Github } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

const loginSchema = z.object({
    email: z.string().email('Please enter a valid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    rememberMe: z.boolean().optional(),
})

type LoginFormData = z.infer<typeof loginSchema>

export function LoginForm() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const callbackUrl = searchParams.get('callbackUrl') ?? '/dashboard'
    const [showPassword, setShowPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [isSocialLoading, setIsSocialLoading] = useState<string | null>(null)

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
    })

    const onSubmit = async (data: LoginFormData) => {
        setIsLoading(true)

        try {
            const result = await signIn('credentials', {
                email: data.email,
                password: data.password,
                redirect: false,
                callbackUrl,
            })

            if (result?.error) {
                toast.error('Invalid email or password')
                return
            }

            toast.success('Welcome back!')
            router.push(callbackUrl)
            router.refresh()
        } catch {
            toast.error('An unexpected error occurred')
        } finally {
            setIsLoading(false)
        }
    }

    const handleSocialLogin = async (provider: string) => {
        setIsSocialLoading(provider)

        try {
            await signIn(provider, { callbackUrl })
        } catch {
            toast.error('Failed to sign in with ' + provider)
            setIsSocialLoading(null)
        }
    }

    return (
        <Card className="mx-auto w-full max-w-md">
            <CardHeader className="space-y-1">
                <CardTitle className="text-2xl font-bold tracking-tight">Sign in</CardTitle>
                <CardDescription>Enter your credentials to access your account</CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
                {/* Social Login Buttons */}
                <div className="space-y-2">
                    <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => handleSocialLogin('auth0')}
                        loading={isSocialLoading === 'auth0'}
                        disabled={!!isSocialLoading}
                    >
                        <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
                            <path
                                fill="currentColor"
                                d="M21.98 7.448L19.62 0H4.347L2.02 7.448c-1.352 4.312.03 9.206 3.815 12.015L12.007 24l6.157-4.552c3.755-2.81 5.182-7.688 3.815-12.015"
                            />
                        </svg>
                        Continue with Auth0
                    </Button>

                    <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => handleSocialLogin('github')}
                        loading={isSocialLoading === 'github'}
                        disabled={!!isSocialLoading}
                    >
                        <Github className="h-4 w-4" />
                        Continue with GitHub
                    </Button>
                </div>

                {/* Divider */}
                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-background text-muted-foreground px-2">Or continue with</span>
                    </div>
                </div>

                {/* Login Form */}
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
                    <Input
                        {...register('email')}
                        type="email"
                        label="Email"
                        placeholder="you@example.com"
                        error={errors.email?.message}
                        leftIcon={<Mail className="h-4 w-4" />}
                        autoComplete="email"
                        autoFocus
                    />

                    <Input
                        {...register('password')}
                        type={showPassword ? 'text' : 'password'}
                        label="Password"
                        placeholder="••••••••"
                        error={errors.password?.message}
                        leftIcon={<Lock className="h-4 w-4" />}
                        rightIcon={
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="text-muted-foreground hover:text-foreground transition-colors"
                                aria-label={showPassword ? 'Hide password' : 'Show password'}
                            >
                                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                        }
                        autoComplete="current-password"
                    />

                    <div className="flex items-center justify-between">
                        <label className="flex cursor-pointer items-center gap-2 text-sm">
                            <input
                                {...register('rememberMe')}
                                type="checkbox"
                                className="border-input accent-primary h-4 w-4 rounded"
                            />
                            Remember me
                        </label>
                        <Link
                            href="/forgot-password"
                            className="text-primary hover:text-primary/80 text-sm transition-colors"
                        >
                            Forgot password?
                        </Link>
                    </div>

                    <Button type="submit" className="w-full" size="lg" loading={isLoading}>
                        Sign In
                    </Button>
                </form>
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
