import type { Session } from 'next-auth'

// ============================================================
// Auth Types
// ============================================================

export interface AuthUser {
    id: string
    name?: string | null
    email?: string | null
    image?: string | null
    role?: string
}

export interface AuthSession extends Session {
    accessToken?: string
    refreshToken?: string
    accessTokenExpires?: number
    error?: 'RefreshAccessTokenError' | string
}

// ============================================================
// Navigation Types
// ============================================================

export interface NavItem {
    title: string
    href: string
    icon?: string
    disabled?: boolean
    external?: boolean
    label?: string
}

export interface NavSection {
    title?: string
    items: NavItem[]
}

// ============================================================
// UI Types
// ============================================================

export type Theme = 'light' | 'dark' | 'system'

export interface BreadcrumbItem {
    title: string
    href?: string
}

// ============================================================
// API Response Types
// ============================================================

export interface ApiResponse<T = unknown> {
    data?: T
    error?: string
    message?: string
    status: number
}

export interface PaginatedResponse<T> {
    data: T[]
    total: number
    page: number
    pageSize: number
    totalPages: number
}

// ============================================================
// Form Types
// ============================================================

export interface LoginFormData {
    email: string
    password: string
    rememberMe?: boolean
}

export interface RegisterFormData {
    name: string
    email: string
    password: string
    confirmPassword: string
}

export interface ForgotPasswordFormData {
    email: string
}

export interface ResetPasswordFormData {
    password: string
    confirmPassword: string
    token: string
}

export interface ProfileFormData {
    name: string
    email: string
    bio?: string
    website?: string
}

// ============================================================
// Dashboard Types
// ============================================================

export interface DashboardStat {
    label: string
    value: string | number
    change?: {
        value: number
        trend: 'up' | 'down' | 'neutral'
    }
    icon?: string
}

export interface ActivityItem {
    id: string
    title: string
    description?: string
    timestamp: Date | string
    type: 'login' | 'logout' | 'update' | 'create' | 'delete' | string
    user?: AuthUser
}
