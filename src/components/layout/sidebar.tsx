'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, User, Settings, FileText, BarChart3, Bell, HelpCircle, LogOut } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuthentication } from '@/hooks/useAuthentication'
import { useTranslations } from 'next-intl'

export function Sidebar() {
    const pathname = usePathname()
    const { logout } = useAuthentication()
    const tNav = useTranslations('nav')
    const tAuth = useTranslations('auth')
    const tSidebar = useTranslations('sidebar')

    const sidebarItems = [
        {
            title: tSidebar('main'),
            items: [
                {
                    href: '/dashboard',
                    label: tNav('dashboard'),
                    icon: LayoutDashboard,
                    badge: undefined as string | undefined,
                },
                {
                    href: '/dashboard/analytics',
                    label: tNav('analytics'),
                    icon: BarChart3,
                    badge: undefined as string | undefined,
                },
                {
                    href: '/dashboard/notifications',
                    label: tNav('notifications'),
                    icon: Bell,
                    badge: '3' as string | undefined,
                },
                {
                    href: '/dashboard/documents',
                    label: tNav('documents'),
                    icon: FileText,
                    badge: undefined as string | undefined,
                },
            ],
        },
        {
            title: tSidebar('account'),
            items: [
                {
                    href: '/profile',
                    label: tNav('profile'),
                    icon: User,
                    badge: undefined as string | undefined,
                },
                {
                    href: '/settings',
                    label: tNav('settings'),
                    icon: Settings,
                    badge: undefined as string | undefined,
                },
            ],
        },
        {
            title: tSidebar('support'),
            items: [
                {
                    href: '/docs',
                    label: tNav('documentation'),
                    icon: HelpCircle,
                    badge: undefined as string | undefined,
                },
            ],
        },
    ]

    return (
        <aside className="bg-background flex h-full w-64 flex-col border-r">
            {/* Logo */}
            <div className="flex h-16 items-center border-b px-6">
                <Link href="/" className="flex items-center gap-2 font-bold">
                    <div className="bg-primary text-primary-foreground flex h-8 w-8 items-center justify-center rounded-lg text-sm font-black">
                        N
                    </div>
                    Auth Starter
                </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto px-3 py-4">
                {sidebarItems.map((section) => (
                    <div key={section.title} className="mb-4">
                        <p className="text-muted-foreground mb-1 px-3 text-xs font-semibold tracking-wider uppercase">
                            {section.title}
                        </p>
                        <ul className="space-y-1">
                            {section.items.map((item) => {
                                const Icon = item.icon
                                const isActive =
                                    pathname === item.href || pathname.startsWith(item.href + '/')

                                return (
                                    <li key={item.href}>
                                        <Link
                                            href={item.href}
                                            className={cn(
                                                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                                                isActive
                                                    ? 'bg-primary text-primary-foreground'
                                                    : 'text-muted-foreground hover:bg-accent hover:text-foreground',
                                            )}
                                        >
                                            <Icon className="h-4 w-4 shrink-0" />
                                            <span className="flex-1">{item.label}</span>
                                            {item.badge && (
                                                <span
                                                    className={cn(
                                                        'flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-xs font-medium',
                                                        isActive
                                                            ? 'bg-primary-foreground/20 text-primary-foreground'
                                                            : 'bg-primary/10 text-primary',
                                                    )}
                                                >
                                                    {item.badge}
                                                </span>
                                            )}
                                        </Link>
                                    </li>
                                )
                            })}
                        </ul>
                    </div>
                ))}
            </nav>

            {/* Sign Out */}
            <div className="border-t p-3">
                <button
                    onClick={logout}
                    className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors"
                >
                    <LogOut className="h-4 w-4 shrink-0" />
                    {tAuth('logout')}
                </button>
            </div>
        </aside>
    )
}
