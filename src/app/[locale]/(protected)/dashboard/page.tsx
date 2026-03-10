import { auth } from '@/auth'
import { getTranslations } from 'next-intl/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, TrendingUp, Activity, DollarSign } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Dashboard',
}

const stats = [
    {
        label: 'Total Users',
        value: '2,350',
        change: '+20.1%',
        trend: 'up' as const,
        icon: Users,
        description: 'from last month',
    },
    {
        label: 'Revenue',
        value: '$45,231.89',
        change: '+15.2%',
        trend: 'up' as const,
        icon: DollarSign,
        description: 'from last month',
    },
    {
        label: 'Active Sessions',
        value: '1,247',
        change: '+4.6%',
        trend: 'up' as const,
        icon: Activity,
        description: 'right now',
    },
    {
        label: 'Growth Rate',
        value: '12.5%',
        change: '+2.4%',
        trend: 'up' as const,
        icon: TrendingUp,
        description: 'from last month',
    },
]

const recentActivity = [
    { id: 1, action: 'New user registered', user: 'alice@example.com', time: '2 minutes ago' },
    { id: 2, action: 'Password reset requested', user: 'bob@example.com', time: '15 minutes ago' },
    { id: 3, action: 'Profile updated', user: 'carol@example.com', time: '1 hour ago' },
    { id: 4, action: 'Account deactivated', user: 'dave@example.com', time: '3 hours ago' },
    { id: 5, action: 'New OAuth login', user: 'eve@example.com', time: '5 hours ago' },
]

export default async function DashboardPage() {
    const session = await auth()
    const t = await getTranslations('dashboard')

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div>
                <h1 className="text-2xl font-bold tracking-tight">
                    {t('welcome', { name: session?.user?.name?.split(' ')[0] ?? 'there' })}
                </h1>
                <p className="text-muted-foreground">{t('subtitle')}</p>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat) => {
                    const Icon = stat.icon
                    return (
                        <Card key={stat.label}>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
                                <div className="bg-muted rounded-lg p-2">
                                    <Icon className="text-muted-foreground h-4 w-4" />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stat.value}</div>
                                <p className="text-muted-foreground mt-1 text-xs">
                                    <span className="font-medium text-green-600">{stat.change}</span>{' '}
                                    {stat.description}
                                </p>
                            </CardContent>
                        </Card>
                    )
                })}
            </div>

            {/* Content Grid */}
            <div className="grid gap-6 lg:grid-cols-7">
                {/* Recent Activity */}
                <Card className="lg:col-span-4">
                    <CardHeader>
                        <CardTitle>{t('recentActivity')}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {recentActivity.map((item) => (
                                <div key={item.id} className="flex items-center gap-4">
                                    <div className="bg-primary h-2 w-2 shrink-0 rounded-full" />
                                    <div className="min-w-0 flex-1">
                                        <p className="text-sm font-medium">{item.action}</p>
                                        <p className="text-muted-foreground truncate text-xs">{item.user}</p>
                                    </div>
                                    <span className="text-muted-foreground text-xs whitespace-nowrap">
                                        {item.time}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Session Info */}
                <Card className="lg:col-span-3">
                    <CardHeader>
                        <CardTitle>{t('currentSession')}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="bg-muted/50 space-y-3 rounded-lg p-4">
                            <div>
                                <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
                                    User
                                </p>
                                <p className="mt-1 text-sm font-medium">{session?.user?.name}</p>
                            </div>
                            <div>
                                <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
                                    Email
                                </p>
                                <p className="mt-1 truncate text-sm">{session?.user?.email}</p>
                            </div>
                            <div>
                                <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
                                    Role
                                </p>
                                <span className="bg-primary/10 text-primary mt-1 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium">
                                    {session?.user?.role ?? 'user'}
                                </span>
                            </div>
                            {session?.error && (
                                <div className="bg-destructive/10 rounded-lg p-3">
                                    <p className="text-destructive text-xs font-medium">
                                        ⚠️ {t('tokenError')}
                                    </p>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
