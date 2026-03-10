import NextAuth from 'next-auth'
import Auth0 from 'next-auth/providers/auth0'
import GitHub from 'next-auth/providers/github'
import Google from 'next-auth/providers/google'
import type { NextAuthConfig } from 'next-auth'

// Extend the built-in session types
declare module 'next-auth' {
    interface Session {
        // Tokens are intentionally NOT exposed to the client — accessed server-side via getToken()
        provider?: string
        error?: string
        user: {
            id: string
            name?: string | null
            email?: string | null
            image?: string | null
            role?: string
        }
    }
}

// JWT augmentation must be in 'next-auth/jwt', not 'next-auth'
declare module 'next-auth/jwt' {
    interface JWT {
        accessToken?: string
        idToken?: string // kept in JWT (server-only) for Auth0 logout, not exposed to session
        provider?: string
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
            // Clear any previous error
            error: undefined,
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
                    prompt: 'signin', // always prompt for credentials'
                },
            },
        }),
        ...(process.env.NEXT_PUBLIC_ENABLE_GITHUB_AUTH === 'true'
            ? [
                  GitHub({
                      clientId: process.env.AUTH_GITHUB_ID,
                      clientSecret: process.env.AUTH_GITHUB_SECRET,
                      authorization: {
                          params: {
                              // GitHub only supports 'code' response_type
                              // prompt and access_type are Google/Auth0 params — removed
                              prompt: 'signin',
                              response_type: 'code',
                              scope: 'read:user user:email',
                          },
                      },
                  }),
              ]
            : []),
        ...(process.env.NEXT_PUBLIC_ENABLE_GOOGLE_AUTH === 'true'
            ? [
                  Google({
                      clientId: process.env.AUTH_GOOGLE_ID,
                      clientSecret: process.env.AUTH_GOOGLE_SECRET,
                      authorization: {
                          params: {
                              // Request offline access for refresh tokens
                              access_type: 'offline',
                              prompt: 'consent',
                          },
                      },
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
                    idToken: account.id_token, // stored in JWT only, not forwarded to session
                    provider: account.provider,
                    refreshToken: account.refresh_token,
                    accessTokenExpires: account.expires_at ? account.expires_at * 1000 : Date.now() + 3600000,
                    user,
                }
            }

            // Return token if not expired
            if (token.accessTokenExpires && Date.now() < (token.accessTokenExpires as number)) {
                return token
            }

            // Token expired — only Auth0 supports refresh tokens here
            // GitHub and Google tokens are long-lived or handled differently
            if (token.provider === 'auth0') {
                return refreshAccessToken(token as Record<string, unknown>)
            }

            // For GitHub/Google, mark as expired so the client can re-authenticate
            console.warn(`Access token expired for provider '${token.provider}' — no refresh supported`)
            return { ...token, error: 'RefreshAccessTokenError' }
        },

        async session({ session, token }) {
            return {
                ...session,
                // Tokens intentionally NOT forwarded — sensitive, accessed server-side via getToken()
                provider: token.provider as string,
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
                return isLoggedIn // Redirects to signIn page if false
            }

            return true
        },

        redirect({ url, baseUrl }) {
            // Allow relative URLs
            if (url.startsWith('/')) {
                return `${baseUrl}${url}`
            }

            // Allow same-origin URLs
            if (new URL(url).origin === baseUrl) {
                return url
            }

            // Allow Auth0 issuer domain — needed so signOut({ redirectTo: auth0LogoutUrl }) works
            const auth0Domain = process.env.AUTH_AUTH0_ISSUER?.replace(/\/$/, '')

            if (auth0Domain && url.startsWith(auth0Domain)) {
                return url
            }

            return baseUrl
        },
    },

    session: {
        strategy: 'jwt',
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },

    cookies: {
        sessionToken: {
            name: `next-auth.session-token`,
            options: {
                httpOnly: true,
                sameSite: 'lax',
                path: '/',
                secure: process.env.NODE_ENV === 'production',
            },
        },
    },

    secret: process.env.AUTH_SECRET,

    trustHost: true,
}

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig)
