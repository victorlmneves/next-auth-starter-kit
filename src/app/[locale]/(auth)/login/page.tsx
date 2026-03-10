import type { Metadata } from 'next'
import { LoginForm } from '@/components/auth/login-form'

export const metadata: Metadata = {
    title: 'Sign In',
    description: 'Sign in to your account',
}

export default function LoginPage() {
    // Read feature flags server-side — more reliable than process.env in client components
    const enableGithub = process.env.NEXT_PUBLIC_ENABLE_GITHUB_AUTH === 'true'
    const enableGoogle = process.env.NEXT_PUBLIC_ENABLE_GOOGLE_AUTH === 'true'

    return <LoginForm enableGithub={enableGithub} enableGoogle={enableGoogle} />
}
