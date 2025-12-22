import { NextResponse } from 'next/server'

// Get M-Pesa access token
async function getAccessToken() {
  const consumerKey = process.env.MPESA_CONSUMER_KEY
  const consumerSecret = process.env.MPESA_CONSUMER_SECRET
  const environment = process.env.MPESA_ENVIRONMENT || 'sandbox'
  
  const baseUrl = environment === 'production' 
    ? 'https://api.safaricom.co.ke'
    : 'https://sandbox.safaricom.co.ke'

  const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64')

  const response = await fetch(`${baseUrl}/oauth/v1/generate?grant_type=client_credentials`, {
    method: 'GET',
    headers: {
      'Authorization': `Basic ${auth}`
    }
  })

  const data = await response.json()
  return data.access_token
}

// Generate timestamp
function getTimestamp() {
  const date = new Date()
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')
  return `${year}${month}${day}${hours}${minutes}${seconds}`
}

// Generate password
function generatePassword(shortcode, passkey, timestamp) {
  return Buffer.from(`${shortcode}${passkey}${timestamp}`).toString('base64')
}

export async function POST(request) {
  try {
    const body = await request.json()
    const { phoneNumber, amount } = body

    // Validate inputs
    if (!phoneNumber || !amount) {
      return NextResponse.json(
        { success: false, message: 'Phone number and amount are required' },
        { status: 400 }
      )
    }

    // Validate amount
    const numAmount = parseInt(amount)
    if (isNaN(numAmount) || numAmount < 1) {
      return NextResponse.json(
        { success: false, message: 'Invalid amount' },
        { status: 400 }
      )
    }

    // Format phone number (remove leading 0 or +254, ensure starts with 254)
    let formattedPhone = phoneNumber.toString().replace(/\s/g, '')
    if (formattedPhone.startsWith('+')) {
      formattedPhone = formattedPhone.substring(1)
    }
    if (formattedPhone.startsWith('0')) {
      formattedPhone = '254' + formattedPhone.substring(1)
    }
    if (!formattedPhone.startsWith('254')) {
      formattedPhone = '254' + formattedPhone
    }

    // Validate phone number format
    if (!/^254[17]\d{8}$/.test(formattedPhone)) {
      return NextResponse.json(
        { success: false, message: 'Invalid phone number format. Use format: 07XXXXXXXX or 01XXXXXXXX' },
        { status: 400 }
      )
    }

    const environment = process.env.MPESA_ENVIRONMENT || 'sandbox'
    const baseUrl = environment === 'production' 
      ? 'https://api.safaricom.co.ke'
      : 'https://sandbox.safaricom.co.ke'

    const shortcode = process.env.MPESA_SHORTCODE
    const passkey = process.env.MPESA_PASSKEY
    const callbackUrl = process.env.MPESA_CALLBACK_URL

    // Get access token
    const accessToken = await getAccessToken()
    
    if (!accessToken) {
      return NextResponse.json(
        { success: false, message: 'Failed to authenticate with M-Pesa' },
        { status: 500 }
      )
    }

    const timestamp = getTimestamp()
    const password = generatePassword(shortcode, passkey, timestamp)

    // STK Push request
    const stkResponse = await fetch(`${baseUrl}/mpesa/stkpush/v1/processrequest`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        BusinessShortCode: shortcode,
        Password: password,
        Timestamp: timestamp,
        TransactionType: 'CustomerPayBillOnline',
        Amount: numAmount,
        PartyA: formattedPhone,
        PartyB: shortcode,
        PhoneNumber: formattedPhone,
        CallBackURL: callbackUrl,
        AccountReference: 'KarUCU Donation',
        TransactionDesc: 'Donation to KarUCU Main Campus'
      })
    })

    const stkData = await stkResponse.json()

    if (stkData.ResponseCode === '0') {
      return NextResponse.json({
        success: true,
        message: 'STK push sent successfully. Please check your phone and enter your M-Pesa PIN.',
        data: {
          checkoutRequestId: stkData.CheckoutRequestID,
          merchantRequestId: stkData.MerchantRequestID
        }
      })
    } else {
      return NextResponse.json({
        success: false,
        message: stkData.errorMessage || stkData.ResponseDescription || 'Failed to initiate payment',
        error: stkData
      }, { status: 400 })
    }

  } catch (error) {
    console.error('M-Pesa STK Push error:', error)
    return NextResponse.json(
      { success: false, message: 'An error occurred while processing payment', error: error.message },
      { status: 500 }
    )
  }
}
