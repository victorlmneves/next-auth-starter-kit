import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { setRequestLocale } from 'next-intl/server'
import { ThemeProvider } from 'next-themes'
import { SessionProvider } from 'next-auth/react'
import { Toaster } from 'sonner'
import { routing } from '@/i18n/routing'

export function generateStaticParams() {
    return routing.locales.map((locale) => ({ locale }))
}

export default async function LocaleLayout({
    children,
    params,
}: {
    children: React.ReactNode
    params: Promise<{ locale: string }>
}) {
    const { locale } = await params
    setRequestLocale(locale)
    const messages = await getMessages()

    return (
        <SessionProvider>
            <NextIntlClientProvider locale={locale} messages={messages}>
                <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
                    {children}
                    <Toaster position="top-right" richColors />
                </ThemeProvider>
            </NextIntlClientProvider>
        </SessionProvider>
    )
}
