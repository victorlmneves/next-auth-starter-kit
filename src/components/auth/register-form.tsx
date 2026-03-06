'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { signIn } from 'next-auth/react'
import Link from 'next/link'
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

const registerSchema = z
    .object({
        name: z.string().min(2, 'Name must be at least 2 characters').max(50, 'Name is too long'),
        email: z.string().email('Please enter a valid email address'),
        password: z
            .string()
            .min(8, 'Password must be at least 8 characters')
            .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
            .regex(/[0-9]/, 'Password must contain at least one number'),
        confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords don't match",
        path: ['confirmPassword'],
    })

type RegisterFormData = z.infer<typeof registerSchema>

export function RegisterForm() {
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
    })

    const onSubmit = async (_data: RegisterFormData) => {
        setIsLoading(true)
        try {
            // With Auth0, registration is typically handled through Auth0's Universal Login
            // or you can call your API endpoint here
            await signIn('auth0', {
                callbackUrl: '/dashboard',
                screen_hint: 'signup',
            })
            toast.success('Account created successfully!')
        } catch {
            toast.error('Failed to create account')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Card className="mx-auto w-full max-w-md">
            <CardHeader className="space-y-1">
                <CardTitle className="text-2xl font-bold tracking-tight">Create an account</CardTitle>
                <CardDescription>Enter your details to get started</CardDescription>
            </CardHeader>

            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
                    <Input
                        {...register('name')}
                        type="text"
                        label="Full Name"
                        placeholder="John Doe"
                        error={errors.name?.message}
                        leftIcon={<User className="h-4 w-4" />}
                        autoComplete="name"
                        autoFocus
                    />

                    <Input
                        {...register('email')}
                        type="email"
                        label="Email"
                        placeholder="you@example.com"
                        error={errors.email?.message}
                        leftIcon={<Mail className="h-4 w-4" />}
                        autoComplete="email"
                    />

                    <Input
                        {...register('password')}
                        type={showPassword ? 'text' : 'password'}
                        label="Password"
                        placeholder="••••••••"
                        error={errors.password?.message}
                        hint="Min. 8 characters, one uppercase, one number"
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
                        autoComplete="new-password"
                    />

                    <Input
                        {...register('confirmPassword')}
                        type={showConfirmPassword ? 'text' : 'password'}
                        label="Confirm Password"
                        placeholder="••••••••"
                        error={errors.confirmPassword?.message}
                        leftIcon={<Lock className="h-4 w-4" />}
                        rightIcon={
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="text-muted-foreground hover:text-foreground transition-colors"
                                aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                            >
                                {showConfirmPassword ? (
                                    <EyeOff className="h-4 w-4" />
                                ) : (
                                    <Eye className="h-4 w-4" />
                                )}
                            </button>
                        }
                        autoComplete="new-password"
                    />

                    <p className="text-muted-foreground text-xs">
                        By creating an account, you agree to our{' '}
                        <Link href="/terms" className="text-primary hover:underline">
                            Terms of Service
                        </Link>{' '}
                        and{' '}
                        <Link href="/privacy" className="text-primary hover:underline">
                            Privacy Policy
                        </Link>
                        .
                    </p>

                    <Button type="submit" className="w-full" size="lg" loading={isLoading}>
                        Create Account
                    </Button>
                </form>
            </CardContent>

            <CardFooter className="flex justify-center">
                <p className="text-muted-foreground text-sm">
                    Already have an account?{' '}
                    <Link
                        href="/login"
                        className="text-primary hover:text-primary/80 font-medium transition-colors"
                    >
                        Sign in
                    </Link>
                </p>
            </CardFooter>
        </Card>
    )
}
