import type { Metadata, Viewport } from 'next'
import { Analytics } from '@vercel/analytics/next'
import { AuthProvider } from '@/lib/auth-context'
import { CartProvider } from '@/lib/cart-context'
import { MobileBottomNav } from '@/components/mobile-bottom-nav'
import { Toaster } from '@/components/ui/sonner'
import './globals.css'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: '#a00404',
}

export const metadata: Metadata = {
  title: 'Shri Aaum | Authentic Spiritual Products',
  description: 'Discover authentic spiritual products - puja items, idols, gemstones, malas, and sacred scriptures. Experience divine blessings delivered to your doorstep.',
  generator: 'v0.app',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Shri Aaum',
  },
  icons: {
    icon: '/favicon.png',
    apple: '/favicon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <script src="https://checkout.razorpay.com/v1/checkout.js" async />
      </head>
      <body className="font-sans antialiased overscroll-none">
        <AuthProvider>
          <CartProvider>
            <div className="pb-14 lg:pb-0">
              {children}
            </div>
            <MobileBottomNav />
            <Toaster position="top-center" richColors duration={3000} closeButton />
          </CartProvider>
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  )
}
