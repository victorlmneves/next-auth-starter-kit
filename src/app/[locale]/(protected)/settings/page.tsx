'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Moon, Sun, Monitor, Globe } from 'lucide-react'
import { useTheme } from 'next-themes'
import { cn } from '@/lib/utils'

const themeOptions = [
    { value: 'light', label: 'Light', icon: Sun },
    { value: 'dark', label: 'Dark', icon: Moon },
    { value: 'system', label: 'System', icon: Monitor },
] as const

const languageOptions = [
    { value: 'en', label: 'English' },
    { value: 'pt', label: 'Português' },
    { value: 'es', label: 'Español' },
    { value: 'fr', label: 'Français' },
    { value: 'de', label: 'Deutsch' },
]

export default function SettingsPage() {
    const { theme, setTheme } = useTheme()

    return (
        <div className="max-w-2xl space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
                <p className="text-muted-foreground">Manage your application preferences.</p>
            </div>

            {/* Appearance */}
            <Card>
                <CardHeader>
                    <CardTitle>Appearance</CardTitle>
                    <CardDescription>Customize how the application looks and feels</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <label className="mb-3 block text-sm font-medium">Theme</label>
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
                    <CardTitle>Language & Region</CardTitle>
                    <CardDescription>Set your preferred language</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-1.5">
                        <label className="flex items-center gap-2 text-sm font-medium">
                            <Globe className="h-4 w-4" />
                            Language
                        </label>
                        <select className="border-input focus-visible:ring-ring flex h-9 w-full rounded-lg border bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:ring-2 focus-visible:outline-none">
                            {languageOptions.map((lang) => (
                                <option key={lang.value} value={lang.value}>
                                    {lang.label}
                                </option>
                            ))}
                        </select>
                    </div>
                    <Button className="mt-4">Save Preferences</Button>
                </CardContent>
            </Card>

            {/* Notifications */}
            <Card>
                <CardHeader>
                    <CardTitle>Notifications</CardTitle>
                    <CardDescription>Configure your notification preferences</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {[
                        {
                            id: 'email',
                            label: 'Email notifications',
                            description: 'Receive updates via email',
                        },
                        {
                            id: 'security',
                            label: 'Security alerts',
                            description: 'Get notified of suspicious activity',
                        },
                        {
                            id: 'updates',
                            label: 'Product updates',
                            description: 'Hear about new features and improvements',
                        },
                    ].map((item) => (
                        <div key={item.id} className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium">{item.label}</p>
                                <p className="text-muted-foreground text-xs">{item.description}</p>
                            </div>
                            <input
                                type="checkbox"
                                id={item.id}
                                defaultChecked={item.id === 'security'}
                                className="accent-primary h-4 w-4 cursor-pointer"
                            />
                        </div>
                    ))}
                    <Button className="mt-2">Save Notifications</Button>
                </CardContent>
            </Card>
        </div>
    )
}
