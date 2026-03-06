import type { Metadata } from 'next'
import { RegisterForm } from '@/components/auth/register-form'

export const metadata: Metadata = {
    title: 'Sign Up',
    description: 'Create a new account',
}

export default function RegisterPage() {
    return <RegisterForm />
}
