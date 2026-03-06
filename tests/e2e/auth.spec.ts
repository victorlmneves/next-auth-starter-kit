import { test, expect } from '@playwright/test'

test.describe('Authentication', () => {
    test('should display login page', async ({ page }) => {
        await page.goto('/login')

        await expect(page).toHaveTitle(/Sign In/)
        await expect(page.getByRole('heading', { name: 'Sign in' })).toBeVisible()
    })

    test('should show validation errors on empty submission', async ({ page }) => {
        await page.goto('/login')
        await page.getByRole('button', { name: 'Sign In' }).click()

        await expect(page.getByText('Please enter a valid email')).toBeVisible()
    })

    test('should navigate to register page', async ({ page }) => {
        await page.goto('/login')
        await page.getByRole('link', { name: 'Sign up' }).click()

        await expect(page).toHaveURL('/register')
    })

    test('should navigate to forgot password page', async ({ page }) => {
        await page.goto('/login')
        await page.getByRole('link', { name: 'Forgot password?' }).click()

        await expect(page).toHaveURL('/forgot-password')
    })

    test('should display register page', async ({ page }) => {
        await page.goto('/register')

        await expect(page.getByRole('heading', { name: 'Create an account' })).toBeVisible()
    })

    test('should redirect authenticated users away from login', async ({ page }) => {
        // This would need a logged-in state - implement with auth helpers
        // See: https://playwright.dev/docs/auth
    })

    test('should redirect unauthenticated users to login', async ({ page }) => {
        await page.goto('/dashboard')

        await expect(page).toHaveURL(/login/)
    })
})

test.describe('Home Page', () => {
    test('should display home page', async ({ page }) => {
        await page.goto('/')

        await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
        await expect(page.getByRole('link', { name: 'Get Started Free' })).toBeVisible()
    })

    test('should navigate to login when clicking sign in', async ({ page }) => {
        await page.goto('/')
        await page.getByRole('link', { name: 'Sign In' }).click()

        await expect(page).toHaveURL('/login')
    })
})
