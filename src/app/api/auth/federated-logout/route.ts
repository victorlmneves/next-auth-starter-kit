import { getToken } from 'next-auth/jwt'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
    const token = await getToken({ req: request, secret: process.env.AUTH_SECRET })
    const origin = request.nextUrl.origin
    const domain = process.env.AUTH_AUTH0_ISSUER?.replace(/\/$/, '')
    const postLogoutRedirectUri = `${origin}/login`

    let logoutUrl: string

    if (domain && token?.idToken) {
        // OIDC RP-Initiated Logout using id_token_hint (most reliable)
        const params = new URLSearchParams({
            id_token_hint: token.idToken as string,
            post_logout_redirect_uri: postLogoutRedirectUri,
        })

        logoutUrl = `${domain}/oidc/logout?${params.toString()}`
    } else if (domain && process.env.AUTH_AUTH0_ID) {
        // Fallback: Auth0 /v2/logout (no id_token available)
        const params = new URLSearchParams({
            client_id: process.env.AUTH_AUTH0_ID,
            returnTo: postLogoutRedirectUri,
        })

        logoutUrl = `${domain}/v2/logout?${params.toString()}`
    } else {
        logoutUrl = postLogoutRedirectUri
    }

    const response = NextResponse.redirect(logoutUrl)

    // Delete all NextAuth cookies so none linger after logout
    const useSecureCookies = request.nextUrl.protocol === 'https:'
    const cookiePrefix = useSecureCookies ? '__Secure-' : ''
    const csrfCookieName = useSecureCookies ? '__Host-authjs.csrf-token' : 'authjs.csrf-token'

    const cookieOptions = { path: '/' }
    response.cookies.delete({ name: `${cookiePrefix}authjs.session-token`, ...cookieOptions })
    response.cookies.delete({ name: csrfCookieName, ...cookieOptions })
    response.cookies.delete({ name: `${cookiePrefix}authjs.callback-url`, ...cookieOptions })

    return response
}
