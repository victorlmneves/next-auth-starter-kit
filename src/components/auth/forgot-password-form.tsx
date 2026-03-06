'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Link from 'next/link'
import { Mail, ArrowLeft } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

const forgotPasswordSchema = z.object({
    email: z.string().email('Please enter a valid email address'),
})

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>

export function ForgotPasswordForm() {
    const [isLoading, setIsLoading] = useState(false)
    const [emailSent, setEmailSent] = useState(false)

    const {
        register,
        handleSubmit,
        getValues,
        formState: { errors },
    } = useForm<ForgotPasswordFormData>({
        resolver: zodResolver(forgotPasswordSchema),
    })

    const onSubmit = async (data: ForgotPasswordFormData) => {
        setIsLoading(true)

        try {
            const response = await fetch('/api/auth/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: data.email }),
            })

            if (!response.ok) throw new Error('Failed to send reset email')

            setEmailSent(true)
            toast.success('Reset link sent! Check your email.')
        } catch {
            toast.error('Failed to send reset email. Please try again.')
        } finally {
            setIsLoading(false)
        }
    }

    if (emailSent) {
        return (
            <Card className="mx-auto w-full max-w-md">
                <CardHeader className="space-y-1 text-center">
                    <div className="bg-primary/10 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
                        <Mail className="text-primary h-8 w-8" />
                    </div>
                    <CardTitle className="text-2xl font-bold tracking-tight">Check your email</CardTitle>
                    <CardDescription>
                        We sent a password reset link to <strong>{getValues('email')}</strong>
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 text-center">
                    <p className="text-muted-foreground text-sm">
                        Didn&apos;t receive the email? Check your spam folder or{' '}
                        <button
                            onClick={() => setEmailSent(false)}
                            className="text-primary font-medium hover:underline"
                        >
                            try again
                        </button>
                        .
                    </p>
                    <Link href="/login">
                        <Button variant="outline" className="w-full">
                            <ArrowLeft className="h-4 w-4" />
                            Back to Sign In
                        </Button>
                    </Link>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="mx-auto w-full max-w-md">
            <CardHeader className="space-y-1">
                <CardTitle className="text-2xl font-bold tracking-tight">Forgot password?</CardTitle>
                <CardDescription>
                    Enter your email address and we&apos;ll send you a password reset link.
                </CardDescription>
            </CardHeader>

            <CardContent>
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

                    <Button type="submit" className="w-full" size="lg" loading={isLoading}>
                        Send Reset Link
                    </Button>

                    <Link href="/login">
                        <Button variant="ghost" className="w-full">
                            <ArrowLeft className="h-4 w-4" />
                            Back to Sign In
                        </Button>
                    </Link>
                </form>
            </CardContent>
        </Card>
    )
}
