import Link from 'next/link'
import { Heart } from 'lucide-react'
import InstallButton from './InstallButton'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  const quickLinks = [
    { name: 'About Us', href: '/about' },
    { name: 'Leadership', href: '/leadership' },
    { name: 'Events', href: '/events' },
    { name: 'Gallery', href: '/media' },
  ]

  const spiritualLinks = [
    { name: 'Prayer Requests', href: '/prayer-requests' },
    { name: 'Bible Study', href: '/login' },
    { name: 'Sermons', href: '/media' },
    { name: 'Blog', href: '/blog' },
  ]

  const supportLinks = [
    { name: 'Give', href: '/give' },
    { name: 'Contact', href: '/contact' },
    { name: 'Join Us', href: '/register' },
    { name: 'Login', href: '/login' },
  ]

  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Organization Info */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-3 mb-6">
              <img 
                src="/logo.png" 
                alt="KarUCU Logo" 
                className="w-12 h-12 object-contain"
              />
              <div>
                <h3 className="font-heading font-bold text-xl">KarUCU</h3>
                <p className="text-sm text-gray-400">Main Campus</p>
              </div>
            </div>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Karatina University Christian Union - Main Campus. 
              Committed to serve the Lord through spiritual growth, 
              fellowship, and community service.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://www.facebook.com/karumain.cu.3"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center hover:bg-purple-700 transition-colors"
              >
                <span className="sr-only">Facebook</span>
                <i className="fab fa-facebook text-white"></i>
              </a>
              <a
                href="https://x.com/karumaincu"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center hover:bg-purple-700 transition-colors"
              >
                <span className="sr-only">Twitter/X</span>
                <i className="fab fa-twitter text-white"></i>
              </a>
              <a
                href="https://www.instagram.com/karucu_maincampus"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center hover:bg-purple-700 transition-colors"
              >
                <span className="sr-only">Instagram</span>
                <i className="fab fa-instagram text-white"></i>
              </a>
              <a
                href="https://www.youtube.com/@karucumain"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center hover:bg-purple-700 transition-colors"
              >
                <span className="sr-only">YouTube</span>
                <i className="fab fa-youtube text-white"></i>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading font-semibold text-lg mb-6 text-purple-400">
              Quick Links
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-300 hover:text-white hover:translate-x-1 transition-all duration-200 inline-block"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Spiritual Resources */}
          <div>
            <h4 className="font-heading font-semibold text-lg mb-6 text-purple-400">
              Spiritual Resources
            </h4>
            <ul className="space-y-3">
              {spiritualLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-300 hover:text-white hover:translate-x-1 transition-all duration-200 inline-block"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Support */}
          <div>
            <h4 className="font-heading font-semibold text-lg mb-6 text-purple-400">
              Contact & Support
            </h4>
            
            {/* Contact Info */}
            <div className="space-y-4 mb-6">
              <div className="flex items-start space-x-3">
                <i className="fas fa-map-marker-alt text-purple-400 mt-1 flex-shrink-0"></i>
                <div>
                  <p className="text-gray-300 text-sm">
                    Karatina University<br />
                    Main Campus<br />
                    Karatina, Kenya
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <i className="fas fa-envelope text-purple-400 flex-shrink-0"></i>
                <p className="text-gray-300 text-sm">info@karumaincu.org</p>
              </div>
            </div>

            {/* Support Links */}
            <ul className="space-y-3">
              {supportLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-300 hover:text-white hover:translate-x-1 transition-all duration-200 inline-block"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Call to Action Section */}
      <div className="bg-purple-600 py-8">
        <div className="container mx-auto px-4 text-center">
          <h3 className="font-heading font-bold text-2xl mb-4">
            Join Our Community of Faith
          </h3>
          <p className="text-purple-100 mb-6 max-w-2xl mx-auto">
            Experience spiritual growth, fellowship, and service opportunities 
            with fellow believers at Karatina University.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/register"
              className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              Become a Member
            </Link>
            <Link
              href="/give"
              className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-purple-600 px-8 py-3 rounded-lg font-semibold flex items-center justify-center space-x-2 transition-colors"
            >
              <Heart className="w-5 h-5" />
              <span>Support Our Ministry</span>
            </Link>
            <InstallButton />
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="bg-gray-800 py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-center md:text-left">
              <p className="text-gray-400 text-sm">
                © {currentYear} Karatina University Christian Union - Main Campus. 
                All rights reserved.
              </p>
              <p className="text-gray-500 text-xs mt-1">
                Developed by <a href="https://kingscreation.co.ke" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300 transition-colors">kingscreation.co.ke</a> • 2025
              </p>
            </div>
            <div className="flex items-center space-x-6 text-sm text-gray-400">
              <Link href="/privacy" className="hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-white transition-colors">
                Terms of Service
              </Link>
              <Link href="/contact" className="hover:text-white transition-colors">
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Scripture Footer */}
      <div className="bg-purple-900 py-4">
        <div className="container mx-auto px-4 text-center">
          <p className="text-purple-200 text-sm italic">
            "For where two or three gather in my name, there am I with them." - Matthew 18:20
          </p>
        </div>
      </div>
    </footer>
  )
}
