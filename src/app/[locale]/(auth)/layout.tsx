import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Authentication',
}

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="grid min-h-screen lg:grid-cols-2">
            {/* Left Panel - Branding */}
            <div className="bg-muted/30 hidden flex-col border-r p-10 lg:flex">
                <Link href="/" className="flex items-center gap-2 text-lg font-bold">
                    <div className="bg-primary text-primary-foreground flex h-9 w-9 items-center justify-center rounded-xl text-sm font-black">
                        N
                    </div>
                    Auth Starter
                </Link>

                <div className="flex flex-1 flex-col justify-center">
                    <blockquote className="space-y-2">
                        <p className="text-xl leading-relaxed font-medium text-balance">
                            &quot;This starter kit saved me weeks of setup time. Auth0 integration works
                            perfectly out of the box, and the TypeScript types are excellent.&quot;
                        </p>
                        <footer className="text-muted-foreground text-sm">
                            <strong className="text-foreground">Sofia Davis</strong> · Senior Engineer at
                            TechCorp
                        </footer>
                    </blockquote>
                </div>

                <div className="text-muted-foreground text-xs">
                    Built with Next.js · NextAuth · Auth0 · Tailwind CSS
                </div>
            </div>

            {/* Right Panel - Auth Form */}
            <div className="flex flex-col items-center justify-center p-6 sm:p-10">
                {/* Mobile Logo */}
                <Link href="/" className="mb-8 flex items-center gap-2 text-lg font-bold lg:hidden">
                    <div className="bg-primary text-primary-foreground flex h-9 w-9 items-center justify-center rounded-xl text-sm font-black">
                        N
                    </div>
                    Auth Starter
                </Link>

                <div className="w-full max-w-md">{children}</div>
            </div>
        </div>
    )
}
