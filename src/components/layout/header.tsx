'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { useTheme } from 'next-themes'
import Link from 'next/link'
import { Moon, Sun, Menu, X, User, Settings, LogOut, LayoutDashboard } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useAuthentication } from '@/hooks/useAuthentication'
import { getInitials } from '@/lib/utils'

export function Header() {
    const { session, isLoading: loading, logout } = useAuthentication()
    const status = loading ? 'loading' : session ? 'authenticated' : 'unauthenticated'
    const { theme, setTheme } = useTheme()
    const [userMenuOpen, setUserMenuOpen] = useState(false)
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const tNav = useTranslations('nav')
    const tAuth = useTranslations('auth')
    const navLinks = [
        { href: '/', label: tNav('home') },
        { href: '/docs', label: tNav('docs') },
        { href: '/blog', label: tNav('blog') },
        { href: '/pricing', label: tNav('pricing') },
    ]

    const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark')

    return (
        <header className="bg-background/80 sticky top-0 z-50 w-full border-b backdrop-blur-sm">
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 text-lg font-bold">
                    <div className="bg-primary text-primary-foreground flex h-8 w-8 items-center justify-center rounded-lg text-sm font-black">
                        N
                    </div>
                    <span className="hidden sm:block">Auth Starter</span>
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden items-center gap-6 md:flex">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className="text-muted-foreground hover:text-foreground text-sm font-medium transition-colors"
                        >
                            {link.label}
                        </Link>
                    ))}
                </nav>

                {/* Right Actions */}
                <div className="flex items-center gap-2">
                    {/* Theme Toggle */}
                    <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme">
                        <Sun className="h-4 w-4 scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
                        <Moon className="absolute h-4 w-4 scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
                    </Button>

                    {/* Auth State */}
                    {status === 'loading' ? (
                        <div className="bg-muted h-8 w-8 animate-pulse rounded-full" />
                    ) : session ? (
                        <div className="relative">
                            <button
                                onClick={() => setUserMenuOpen(!userMenuOpen)}
                                className="flex items-center gap-2 rounded-full"
                                aria-expanded={userMenuOpen}
                                aria-haspopup="true"
                            >
                                <Avatar className="h-8 w-8">
                                    <AvatarImage
                                        src={session.user?.image ?? undefined}
                                        alt={session.user?.name ?? 'User'}
                                    />
                                    <AvatarFallback className="text-xs">
                                        {getInitials(session.user?.name)}
                                    </AvatarFallback>
                                </Avatar>
                            </button>

                            {userMenuOpen && (
                                <>
                                    <div
                                        className="fixed inset-0 z-40"
                                        onClick={() => setUserMenuOpen(false)}
                                        aria-hidden="true"
                                    />
                                    <div className="bg-popover absolute top-10 right-0 z-50 min-w-[200px] rounded-xl border p-1 shadow-lg">
                                        <div className="mb-1 border-b px-3 py-2">
                                            <p className="text-sm font-medium">{session.user?.name}</p>
                                            <p className="text-muted-foreground truncate text-xs">
                                                {session.user?.email}
                                            </p>
                                        </div>
                                        <Link
                                            href="/dashboard"
                                            className="hover:bg-accent flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors"
                                            onClick={() => setUserMenuOpen(false)}
                                        >
                                            <LayoutDashboard className="h-4 w-4" />
                                            {tNav('dashboard')}
                                        </Link>
                                        <Link
                                            href="/profile"
                                            className="hover:bg-accent flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors"
                                            onClick={() => setUserMenuOpen(false)}
                                        >
                                            <User className="h-4 w-4" />
                                            {tNav('profile')}
                                        </Link>
                                        <Link
                                            href="/settings"
                                            className="hover:bg-accent flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors"
                                            onClick={() => setUserMenuOpen(false)}
                                        >
                                            <Settings className="h-4 w-4" />
                                            {tNav('settings')}
                                        </Link>
                                        <div className="mt-1 border-t pt-1">
                                            <button
                                                onClick={logout}
                                                className="text-destructive hover:bg-destructive/10 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors"
                                            >
                                                <LogOut className="h-4 w-4" />
                                                {tAuth('logout')}
                                            </button>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Link href="/login">
                                <Button variant="ghost" size="sm">
                                    {tAuth('login')}
                                </Button>
                            </Link>
                            <Link href="/register">
                                <Button size="sm">{tAuth('getStarted')}</Button>
                            </Link>
                        </div>
                    )}

                    {/* Mobile Menu Toggle */}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="md:hidden"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        aria-label="Toggle menu"
                    >
                        {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
                    </Button>
                </div>
            </div>

            {/* Mobile Navigation */}
            {mobileMenuOpen && (
                <div className="border-t md:hidden">
                    <nav className="container mx-auto flex flex-col gap-1 px-4 py-3">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="hover:bg-accent rounded-lg px-3 py-2 text-sm font-medium transition-colors"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </nav>
                </div>
            )}
        </header>
    )
}
