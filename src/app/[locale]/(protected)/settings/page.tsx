'use client'

import { useState } from 'react'
import { Moon, Sun, Monitor, Globe } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useRouter, usePathname } from '@/i18n/navigation'
import { useLocale, useTranslations } from 'next-intl'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const languageOptions = [
    { value: 'en', label: 'English' },
    { value: 'pt', label: 'Português' },
    { value: 'es', label: 'Español' },
    { value: 'fr', label: 'Français' },
    { value: 'de', label: 'Deutsch' },
]

export default function SettingsPage() {
    const { theme, setTheme } = useTheme()
    const locale = useLocale()
    const router = useRouter()
    const pathname = usePathname()
    const [selectedLocale, setSelectedLocale] = useState(locale)
    const t = useTranslations('settings')
    const themeOptions = [
        { value: 'light', label: t('light'), icon: Sun },
        { value: 'dark', label: t('dark'), icon: Moon },
        { value: 'system', label: t('system'), icon: Monitor },
    ]

    const saveLanguage = () => {
        router.push(pathname, { locale: selectedLocale })
    }

    return (
        <div className="max-w-2xl space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">{t('title')}</h1>
                <p className="text-muted-foreground">{t('subtitle')}</p>
            </div>

            {/* Appearance */}
            <Card>
                <CardHeader>
                    <CardTitle>{t('appearance')}</CardTitle>
                    <CardDescription>{t('appearanceDescription')}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <label className="mb-3 block text-sm font-medium">{t('theme')}</label>
                        <div className="grid grid-cols-3 gap-3">
                            {themeOptions.map((option) => {
                                const Icon = option.icon
                                return (
                                    <button
                                        key={option.value}
                                        onClick={() => setTheme(option.value)}
                                        className={cn(
                                            'flex flex-col items-center gap-2 rounded-xl border-2 p-4 text-sm font-medium transition-all',
                                            theme === option.value
                                                ? 'border-primary bg-primary/5 text-primary'
                                                : 'border-border hover:border-muted-foreground/30 hover:bg-muted/50',
                                        )}
                                    >
                                        <Icon className="h-5 w-5" />
                                        {option.label}
                                    </button>
                                )
                            })}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Language */}
            <Card>
                <CardHeader>
                    <CardTitle>{t('languageRegion')}</CardTitle>
                    <CardDescription>{t('languageRegionDescription')}</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-1.5">
                        <label className="flex items-center gap-2 text-sm font-medium">
                            <Globe className="h-4 w-4" />
                            {t('language')}
                        </label>
                        <select
                            value={selectedLocale}
                            onChange={(e) => setSelectedLocale(e.target.value)}
                            aria-label="Language"
                            className="border-input focus-visible:ring-ring flex h-9 w-full rounded-lg border bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:ring-2 focus-visible:outline-none"
                        >
                            {languageOptions.map((lang) => (
                                <option key={lang.value} value={lang.value}>
                                    {lang.label}
                                </option>
                            ))}
                        </select>
                    </div>
                    <Button className="mt-4" onClick={saveLanguage}>
                        {t('savePreferences')}
                    </Button>
                </CardContent>
            </Card>

            {/* Notifications */}
            <Card>
                <CardHeader>
                    <CardTitle>{t('notifications')}</CardTitle>
                    <CardDescription>{t('notificationsDescription')}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {[
                        {
                            id: 'email',
                            label: t('emailNotifications'),
                            description: t('emailNotificationsDescription'),
                        },
                        {
                            id: 'security',
                            label: t('securityAlerts'),
                            description: t('securityAlertsDescription'),
                        },
                        {
                            id: 'updates',
                            label: t('productUpdates'),
                            description: t('productUpdatesDescription'),
                        },
                    ].map((item) => (
                        <div key={item.id} className="flex items-center justify-between">
                            <label htmlFor={item.id} className="flex-1 cursor-pointer">
                                <p className="text-sm font-medium">{item.label}</p>
                                <p className="text-muted-foreground text-xs">{item.description}</p>
                            </label>
                            <input
                                type="checkbox"
                                id={item.id}
                                defaultChecked={item.id === 'security'}
                                className="accent-primary h-4 w-4 cursor-pointer"
                            />
                        </div>
                    ))}
                    <Button className="mt-2">{t('saveNotifications')}</Button>
                </CardContent>
            </Card>
        </div>
    )
}
