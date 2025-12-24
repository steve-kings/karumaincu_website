import { Inter, Poppins } from 'next/font/google'
import './globals.css'
import LayoutWrapper from '@/components/LayoutWrapper'
import { ThemeProvider } from '@/contexts/ThemeContext'
import GoogleOAuthProvider from '@/components/GoogleOAuthProvider'
import PWAInstall from '@/components/PWAInstall'

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-inter',
  display: 'swap',
})

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-poppins',
  display: 'swap',
})

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'),
  title: {
    default: 'KarUCU Main Campus - Karatina University Christian Union',
    template: '%s | KarUCU Main Campus'
  },
  description: 'Join KarUCU Main Campus - Karatina University Christian Union. Experience vibrant worship, Bible study, fellowship, and spiritual growth. Committed to serving the Lord and transforming campus life through Christ.',
  icons: {
    icon: '/logo.png',
    shortcut: '/logo.png',
    apple: '/logo.png',
  },
  keywords: [
    'Karatina University',
    'Christian Union',
    'KarUCU',
    'Campus Ministry',
    'Student Fellowship',
    'Bible Study',
    'Worship',
    'Prayer',
    'Spiritual Growth',
    'Kenya Christian Students',
    'University Ministry',
    'Campus Evangelism',
    'Christian Community',
    'Faith',
    'Discipleship'
  ],
  authors: [{ name: 'KarUCU Main Campus' }],
  creator: 'KarUCU Main Campus',
  publisher: 'Karatina University Christian Union',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_KE',
    url: '/',
    siteName: 'KarUCU Main Campus',
    title: 'KarUCU Main Campus - Karatina University Christian Union',
    description: 'Join KarUCU Main Campus - Experience vibrant worship, Bible study, fellowship, and spiritual growth. Committed to serving the Lord and transforming campus life through Christ.',
    images: [
      {
        url: '/logo.png',
        width: 1200,
        height: 630,
        alt: 'KarUCU Main Campus Logo',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'KarUCU Main Campus - Karatina University Christian Union',
    description: 'Join KarUCU Main Campus - Experience vibrant worship, Bible study, fellowship, and spiritual growth.',
    images: ['/logo.png'],
    creator: '@karucumain',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
    // bing: 'your-bing-verification-code',
  },
  alternates: {
    canonical: '/',
  },
  category: 'religion',
  manifest: "/manifest.json",
}

// Enable viewport optimization
export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#000000",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
        />
      </head>
      <body className={`${inter.variable} ${poppins.variable} font-sans antialiased`}>
        <GoogleOAuthProvider>
          <ThemeProvider>
            <PWAInstall />
            <LayoutWrapper>{children}</LayoutWrapper>
          </ThemeProvider>
        </GoogleOAuthProvider>
      </body>
    </html>
  )
}
