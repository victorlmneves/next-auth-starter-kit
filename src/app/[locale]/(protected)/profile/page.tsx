import { auth } from '@/auth'
import { getTranslations } from 'next-intl/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { getInitials } from '@/lib/utils'
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Profile',
}

export default async function ProfilePage() {
    const session = await auth()
    const user = session?.user
    const t = await getTranslations('profile')

    return (
        <div className="max-w-2xl space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">{t('title')}</h1>
                <p className="text-muted-foreground">{t('subtitle')}</p>
            </div>

            {/* Profile Card */}
            <Card>
                <CardHeader>
                    <CardTitle>{t('personalInfo')}</CardTitle>
                    <CardDescription>{t('publicProfile')}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Avatar */}
                    <div className="flex items-center gap-6">
                        <Avatar className="h-20 w-20">
                            <AvatarImage src={user?.image ?? undefined} alt={user?.name ?? 'User'} />
                            <AvatarFallback className="text-lg font-semibold">
                                {getInitials(user?.name)}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <h3 className="text-lg font-semibold">{user?.name}</h3>
                            <p className="text-muted-foreground text-sm">{user?.email}</p>
                            <Button variant="outline" size="sm" className="mt-2">
                                {t('changePhoto')}
                            </Button>
                        </div>
                    </div>

                    {/* Form Fields */}
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium">{t('fullName')}</label>
                            <div className="bg-muted/50 rounded-lg border px-3 py-2 text-sm">
                                {user?.name ?? '—'}
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium">{t('email')}</label>
                            <div className="bg-muted/50 rounded-lg border px-3 py-2 text-sm">
                                {user?.email ?? '—'}
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium">{t('userId')}</label>
                            <div className="bg-muted/50 rounded-lg border px-3 py-2 font-mono text-sm text-xs break-all">
                                {user?.id ?? '—'}
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium">{t('role')}</label>
                            <div className="bg-muted/50 rounded-lg border px-3 py-2 text-sm">
                                <span className="bg-primary/10 text-primary inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium">
                                    {user?.role ?? 'user'}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-3 pt-2">
                        <Button>{t('saveChanges')}</Button>
                        <Button variant="outline">{t('cancel')}</Button>
                    </div>
                </CardContent>
            </Card>

            {/* Danger Zone */}
            <Card className="border-destructive/50">
                <CardHeader>
                    <CardTitle className="text-destructive">{t('dangerZone')}</CardTitle>
                    <CardDescription>{t('irreversibleActions')}</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="border-destructive/50 flex items-center justify-between rounded-lg border p-4">
                        <div>
                            <p className="text-sm font-medium">{t('deleteAccount')}</p>
                            <p className="text-muted-foreground mt-0.5 text-xs">
                                {t('deleteAccountDescription')}
                            </p>
                        </div>
                        <Button variant="destructive" size="sm">
                            {t('deleteAccount')}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
