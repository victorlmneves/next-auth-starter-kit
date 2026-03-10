'use server'

import { getToken } from 'next-auth/jwt'
import { headers } from 'next/headers'

/**
 * Revokes the federated token server-side and returns the provider's logout URL.
 * signOut() is intentionally NOT called here — the client calls it after the
 * user closes the popup, so the local session stays alive during the popup flow.
 */
export async function logoutAction(): Promise<{ federatedLogoutUrl?: string }> {
    const token = await getToken({
        req: { headers: await headers() },
        secret: process.env.AUTH_SECRET,
        cookieName: 'next-auth.session-token',
    })

    const provider = token?.provider as string | undefined
    const baseUrl = process.env.AUTH_URL ?? process.env.NEXTAUTH_URL ?? 'http://localhost:3000'
    const postLogoutRedirectUri = `${baseUrl}/login`

    if (provider === 'auth0') {
        const domain = process.env.AUTH_AUTH0_ISSUER?.replace(/\/$/, '')
        const idToken = token?.idToken as string | undefined

        if (domain && idToken) {
            const params = new URLSearchParams({
                id_token_hint: idToken,
                post_logout_redirect_uri: postLogoutRedirectUri,
            })

            return { federatedLogoutUrl: `${domain}/oidc/logout?${params.toString()}` }
        }

        if (domain && process.env.AUTH_AUTH0_ID) {
            const params = new URLSearchParams({
                client_id: process.env.AUTH_AUTH0_ID,
                returnTo: postLogoutRedirectUri,
            })

            return { federatedLogoutUrl: `${domain}/v2/logout?${params.toString()}` }
        }
    }

    if (provider === 'github') {
        // const accessToken = token?.accessToken as string | undefined
        // const clientId = process.env.AUTH_GITHUB_ID
        // const clientSecret = process.env.AUTH_GITHUB_SECRET

        // if (accessToken && clientId && clientSecret) {
        //     try {
        //         // DELETE /grant  → revokes authorization entirely (user must re-approve next login)
        //         // DELETE /token  → just invalidates this token (user stays authorized)
        //         await fetch(`https://api.github.com/applications/${clientId}/token`, {
        //             method: 'DELETE',
        //             headers: {
        //                 Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
        //                 Accept: 'application/vnd.github+json',
        //                 'X-GitHub-Api-Version': '2022-11-28',
        //                 'Content-Type': 'application/json',
        //             },
        //             body: JSON.stringify({ access_token: accessToken }),
        //         })
        //     } catch (error) {
        //         console.error('Error revoking GitHub grant:', error)
        //     }
        // }

        return { federatedLogoutUrl: 'https://github.com/logout' }
    }

    if (provider === 'google') {
        const accessToken = token?.accessToken as string | undefined

        if (accessToken) {
            try {
                await fetch(`https://oauth2.googleapis.com/revoke?token=${accessToken}`, {
                    method: 'POST',
                })
            } catch (error) {
                console.error('Error revoking Google token:', error)
            }
        }
    }

    return {}
}
