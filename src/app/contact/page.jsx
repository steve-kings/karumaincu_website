'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    // Handle form submission
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 3000)
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 text-white">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img 
            src="/fellowship.jpg" 
            alt="Contact Background" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-purple-900/80"></div>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="font-heading font-bold text-5xl md:text-6xl mb-6">
              Contact Us
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90">
              Get in Touch with KarUCU Main Campus
            </p>
            <p className="text-lg max-w-3xl mx-auto leading-relaxed">
              We'd love to hear from you! Whether you have questions, prayer requests, or want to get involved, reach out to us.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <h2 className="font-heading font-bold text-3xl text-gray-800 mb-6">
                Send Us a Message
              </h2>
              
              {submitted && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
                  Thank you! Your message has been sent successfully.
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Your Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Wanjiku Mwangi"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="wanjiku@student.karu.ac.ke"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="How can we help?"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Message
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="6"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Your message..."
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all"
                >
                  Send Message
                </button>
              </form>
            </div>

            {/* Contact Information */}
            <div>
              <h2 className="font-heading font-bold text-3xl text-gray-800 mb-6">
                Contact Information
              </h2>

              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                    <i className="fas fa-map-marker-alt text-purple-600 text-xl"></i>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-gray-800 mb-1">Location</h3>
                    <p className="text-gray-600">
                      Karatina University<br />
                      Main Campus<br />
                      Karatina, Kenya
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                    <i className="fas fa-envelope text-teal-600 text-xl"></i>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-gray-800 mb-1">Email</h3>
                    <p className="text-gray-600">
                      info@karumaincu.org
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                    <i className="fas fa-calendar-alt text-amber-600 text-xl"></i>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-gray-800 mb-1">Weekly Activities</h3>
                    <p className="text-gray-600">
                      Sunday Service<br />
                      Monday Bible Study<br />
                      Thursday Fellowship<br />
                      Weekly Prayers
                    </p>
                  </div>
                </div>
              </div>

              {/* Social Media */}
              <div className="mt-8">
                <h3 className="font-semibold text-lg text-gray-800 mb-4">Follow Us</h3>
                <div className="flex space-x-4">
                  <a
                    href="https://www.youtube.com/@karucumain"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 bg-red-600 hover:bg-red-700 text-white rounded-full flex items-center justify-center transition-colors"
                  >
                    <i className="fab fa-youtube text-xl"></i>
                  </a>
                  <a
                    href="#"
                    className="w-12 h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center justify-center transition-colors"
                  >
                    <i className="fab fa-facebook-f text-xl"></i>
                  </a>
                  <a
                    href="#"
                    className="w-12 h-12 bg-blue-400 hover:bg-blue-500 text-white rounded-full flex items-center justify-center transition-colors"
                  >
                    <i className="fab fa-twitter text-xl"></i>
                  </a>
                  <a
                    href="#"
                    className="w-12 h-12 bg-pink-600 hover:bg-pink-700 text-white rounded-full flex items-center justify-center transition-colors"
                  >
                    <i className="fab fa-instagram text-xl"></i>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="font-heading font-bold text-3xl text-center text-gray-800 mb-12">
            Quick Links
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { title: 'About Us', href: '/about', icon: 'fas fa-info-circle' },
              { title: 'Leadership', href: '/leadership', icon: 'fas fa-users' },
              { title: 'Events', href: '/events', icon: 'fas fa-calendar' },
              { title: 'Prayer Requests', href: '/prayer', icon: 'fas fa-praying-hands' }
            ].map((link, index) => (
              <Link
                key={index}
                href={link.href}
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all text-center"
              >
                <i className={`${link.icon} text-3xl text-purple-600 mb-3`}></i>
                <h3 className="font-semibold text-gray-800">{link.title}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
