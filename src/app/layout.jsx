import { Inter, Poppins } from 'next/font/google'
import './globals.css'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import { SocketProvider } from '@/contexts/SocketContext'
import { ThemeProvider } from '@/contexts/ThemeContext'
import RealtimeNotifications from '@/components/RealtimeNotifications'
import GoogleOAuthProvider from '@/components/GoogleOAuthProvider'

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
  title: 'KarUCU Main Campus - Karatina University Christian Union',
  description: 'Committed to serve the Lord - Karatina University Christian Union Main Campus',
  metadataBase: new URL('http://localhost:3002'),
}

// Enable viewport optimization
export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
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
            <SocketProvider>
              <RealtimeNotifications />
              <Navigation />
              <main className="md:pt-24 pt-16">{children}</main>
              <Footer />
            </SocketProvider>
          </ThemeProvider>
        </GoogleOAuthProvider>
      </body>
    </html>
  )
}
