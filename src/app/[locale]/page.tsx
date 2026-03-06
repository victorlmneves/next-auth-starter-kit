import Link from 'next/link'
import { ArrowRight, Shield, Zap, Globe, Code2, TestTube, Moon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Header } from '@/components/layout/header'

const features = [
    {
        icon: Shield,
        title: 'Auth0 Integration',
        description:
            'Pre-built authentication flows with Auth0, including login, signup, and refresh tokens.',
    },
    {
        icon: Zap,
        title: 'Next.js 15 + Turbopack',
        description:
            'Built on the latest Next.js with App Router, Server Components, and blazing fast Turbopack.',
    },
    {
        icon: Globe,
        title: 'Internationalization',
        description:
            'Full i18n support with next-intl. Supports English, Portuguese, Spanish, French, and German.',
    },
    {
        icon: Code2,
        title: 'TypeScript First',
        description: 'Full type safety with strict TypeScript, including typed API routes and session data.',
    },
    {
        icon: Moon,
        title: 'Dark Mode',
        description: 'Automatic theme switching with next-themes. Respects system preferences.',
    },
    {
        icon: TestTube,
        title: 'Testing Suite',
        description: 'Unit/component tests with Vitest + Testing Library, E2E tests with Playwright.',
    },
]

export default function HomePage() {
    return (
        <div className="flex min-h-screen flex-col">
            <Header />

            <main className="flex-1">
                {/* Hero Section */}
                <section className="relative overflow-hidden">
                    {/* Background */}
                    <div className="absolute inset-0 -z-10">
                        <div className="from-primary/5 via-background to-background absolute inset-0 bg-gradient-to-br" />
                        <div
                            className="absolute inset-0 opacity-[0.03]"
                            style={{
                                backgroundImage: `radial-gradient(circle at 1px 1px, hsl(var(--foreground)) 1px, transparent 0)`,
                                backgroundSize: '40px 40px',
                            }}
                        />
                    </div>

                    <div className="container mx-auto px-4 py-24 text-center">
                        {/* Badge */}
                        <div className="bg-background/80 mb-8 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm font-medium shadow-sm backdrop-blur-sm">
                            <span className="relative flex h-2 w-2">
                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
                                <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
                            </span>
                            Ready to use · Next.js 15 + NextAuth v5
                        </div>

                        <h1 className="mb-6 text-5xl font-bold tracking-tight text-balance sm:text-6xl lg:text-7xl">
                            Next.js Auth{' '}
                            <span className="from-primary to-primary/50 bg-gradient-to-r bg-clip-text text-transparent">
                                Start Kit
                            </span>
                        </h1>

                        <p className="text-muted-foreground mx-auto mb-10 max-w-2xl text-xl text-balance">
                            A production-ready SaaS starter kit with Next.js 15, NextAuth.js v5, Auth0,
                            Tailwind CSS v4, and TypeScript. Ship faster with authentication already set up.
                        </p>

                        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                            <Link href="/register">
                                <Button size="xl" className="gap-2">
                                    Get Started Free
                                    <ArrowRight className="h-4 w-4" />
                                </Button>
                            </Link>
                            <a
                                href="https://github.com/your-org/nextjs-auth-start-kit"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <Button variant="outline" size="xl">
                                    <svg
                                        className="h-4 w-4"
                                        viewBox="0 0 24 24"
                                        fill="currentColor"
                                        aria-hidden="true"
                                    >
                                        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
                                    </svg>
                                    View on GitHub
                                </Button>
                            </a>
                        </div>

                        {/* Tech Stack */}
                        <div className="text-muted-foreground/60 mt-16 flex flex-wrap items-center justify-center gap-8">
                            {[
                                'Next.js 15',
                                'NextAuth v5',
                                'Auth0',
                                'Tailwind CSS v4',
                                'TypeScript',
                                'Vitest',
                                'Playwright',
                            ].map((tech) => (
                                <span key={tech} className="text-sm font-medium">
                                    {tech}
                                </span>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section className="border-t py-24">
                    <div className="container mx-auto px-4">
                        <div className="mb-16 text-center">
                            <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
                                Everything you need to ship
                            </h2>
                            <p className="text-muted-foreground mx-auto max-w-2xl text-lg">
                                Stop reinventing the wheel. Start with a solid foundation and focus on what
                                makes your product unique.
                            </p>
                        </div>

                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {features.map((feature) => {
                                const Icon = feature.icon
                                return (
                                    <div
                                        key={feature.title}
                                        className="group bg-card rounded-xl border p-6 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
                                    >
                                        <div className="bg-primary/10 group-hover:bg-primary/20 mb-4 flex h-10 w-10 items-center justify-center rounded-lg transition-colors">
                                            <Icon className="text-primary h-5 w-5" />
                                        </div>
                                        <h3 className="mb-2 font-semibold">{feature.title}</h3>
                                        <p className="text-muted-foreground text-sm leading-relaxed">
                                            {feature.description}
                                        </p>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="bg-muted/30 border-t py-24">
                    <div className="container mx-auto px-4 text-center">
                        <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
                            Ready to get started?
                        </h2>
                        <p className="text-muted-foreground mb-8 text-lg">
                            Join developers building with the Next.js Auth Start Kit.
                        </p>
                        <Link href="/register">
                            <Button size="xl">
                                Start Building Today
                                <ArrowRight className="h-4 w-4" />
                            </Button>
                        </Link>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="border-t py-8">
                <div className="text-muted-foreground container mx-auto flex flex-col items-center justify-between gap-4 px-4 text-sm sm:flex-row">
                    <p>© {new Date().getFullYear()} Next.js Auth Start Kit. MIT License.</p>
                    <div className="flex gap-4">
                        <Link href="/docs" className="hover:text-foreground transition-colors">
                            Docs
                        </Link>
                        <Link href="/privacy" className="hover:text-foreground transition-colors">
                            Privacy
                        </Link>
                        <Link href="/terms" className="hover:text-foreground transition-colors">
                            Terms
                        </Link>
                    </div>
                </div>
            </footer>
        </div>
    )
}
