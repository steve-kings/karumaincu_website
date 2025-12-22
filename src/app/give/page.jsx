'use client'

import { useState } from 'react'
import Link from 'next/link'
import toast from 'react-hot-toast'

export default function GivePage() {
  const [amount, setAmount] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!amount || parseInt(amount) < 1) {
      toast.error('Please enter a valid amount (minimum KES 1)')
      return
    }

    if (!phoneNumber) {
      toast.error('Please enter your M-Pesa phone number')
      return
    }

    const cleanPhone = phoneNumber.replace(/\s/g, '')
    if (!/^(07|01|254|\+254)\d{8,9}$/.test(cleanPhone)) {
      toast.error('Please enter a valid Safaricom phone number')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/mpesa/stkpush', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phoneNumber: cleanPhone,
          amount: parseInt(amount)
        })
      })

      const data = await response.json()

      if (data.success) {
        setSuccess(true)
        toast.success('Check your phone for the M-Pesa prompt!')
      } else {
        toast.error(data.message || 'Failed to initiate payment')
      }
    } catch (error) {
      console.error('Payment error:', error)
      toast.error('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setSuccess(false)
    setAmount('')
    setPhoneNumber('')
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-black py-12">
        <div className="max-w-md mx-auto px-4">
          <div className="bg-white dark:bg-neutral-950 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-neutral-900 text-center">
            <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <i className="fas fa-check text-4xl text-green-600"></i>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              STK Push Sent!
            </h2>
            <p className="text-gray-600 dark:text-neutral-400 mb-6">
              Check your phone and enter your M-Pesa PIN to complete the donation of <strong>KES {amount}</strong>.
            </p>
            <button
              onClick={resetForm}
              className="w-full py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors"
            >
              Make Another Donation
            </button>
            <Link href="/" className="block mt-4 text-purple-600 dark:text-purple-400 font-medium">
              <i className="fas fa-arrow-left mr-2"></i>Back to Home
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black py-12">
      <div className="max-w-md mx-auto px-4">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block mb-4">
            <img src="/logo.png" alt="KarUCU Logo" className="w-16 h-16 mx-auto object-contain" />
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Support KarUCU Ministry
          </h1>
          <p className="text-gray-600 dark:text-neutral-400 text-sm">
            Your giving helps us reach more students with the Gospel.
          </p>
        </div>

        <div className="bg-white dark:bg-neutral-950 rounded-2xl shadow-xl p-6 border border-gray-200 dark:border-neutral-900">
          <form onSubmit={handleSubmit}>
            <div className="mb-5">
              <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                Amount (KES)
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount"
                className="w-full px-4 py-3 border border-gray-300 dark:border-neutral-800 rounded-lg bg-white dark:bg-neutral-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent text-lg"
                min="1"
              />
            </div>

            <div className="mb-5">
              <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                M-Pesa Phone Number
              </label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="07XX XXX XXX"
                className="w-full px-4 py-3 border border-gray-300 dark:border-neutral-800 rounded-lg bg-white dark:bg-neutral-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3 mb-5">
              <p className="text-sm text-green-700 dark:text-green-400">
                <i className="fas fa-mobile-alt mr-2"></i>
                You'll receive an STK push. Enter your M-Pesa PIN to complete.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading || !amount || !phoneNumber}
              className="w-full py-4 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : (
                <>
                  <i className="fas fa-heart mr-2"></i>
                  Donate via M-Pesa
                </>
              )}
            </button>
          </form>

          <p className="mt-4 text-center text-xs text-gray-500 dark:text-neutral-500 italic">
            "God loves a cheerful giver." - 2 Cor 9:7
          </p>
        </div>

        <div className="mt-6 text-center">
          <Link href="/" className="text-purple-600 dark:text-purple-400 font-medium text-sm">
            <i className="fas fa-arrow-left mr-2"></i>Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}
