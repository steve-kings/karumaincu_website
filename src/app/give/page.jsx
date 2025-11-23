'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function GivePage() {
  const [amount, setAmount] = useState('')
  const [customAmount, setCustomAmount] = useState('')
  const [selectedMethod, setSelectedMethod] = useState('mpesa')

  const quickAmounts = [500, 1000, 2000, 5000, 10000]

  const handleSubmit = (e) => {
    e.preventDefault()
    const finalAmount = amount === 'custom' ? customAmount : amount
    if (!finalAmount || finalAmount <= 0) {
      alert('Please enter a valid amount')
      return
    }
    alert('Thank you for your donation of KES ' + finalAmount + '!')
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <Link href="/" className="inline-block mb-6">
            <img src="/logo.png" alt="KarUCU Logo" className="w-20 h-20 mx-auto object-contain" />
          </Link>
          <h1 className="text-4xl font-heading font-bold text-gray-900 dark:text-white mb-4">
            Support KarUCU Ministry
          </h1>
          <p className="text-lg text-gray-600 dark:text-neutral-400 max-w-2xl mx-auto">
            Your generous giving helps us reach more students with the Gospel.
          </p>
        </div>

        <div className="bg-white dark:bg-neutral-950 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-neutral-900">
          <form onSubmit={handleSubmit}>
            <div className="mb-8">
              <label className="block text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Select Amount (KES)
              </label>
              <div className="grid grid-cols-3 md:grid-cols-5 gap-3 mb-4">
                {quickAmounts.map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setAmount(amt.toString())}
                    className={'py-3 px-4 rounded-lg font-semibold transition-all ' + (amount === amt.toString() ? 'bg-purple-600 text-white shadow-lg' : 'bg-gray-100 dark:bg-neutral-900 text-gray-700 dark:text-neutral-300 hover:bg-gray-200 dark:hover:bg-neutral-800')}
                  >
                    {amt.toLocaleString()}
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={() => setAmount('custom')}
                className={'w-full py-3 px-4 rounded-lg font-semibold transition-all ' + (amount === 'custom' ? 'bg-purple-600 text-white shadow-lg' : 'bg-gray-100 dark:bg-neutral-900 text-gray-700 dark:text-neutral-300 hover:bg-gray-200 dark:hover:bg-neutral-800')}
              >
                Custom Amount
              </button>
              
              {amount === 'custom' && (
                <div className="mt-4">
                  <input
                    type="number"
                    value={customAmount}
                    onChange={(e) => setCustomAmount(e.target.value)}
                    placeholder="Enter amount"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-neutral-800 rounded-lg bg-white dark:bg-neutral-900 text-gray-900 dark:text-white"
                    min="1"
                  />
                </div>
              )}
            </div>

            <div className="mb-8">
              <label className="block text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Payment Method
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  type="button"
                  onClick={() => setSelectedMethod('mpesa')}
                  className={'p-4 rounded-lg border-2 transition-all ' + (selectedMethod === 'mpesa' ? 'border-purple-600 bg-purple-50 dark:bg-purple-950/20' : 'border-gray-200 dark:border-neutral-800')}
                >
                  <div className="text-center">
                    <i className="fas fa-mobile-alt text-3xl text-green-600 mb-2"></i>
                    <p className="font-semibold text-gray-900 dark:text-white">M-Pesa</p>
                  </div>
                </button>
                
                <button
                  type="button"
                  onClick={() => setSelectedMethod('card')}
                  className={'p-4 rounded-lg border-2 transition-all ' + (selectedMethod === 'card' ? 'border-purple-600 bg-purple-50 dark:bg-purple-950/20' : 'border-gray-200 dark:border-neutral-800')}
                >
                  <div className="text-center">
                    <i className="fas fa-credit-card text-3xl text-blue-600 mb-2"></i>
                    <p className="font-semibold text-gray-900 dark:text-white">Card</p>
                  </div>
                </button>
                
                <button
                  type="button"
                  onClick={() => setSelectedMethod('bank')}
                  className={'p-4 rounded-lg border-2 transition-all ' + (selectedMethod === 'bank' ? 'border-purple-600 bg-purple-50 dark:bg-purple-950/20' : 'border-gray-200 dark:border-neutral-800')}
                >
                  <div className="text-center">
                    <i className="fas fa-university text-3xl text-purple-600 mb-2"></i>
                    <p className="font-semibold text-gray-900 dark:text-white">Bank</p>
                  </div>
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-bold text-lg hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg"
            >
              <i className="fas fa-heart mr-2"></i>
              Give Now
            </button>
          </form>
        </div>

        <div className="mt-8 text-center">
          <Link href="/" className="inline-flex items-center text-purple-600 dark:text-purple-400 hover:text-purple-700 font-medium">
            <i className="fas fa-arrow-left mr-2"></i>
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}
