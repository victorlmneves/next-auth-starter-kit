import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts')

const nextConfig: NextConfig = {
    // Enable React strict mode for better development experience
    reactStrictMode: true,

    // Image optimization
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '*.auth0.com',
            },
            {
                protocol: 'https',
                hostname: 'avatars.githubusercontent.com',
            },
            {
                protocol: 'https',
                hostname: 'lh3.googleusercontent.com',
            },
        ],
    },

    // Experimental features
    experimental: {
        // Enable PPR for partial prerendering
        ppr: false,
    },
}

export default withNextIntl(nextConfig)
