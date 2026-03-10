import { Geist, Geist_Mono } from 'next/font/google'
import { getLocale } from 'next-intl/server'
import type { Metadata } from 'next'
import './globals.css'

const geistSans = Geist({
    variable: '--font-geist-sans',
    subsets: ['latin'],
})

const geistMono = Geist_Mono({
    variable: '--font-geist-mono',
    subsets: ['latin'],
})

export const metadata: Metadata = {
    title: {
        default: 'Next.js Auth Start Kit',
        template: '%s | Next.js Auth Start Kit',
    },
    description:
        'A production-ready SaaS starter kit built with Next.js 16, NextAuth.js v5, Tailwind CSS v4, and TypeScript. Includes authentication flows with Auth0.',
    keywords: ['Next.js', 'Auth0', 'Authentication', 'SaaS', 'Starter Kit', 'TypeScript', 'Tailwind CSS'],
    authors: [{ name: 'Your Name' }],
    openGraph: {
        title: 'Next.js Auth Start Kit',
        description: 'A production-ready SaaS starter kit with authentication',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Next.js Auth Start Kit',
        description: 'A production-ready SaaS starter kit with authentication',
    },
}

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    const locale = await getLocale()

    return (
        <html lang={locale} suppressHydrationWarning>
            <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>{children}</body>
        </html>
    )
}
