import { type NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const forgotPasswordSchema = z.object({
    email: z.string().email(),
})

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { email } = forgotPasswordSchema.parse(body)

        const domain = process.env.AUTH_AUTH0_ISSUER?.replace(/\/$/, '')
        const clientId = process.env.AUTH_AUTH0_ID

        if (!domain || !clientId) {
            throw new Error('Auth0 configuration missing')
        }

        const connection = process.env.AUTH0_CONNECTION ?? 'Username-Password-Authentication'

        await fetch(`${domain}/dbconnections/change_password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ client_id: clientId, email, connection }),
        })

        // Always return success to prevent email enumeration attacks
        return NextResponse.json(
            { message: 'If an account exists with this email, a reset link has been sent.' },
            { status: 200 },
        )
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: 'Invalid email address' }, { status: 400 })
        }

        console.error('Forgot password error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
