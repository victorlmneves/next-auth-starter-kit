import { describe, it, expect } from 'vitest'
import { cn, formatDate, getInitials, truncate, isTokenExpired } from '@/lib/utils'

describe('cn', () => {
    it('merges class names correctly', () => {
        expect(cn('foo', 'bar')).toBe('foo bar')
        expect(cn('foo', { bar: true, baz: false })).toBe('foo bar')
        expect(cn('px-2 py-1', 'px-4')).toBe('py-1 px-4')
    })
})

describe('getInitials', () => {
    it('returns initials from a full name', () => {
        expect(getInitials('John Doe')).toBe('JD')
        expect(getInitials('Alice')).toBe('AL')
        expect(getInitials('John Middle Doe')).toBe('JM')
    })

    it('handles empty or null input', () => {
        expect(getInitials(null)).toBe('?')
        expect(getInitials(undefined)).toBe('?')
        expect(getInitials('')).toBe('?')
    })
})

describe('truncate', () => {
    it('truncates long strings', () => {
        expect(truncate('Hello World', 5)).toBe('Hello...')
        expect(truncate('Hi', 10)).toBe('Hi')
    })
})

describe('isTokenExpired', () => {
    it('returns true for expired tokens', () => {
        const pastTime = Date.now() - 10000

        expect(isTokenExpired(pastTime)).toBe(true)
    })

    it('returns false for valid tokens', () => {
        const futureTime = Date.now() + 10000

        expect(isTokenExpired(futureTime)).toBe(false)
    })

    it('returns true when no expiry provided', () => {
        expect(isTokenExpired()).toBe(true)
        expect(isTokenExpired(undefined)).toBe(true)
    })
})

describe('formatDate', () => {
    it('formats a date string', () => {
        const result = formatDate('2024-01-15', 'en-GB')

        expect(result).toContain('2024')
        expect(result).toContain('January')
    })
})
