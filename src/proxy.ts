import { auth } from '@/auth'
import createMiddleware from 'next-intl/middleware'
import { routing } from '@/i18n/routing'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const intlMiddleware = createMiddleware(routing)

const protectedRoutes = ['/dashboard', '/profile', '/settings']
const authRoutes = ['/login', '/register', '/forgot-password', '/reset-password']

function getPathnameWithoutLocale(pathname: string): string {
    for (const locale of routing.locales) {
        if (pathname.startsWith(`/${locale}/`)) {
            return pathname.slice(locale.length + 1)
        }

        if (pathname === `/${locale}`) {
            return '/'
        }
    }

    return pathname
}

export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl

    // Don't run intl middleware on API routes
    if (pathname.startsWith('/api/')) {
        return NextResponse.next()
    }

    // Run i18n middleware first
    const intlResponse = intlMiddleware(request)

    // Check authentication using locale-stripped path
    const normalizedPath = getPathnameWithoutLocale(pathname)
    const isProtectedRoute = protectedRoutes.some((route) => normalizedPath.startsWith(route))
    const isAuthRoute = authRoutes.some((route) => normalizedPath.startsWith(route))

    if (isProtectedRoute || isAuthRoute) {
        const session = await auth()

        if (isProtectedRoute && !session) {
            const loginUrl = new URL('/login', request.url)
            loginUrl.searchParams.set('callbackUrl', pathname)

            return NextResponse.redirect(loginUrl)
        }

        if (isAuthRoute && session) {
            return NextResponse.redirect(new URL('/dashboard', request.url))
        }
    }

    return intlResponse
}

export const config = {
    matcher: [
        // Skip Next.js internals and static files
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    ],
}
