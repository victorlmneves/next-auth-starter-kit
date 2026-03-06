# Next Auth Start Kit

A production-ready SaaS starter kit built with **Next.js 16**, **NextAuth.js v5**, **Auth0**, **Tailwind CSS v4**, and **TypeScript**. The Next.js equivalent of the [nuxt4-auth-start-kit](https://github.com/victorlmneves/nuxt4-auth-start-kit).

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![NextAuth](https://img.shields.io/badge/NextAuth.js-v5-purple?logo=auth0)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38bdf8?logo=tailwindcss)
![License](https://img.shields.io/badge/license-MIT-green)

## ✨ Features

- **Authentication Ready** — Pre-built login, register, and password reset flows using NextAuth.js v5 + Auth0
- **Refresh Tokens** — Automatic token refresh with error handling (mirrors the Nuxt kit's behavior)
- **TypeScript First** — Strict TypeScript with full type safety, including typed session data
- **Next.js 15 + App Router** — Server Components, Server Actions, Turbopack
- **Tailwind CSS v4** — Modern utility-first styling with dark mode support
- **Internationalization** — Built-in i18n with `next-intl` (EN, PT, ES, FR, DE)
- **Dark Mode** — Automatic theme switching respecting system preferences
- **Testing Suite** — Unit/component tests (Vitest + Testing Library) + E2E tests (Playwright)
- **GitHub Actions CI** — Automated linting, type checking, and test runs
- **Renovate** — Automated dependency updates

## 🗂️ Project Structure

```
├── src/
│   ├── app/
│   │   ├── (auth)/              # Auth pages (login, register, forgot-password)
│   │   ├── (protected)/         # Protected pages (dashboard, profile, settings)
│   │   ├── api/
│   │   │   └── auth/            # NextAuth.js API routes
│   │   ├── layout.tsx           # Root layout
│   │   ├── page.tsx             # Home/landing page
│   │   └── globals.css          # Global styles
│   ├── auth.ts                  # NextAuth configuration (Auth0 + refresh tokens)
│   ├── middleware.ts            # Route protection + i18n
│   ├── components/
│   │   ├── auth/                # Auth forms (login, register, forgot-password)
│   │   ├── layout/              # Header, Sidebar
│   │   └── ui/                  # Button, Input, Card, Avatar
│   ├── hooks/
│   │   └── useAuthentication.ts # Auth composable (equivalent to Nuxt composable)
│   ├── i18n/
│   │   ├── routing.ts           # i18n locale configuration
│   │   └── request.ts           # next-intl server config
│   ├── lib/
│   │   └── utils.ts             # Utility functions
│   └── types/
│       └── index.ts             # TypeScript types
├── messages/                    # Translation files (en, pt, es, fr, de)
├── tests/
│   ├── unit/                    # Vitest unit/component tests
│   └── e2e/                     # Playwright E2E tests
└── .github/workflows/ci.yml     # GitHub Actions CI
```

## 🚀 Getting Started

### Requirements

- Node.js >= 20
- An [Auth0](https://auth0.com) account (free tier works great)

### Installation

```bash
# Clone the repository
git clone https://github.com/your-org/nextjs-auth-start-kit
cd nextjs-auth-start-kit

# Install dependencies
npm install
# or
pnpm install

# Copy and configure environment variables
cp .env.example .env.local
```

### Auth0 Setup

1. Create an application in the [Auth0 Dashboard](https://manage.auth0.com)
2. Set **Application Type** to "Regular Web Application"
3. Add `http://localhost:3000/api/auth/callback/auth0` to **Allowed Callback URLs**
4. Add `http://localhost:3000` to **Allowed Logout URLs**
5. Enable **Refresh Token Rotation** in the application settings
6. Fill in the values in `.env.local`

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

```bash
npm run build
npm start
```

## 🔐 Authentication

The starter uses **NextAuth.js v5** with Auth0 as the primary provider, mirroring the Nuxt kit's `@sidebase/nuxt-auth` setup.

### Key auth features:

- Auth0 OAuth provider with refresh token support
- Optional GitHub and Google OAuth providers (toggle via env vars)
- Automatic access token refresh before expiry
- Token error state handling (`RefreshAccessTokenError`)
- Route protection via Next.js middleware
- Typed session data with custom fields

### useAuthentication hook

Equivalent to the Nuxt kit's `useAuthentication` composable:

```typescript
const { user, isAuthenticated, isLoading, login, logout, accessToken } = useAuthentication()
```

## 🌍 Internationalization

Supports 5 languages out of the box. The locale is automatically detected and can be prefixed in the URL for non-default locales.

Add translations to the `messages/` directory.

## 🧪 Testing

```bash
# Unit tests
npm run test

# Unit tests with UI
npm run test:ui

# Unit tests with coverage
npm run test:coverage

# E2E tests
npm run test:e2e

# E2E tests with UI
npm run test:e2e:ui
```

## 🔄 Nuxt → Next.js Equivalency

| Nuxt (Original)        | Next.js (This Kit)          |
| ---------------------- | --------------------------- |
| `@sidebase/nuxt-auth`  | `next-auth` v5              |
| `Auth0` provider       | Auth0 provider (same)       |
| Nuxt middleware        | Next.js middleware          |
| `useAuthentication.ts` | `useAuthentication.ts` hook |
| Pinia store            | Zustand store               |
| `@nuxt/content`        | MDX / content directory     |
| `@nuxt/fonts`          | `next/font`                 |
| Nuxt i18n              | `next-intl`                 |
| Vitest                 | Vitest (same)               |
| Playwright             | Playwright (same)           |
| Renovate               | Renovate (same)             |
| GitHub Actions         | GitHub Actions (same)       |

## 📄 License

MIT — see [LICENSE](./LICENSE)
