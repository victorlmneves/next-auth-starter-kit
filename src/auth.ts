import NextAuth from 'next-auth'
import Auth0 from 'next-auth/providers/auth0'
import GitHub from 'next-auth/providers/github'
import Google from 'next-auth/providers/google'
import type { NextAuthConfig } from 'next-auth'

// Extend the built-in session types
declare module 'next-auth' {
    interface Session {
        accessToken?: string
        refreshToken?: string
        accessTokenExpires?: number
        error?: string
        user: {
            id: string
            name?: string | null
            email?: string | null
            image?: string | null
            role?: string
        }
    }

    interface JWT {
        accessToken?: string
        idToken?: string
        refreshToken?: string
        accessTokenExpires?: number
        error?: string
        sub?: string
        role?: string
    }
}

async function refreshAccessToken(token: Record<string, unknown>) {
    try {
        const url = `${process.env.AUTH_AUTH0_ISSUER}/oauth/token`

        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                grant_type: 'refresh_token',
                client_id: process.env.AUTH_AUTH0_ID ?? '',
                client_secret: process.env.AUTH_AUTH0_SECRET ?? '',
                refresh_token: (token.refreshToken as string) ?? '',
            }),
        })

        const refreshedTokens = await response.json()

        if (!response.ok) {
            throw refreshedTokens
        }

        return {
            ...token,
            accessToken: refreshedTokens.access_token,
            accessTokenExpires: Date.now() + refreshedTokens.expires_in * 1000,
            refreshToken: refreshedTokens.refresh_token ?? token.refreshToken,
        }
    } catch (error) {
        console.error('Error refreshing access token:', error)

        return { ...token, error: 'RefreshAccessTokenError' }
    }
}

export const authConfig: NextAuthConfig = {
    providers: [
        Auth0({
            clientId: process.env.AUTH_AUTH0_ID,
            clientSecret: process.env.AUTH_AUTH0_SECRET,
            issuer: process.env.AUTH_AUTH0_ISSUER,
            authorization: {
                params: {
                    scope: process.env.AUTH0_SCOPE ?? 'openid profile email offline_access',
                    audience: process.env.AUTH0_AUDIENCE,
                },
            },
        }),
        ...(process.env.NEXT_PUBLIC_ENABLE_GITHUB_AUTH === 'true'
            ? [
                  GitHub({
                      clientId: process.env.AUTH_GITHUB_ID,
                      clientSecret: process.env.AUTH_GITHUB_SECRET,
                  }),
              ]
            : []),
        ...(process.env.NEXT_PUBLIC_ENABLE_GOOGLE_AUTH === 'true'
            ? [
                  Google({
                      clientId: process.env.AUTH_GOOGLE_ID,
                      clientSecret: process.env.AUTH_GOOGLE_SECRET,
                  }),
              ]
            : []),
    ],

    pages: {
        signIn: '/login',
        error: '/login',
        signOut: '/login',
    },

    callbacks: {
        async jwt({ token, account, user }) {
            // Initial sign-in
            if (account && user) {
                return {
                    ...token,
                    accessToken: account.access_token,
                    idToken: account.id_token,
                    refreshToken: account.refresh_token,
                    accessTokenExpires: account.expires_at ? account.expires_at * 1000 : Date.now() + 3600000,
                    user,
                }
            }

            // Return token if not expired
            if (token.accessTokenExpires && Date.now() < (token.accessTokenExpires as number)) {
                return token
            }

            // Token expired, try to refresh
            return refreshAccessToken(token as Record<string, unknown>)
        },

        async session({ session, token }) {
            return {
                ...session,
                accessToken: token.accessToken as string,
                refreshToken: token.refreshToken as string,
                accessTokenExpires: token.accessTokenExpires as number,
                error: token.error as string,
                user: {
                    ...session.user,
                    id: token.sub ?? '',
                    role: (token.role as string) ?? 'user',
                },
            }
        },

        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user
            const isOnDashboard = nextUrl.pathname.startsWith('/dashboard')
            const isOnProfile = nextUrl.pathname.startsWith('/profile')
            const isOnSettings = nextUrl.pathname.startsWith('/settings')
            const isProtected = isOnDashboard || isOnProfile || isOnSettings

            if (isProtected) {
                if (isLoggedIn) {
                    return true
                }

                return false // Redirect to login
            }

            return true
        },

    },

    session: {
        strategy: 'jwt',
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },
}

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig)
