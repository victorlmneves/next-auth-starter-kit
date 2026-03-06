import { auth } from '@/auth'
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

    return (
        <div className="max-w-2xl space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Profile</h1>
                <p className="text-muted-foreground">
                    Manage your personal information and account settings.
                </p>
            </div>

            {/* Profile Card */}
            <Card>
                <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription>Your public profile information</CardDescription>
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
                                Change Photo
                            </Button>
                        </div>
                    </div>

                    {/* Form Fields */}
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium">Full Name</label>
                            <div className="bg-muted/50 rounded-lg border px-3 py-2 text-sm">
                                {user?.name ?? '—'}
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium">Email</label>
                            <div className="bg-muted/50 rounded-lg border px-3 py-2 text-sm">
                                {user?.email ?? '—'}
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium">User ID</label>
                            <div className="bg-muted/50 rounded-lg border px-3 py-2 font-mono text-sm text-xs break-all">
                                {user?.id ?? '—'}
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium">Role</label>
                            <div className="bg-muted/50 rounded-lg border px-3 py-2 text-sm">
                                <span className="bg-primary/10 text-primary inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium">
                                    {user?.role ?? 'user'}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-3 pt-2">
                        <Button>Save Changes</Button>
                        <Button variant="outline">Cancel</Button>
                    </div>
                </CardContent>
            </Card>

            {/* Danger Zone */}
            <Card className="border-destructive/50">
                <CardHeader>
                    <CardTitle className="text-destructive">Danger Zone</CardTitle>
                    <CardDescription>Irreversible and destructive actions</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="border-destructive/50 flex items-center justify-between rounded-lg border p-4">
                        <div>
                            <p className="text-sm font-medium">Delete Account</p>
                            <p className="text-muted-foreground mt-0.5 text-xs">
                                Permanently delete your account and all associated data.
                            </p>
                        </div>
                        <Button variant="destructive" size="sm">
                            Delete Account
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
