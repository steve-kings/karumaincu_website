import Link from 'next/link'

export const metadata = {
  title: 'Privacy Policy - KarUCU Main Campus',
  description: 'Privacy Policy for Karatina University Christian Union Main Campus website'
}

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <Link href="/" className="inline-flex items-center text-purple-600 dark:text-purple-400 hover:underline mb-6">
          <i className="fas fa-arrow-left mr-2"></i>
          Back to Home
        </Link>

        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Privacy Policy
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Last updated: February 2026
        </p>

        <div className="prose prose-lg dark:prose-invert max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">1. Introduction</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Welcome to Karatina University Christian Union (KarUCU) Main Campus website. We respect your privacy and are committed to protecting your personal data. This privacy policy explains how we collect, use, and safeguard your information when you use our website and services.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">2. Information We Collect</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              We collect the following types of information:
            </p>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2">
              <li><strong>Personal Information:</strong> Name, email address, phone number, registration number, course, year of study</li>
              <li><strong>Account Information:</strong> Username, password (encrypted), profile photo</li>
              <li><strong>Usage Data:</strong> Pages visited, time spent on site, browser type, IP address</li>
              <li><strong>Content:</strong> Blog posts, prayer requests, comments, and other user-generated content</li>
              <li><strong>Payment Information:</strong> M-Pesa phone numbers for donations (processed securely through Safaricom)</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">3. How We Use Your Information</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              We use your information for the following purposes:
            </p>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2">
              <li>To create and manage your account</li>
              <li>To provide access to member-only features</li>
              <li>To communicate important CU announcements and updates</li>
              <li>To process event registrations and Bible study sign-ups</li>
              <li>To facilitate leadership elections and nominations</li>
              <li>To process donations securely</li>
              <li>To improve our website and services</li>
              <li>To respond to your inquiries and support requests</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">4. Data Security</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              We implement industry-standard security measures to protect your data:
            </p>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2">
              <li>Passwords are encrypted using bcrypt hashing</li>
              <li>Secure HTTPS connection for all data transmission</li>
              <li>HTTP-only cookies for session management</li>
              <li>Regular security audits and updates</li>
              <li>Access controls and role-based permissions</li>
              <li>Secure database with regular backups</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">5. Data Sharing</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following circumstances:
            </p>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2">
              <li><strong>With Your Consent:</strong> When you explicitly agree to share information</li>
              <li><strong>CU Leadership:</strong> Authorized CU leaders may access member information for administrative purposes</li>
              <li><strong>Service Providers:</strong> Third-party services like Cloudinary (image hosting) and M-Pesa (payments) process data on our behalf</li>
              <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">6. Your Rights</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              You have the following rights regarding your personal data:
            </p>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2">
              <li><strong>Access:</strong> Request a copy of your personal data</li>
              <li><strong>Correction:</strong> Update or correct your information through your profile</li>
              <li><strong>Deletion:</strong> Request deletion of your account and data</li>
              <li><strong>Opt-out:</strong> Unsubscribe from communications</li>
              <li><strong>Data Portability:</strong> Request your data in a portable format</li>
            </ul>
            <p className="text-gray-700 dark:text-gray-300 mt-4">
              To exercise these rights, contact us at <a href="mailto:karumaincu@gmail.com" className="text-purple-600 dark:text-purple-400 hover:underline">karumaincu@gmail.com</a>
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">7. Cookies</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              We use cookies and similar technologies to:
            </p>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2">
              <li>Keep you logged in</li>
              <li>Remember your preferences</li>
              <li>Analyze site usage</li>
              <li>Improve user experience</li>
            </ul>
            <p className="text-gray-700 dark:text-gray-300 mt-4">
              You can control cookies through your browser settings.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">8. Children's Privacy</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Our services are intended for university students (18+ years). We do not knowingly collect information from children under 18. If you believe we have collected such information, please contact us immediately.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">9. Changes to This Policy</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              We may update this privacy policy from time to time. We will notify you of significant changes by posting a notice on our website or sending an email. Your continued use of our services after changes constitutes acceptance of the updated policy.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">10. Contact Us</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              If you have questions about this privacy policy or our data practices, please contact us:
            </p>
            <div className="bg-gray-50 dark:bg-neutral-900 p-4 rounded-lg">
              <p className="text-gray-700 dark:text-gray-300">
                <strong>Email:</strong> <a href="mailto:karumaincu@gmail.com" className="text-purple-600 dark:text-purple-400 hover:underline">karumaincu@gmail.com</a><br />
                <strong>Location:</strong> Karatina University, Main Campus<br />
                <strong>Website:</strong> <a href="https://karumaincu.org" className="text-purple-600 dark:text-purple-400 hover:underline">karumaincu.org</a>
              </p>
            </div>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-neutral-800">
          <p className="text-center text-gray-600 dark:text-gray-400">
            <Link href="/terms" className="text-purple-600 dark:text-purple-400 hover:underline">
              Terms of Service
            </Link>
            {' | '}
            <Link href="/contact" className="text-purple-600 dark:text-purple-400 hover:underline">
              Contact Us
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
