import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Merge class names with tailwind-merge + clsx
 */
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

/**
 * Format a date to a human-readable string
 */
export function formatDate(date: Date | string, locale = 'en-GB'): string {
    return new Intl.DateTimeFormat(locale, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    }).format(new Date(date))
}

/**
 * Format a date to a relative time string (e.g., "2 hours ago")
 */
export function formatRelativeTime(date: Date | string, locale = 'en-GB'): string {
    const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' })
    const now = Date.now()
    const then = new Date(date).getTime()
    const diff = then - now

    const intervals = [
        { unit: 'year', ms: 31536000000 },
        { unit: 'month', ms: 2592000000 },
        { unit: 'week', ms: 604800000 },
        { unit: 'day', ms: 86400000 },
        { unit: 'hour', ms: 3600000 },
        { unit: 'minute', ms: 60000 },
        { unit: 'second', ms: 1000 },
    ] as const

    for (const { unit, ms } of intervals) {
        if (Math.abs(diff) >= ms) {
            return rtf.format(Math.round(diff / ms), unit)
        }
    }

    return rtf.format(0, 'second')
}

/**
 * Truncate a string to a maximum length
 */
export function truncate(str: string, maxLength: number): string {
    if (str.length <= maxLength) {
        return str
    }

    return `${str.slice(0, maxLength)}...`
}

/**
 * Get user initials from a name
 */
export function getInitials(name?: string | null): string {
    if (!name) {
        return '?'
    }

    return name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
}

/**
 * Sleep for a given number of milliseconds
 */
export function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * Check if a token is expired
 */
export function isTokenExpired(expiresAt?: number): boolean {
    if (!expiresAt) {
        return true
    }

    return Date.now() > expiresAt
}

/**
 * Safely parse JSON, returning null on error
 */
export function safeParseJSON<T>(json: string): T | null {
    try {
        return JSON.parse(json) as T
    } catch {
        return null
    }
}
