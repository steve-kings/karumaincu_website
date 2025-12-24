'use client'

import { usePathname } from 'next/navigation'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'

export default function LayoutWrapper({ children }) {
  const pathname = usePathname()
  
  // Routes that have their own navigation/layout
  const dashboardRoutes = ['/admin', '/member', '/editor']
  const isDashboard = dashboardRoutes.some(route => pathname?.startsWith(route))

  if (isDashboard) {
    // Dashboard pages handle their own navigation
    return <main className="pt-0">{children}</main>
  }

  // Public pages get the global navigation and footer
  return (
    <>
      <Navigation />
      <main className="md:pt-24 pt-16">{children}</main>
      <Footer />
    </>
  )
}
