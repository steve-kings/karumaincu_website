import Link from 'next/link'

export const metadata = {
  title: 'Terms of Service - KarUCU Main Campus',
  description: 'Terms of Service for Karatina University Christian Union Main Campus website'
}

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <Link href="/" className="inline-flex items-center text-purple-600 dark:text-purple-400 hover:underline mb-6">
          <i className="fas fa-arrow-left mr-2"></i>
          Back to Home
        </Link>

        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Terms of Service
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Last updated: February 2026
        </p>

        <div className="prose prose-lg dark:prose-invert max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">1. Acceptance of Terms</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              By accessing and using the KarUCU Main Campus website (karumaincu.org), you accept and agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">2. Eligibility</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Our services are intended for:
            </p>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2">
              <li>Current students of Karatina University</li>
              <li>Alumni and associate members of KarUCU</li>
              <li>Visitors interested in learning about our ministry</li>
              <li>Individuals 18 years or older</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">3. User Accounts</h2>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">3.1 Registration</h3>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              To access member features, you must create an account by providing accurate and complete information. You are responsible for:
            </p>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2">
              <li>Maintaining the confidentiality of your password</li>
              <li>All activities that occur under your account</li>
              <li>Notifying us immediately of any unauthorized use</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 mt-6">3.2 Account Approval</h3>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              New accounts require admin approval. We reserve the right to reject or terminate accounts that violate these terms or provide false information.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">4. Acceptable Use</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              You agree to use our services only for lawful purposes. You must not:
            </p>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2">
              <li>Post offensive, abusive, or inappropriate content</li>
              <li>Harass, threaten, or harm other users</li>
              <li>Impersonate others or provide false information</li>
              <li>Violate any applicable laws or regulations</li>
              <li>Attempt to hack, disrupt, or compromise our systems</li>
              <li>Spam or send unsolicited messages</li>
              <li>Post content that infringes on intellectual property rights</li>
              <li>Share content that contradicts Christian values and teachings</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">5. Content Guidelines</h2>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">5.1 User-Generated Content</h3>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              When you submit content (blogs, comments, prayer requests), you:
            </p>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2">
              <li>Retain ownership of your content</li>
              <li>Grant us a license to display, distribute, and promote your content</li>
              <li>Confirm that your content does not violate any rights or laws</li>
              <li>Understand that content may be moderated or removed</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 mt-6">5.2 Content Moderation</h3>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              We reserve the right to review, edit, or remove any content that violates these terms or is deemed inappropriate. Blog posts and comments require approval before publication.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">6. Donations and Payments</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              When making donations through our platform:
            </p>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2">
              <li>All donations are voluntary and non-refundable</li>
              <li>Donations support KarUCU ministry activities and programs</li>
              <li>M-Pesa transactions are processed securely through Safaricom</li>
              <li>We do not store your payment information</li>
              <li>You are responsible for any transaction fees</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">7. Intellectual Property</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              All content on this website, including text, graphics, logos, images, and software, is the property of KarUCU or its content suppliers and is protected by copyright laws. You may not:
            </p>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2">
              <li>Copy, modify, or distribute our content without permission</li>
              <li>Use our logo or branding without authorization</li>
              <li>Scrape or extract data from our website</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">8. Privacy</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Your use of our services is also governed by our <Link href="/privacy" className="text-purple-600 dark:text-purple-400 hover:underline">Privacy Policy</Link>. Please review it to understand how we collect, use, and protect your information.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">9. Disclaimer of Warranties</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Our services are provided "as is" without warranties of any kind. We do not guarantee that:
            </p>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2">
              <li>The website will be uninterrupted or error-free</li>
              <li>Defects will be corrected immediately</li>
              <li>The website is free from viruses or harmful components</li>
              <li>Information provided is always accurate or complete</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">10. Limitation of Liability</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              To the fullest extent permitted by law, KarUCU shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of our services.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">11. Termination</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              We reserve the right to suspend or terminate your account at any time for:
            </p>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2">
              <li>Violation of these Terms of Service</li>
              <li>Fraudulent or illegal activity</li>
              <li>Prolonged inactivity</li>
              <li>Any reason at our discretion</li>
            </ul>
            <p className="text-gray-700 dark:text-gray-300 mt-4">
              You may also delete your account at any time by contacting us.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">12. Changes to Terms</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              We may update these Terms of Service from time to time. We will notify you of significant changes by posting a notice on our website. Your continued use of our services after changes constitutes acceptance of the updated terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">13. Governing Law</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              These Terms of Service are governed by the laws of Kenya. Any disputes shall be resolved in the courts of Kenya.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">14. Contact Information</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              If you have questions about these Terms of Service, please contact us:
            </p>
            <div className="bg-gray-50 dark:bg-neutral-900 p-4 rounded-lg">
              <p className="text-gray-700 dark:text-gray-300">
                <strong>Email:</strong> <a href="mailto:karumaincu@gmail.com" className="text-purple-600 dark:text-purple-400 hover:underline">karumaincu@gmail.com</a><br />
                <strong>Location:</strong> Karatina University, Main Campus<br />
                <strong>Website:</strong> <a href="https://karumaincu.org" className="text-purple-600 dark:text-purple-400 hover:underline">karumaincu.org</a>
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">15. Acknowledgment</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              By using our services, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
            </p>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-neutral-800">
          <p className="text-center text-gray-600 dark:text-gray-400">
            <Link href="/privacy" className="text-purple-600 dark:text-purple-400 hover:underline">
              Privacy Policy
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
