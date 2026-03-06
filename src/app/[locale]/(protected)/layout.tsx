import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import { Sidebar } from '@/components/layout/sidebar'
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: {
        default: 'Dashboard',
        template: '%s | Dashboard',
    },
}

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
    const session = await auth()

    if (!session) {
        redirect('/login')
    }

    return (
        <div className="flex h-screen overflow-hidden">
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content */}
            <div className="flex flex-1 flex-col overflow-hidden">
                {/* Top Bar */}
                <header className="bg-background flex h-16 items-center justify-between border-b px-6">
                    <div className="text-muted-foreground text-sm">{/* Breadcrumbs will go here */}</div>
                    <div className="flex items-center gap-3">
                        <span className="text-muted-foreground text-sm">{session.user?.email}</span>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto p-6">{children}</main>
            </div>
        </div>
    )
}
