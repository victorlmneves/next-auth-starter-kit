import { type NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const forgotPasswordSchema = z.object({
    email: z.string().email(),
})

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { email } = forgotPasswordSchema.parse(body)

        // In a real app, you would:
        // 1. Check if user exists in your database
        // 2. Generate a secure reset token
        // 3. Save the token with expiry to your database
        // 4. Send an email with the reset link

        // For Auth0, you can use the Management API:
        // await auth0ManagementClient.users.changePassword({ email, connection: 'Username-Password-Authentication' })

        console.log(`Password reset requested for: ${email}`)

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
