import nodemailer from 'nodemailer'

// Create reusable transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  })
}

// Send email function
export async function sendEmail({ to, subject, html, text }) {
  try {
    const transporter = createTransporter()

    const mailOptions = {
      from: `"${process.env.FROM_NAME}" <${process.env.FROM_EMAIL}>`,
      to,
      subject,
      text,
      html,
    }

    const info = await transporter.sendMail(mailOptions)
    console.log('Email sent:', info.messageId)
    return { success: true, messageId: info.messageId }
  } catch (error) {
    console.error('Error sending email:', error)
    return { success: false, error: error.message }
  }
}

// Password Reset Email Template
export function getPasswordResetEmailTemplate(resetUrl, userName) {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Password Reset Request</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .container {
          background: #ffffff;
          border-radius: 8px;
          padding: 30px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .header {
          text-align: center;
          margin-bottom: 30px;
        }
        .logo {
          font-size: 24px;
          font-weight: bold;
          color: #6366f1;
          margin-bottom: 10px;
        }
        .content {
          margin-bottom: 30px;
        }
        .button {
          display: inline-block;
          padding: 12px 30px;
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
          color: #ffffff !important;
          text-decoration: none;
          border-radius: 6px;
          font-weight: 600;
          text-align: center;
          margin: 20px 0;
        }
        .button:hover {
          background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
        }
        .warning {
          background: #fef3c7;
          border-left: 4px solid #f59e0b;
          padding: 15px;
          margin: 20px 0;
          border-radius: 4px;
        }
        .footer {
          text-align: center;
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid #e5e7eb;
          color: #6b7280;
          font-size: 14px;
        }
        .link {
          color: #6366f1;
          word-break: break-all;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <img src="https://drive.google.com/uc?export=view&id=1vp8LSt-HRbMIUhLXpT1F3G93wKOe5iWS" alt="KarUCU Logo" style="width: 120px; height: auto; margin-bottom: 15px;" />
          <div class="logo">🙏 KarUCU Main Campus</div>
          <p style="color: #6b7280; margin: 0;">Karatina University Christian Union</p>
        </div>
        
        <div class="content">
          <h2 style="color: #1f2937; margin-bottom: 20px;">Password Reset Request</h2>
          
          <p>Hello ${userName || 'there'},</p>
          
          <p>We received a request to reset your password for your KarUCU Main Campus account. If you didn't make this request, you can safely ignore this email.</p>
          
          <p>To reset your password, click the button below:</p>
          
          <div style="text-align: center;">
            <a href="${resetUrl}" class="button">Reset Password</a>
          </div>
          
          <p>Or copy and paste this link into your browser:</p>
          <p class="link">${resetUrl}</p>
          
          <div class="warning">
            <strong>⚠️ Security Notice:</strong>
            <ul style="margin: 10px 0 0 0; padding-left: 20px;">
              <li>This link will expire in 1 hour</li>
              <li>For security reasons, you can only use this link once</li>
              <li>Never share this link with anyone</li>
            </ul>
          </div>
          
          <p>If you're having trouble clicking the button, copy and paste the URL above into your web browser.</p>
        </div>
        
        <div class="footer">
          <p><strong>KarUCU Main Campus</strong></p>
          <p>Karatina University Christian Union</p>
          <p style="margin-top: 15px;">
            This is an automated email. Please do not reply to this message.
          </p>
          <p style="margin-top: 10px; font-size: 12px;">
            © ${new Date().getFullYear()} KarUCU Main Campus. All rights reserved.
          </p>
        </div>
      </div>
    </body>
    </html>
  `

  const text = `
Password Reset Request

Hello ${userName || 'there'},

We received a request to reset your password for your KarUCU Main Campus account.

To reset your password, visit this link:
${resetUrl}

This link will expire in 1 hour and can only be used once.

If you didn't request this password reset, you can safely ignore this email.

---
KarUCU Main Campus
Karatina University Christian Union

This is an automated email. Please do not reply to this message.
  `

  return { html, text }
}

// Welcome Email Template
export function getWelcomeEmailTemplate(userName, activationUrl) {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome to KarUCU Main Campus</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .container {
          background: #ffffff;
          border-radius: 8px;
          padding: 30px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .header {
          text-align: center;
          margin-bottom: 30px;
        }
        .logo {
          font-size: 24px;
          font-weight: bold;
          color: #6366f1;
          margin-bottom: 10px;
        }
        .button {
          display: inline-block;
          padding: 12px 30px;
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
          color: #ffffff !important;
          text-decoration: none;
          border-radius: 6px;
          font-weight: 600;
          text-align: center;
          margin: 20px 0;
        }
        .footer {
          text-align: center;
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid #e5e7eb;
          color: #6b7280;
          font-size: 14px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <img src="https://drive.google.com/uc?export=view&id=1vp8LSt-HRbMIUhLXpT1F3G93wKOe5iWS" alt="KarUCU Logo" style="width: 120px; height: auto; margin-bottom: 15px;" />
          <div class="logo">🙏 Welcome to KarUCU!</div>
        </div>
        
        <div class="content">
          <h2 style="color: #1f2937;">Welcome, ${userName}!</h2>
          
          <p>Thank you for registering with KarUCU Main Campus. We're excited to have you join our community!</p>
          
          <p>To activate your account and start your spiritual journey with us, please click the button below:</p>
          
          <div style="text-align: center;">
            <a href="${activationUrl}" class="button">Activate Account</a>
          </div>
          
          <p>Once activated, you'll have access to:</p>
          <ul>
            <li>📖 Bible reading plans and devotionals</li>
            <li>🙏 Prayer journal and community prayers</li>
            <li>✍️ Blog posts and testimonies</li>
            <li>📅 Events and fellowship activities</li>
            <li>👥 Connect with other members</li>
          </ul>
        </div>
        
        <div class="footer">
          <p><strong>KarUCU Main Campus</strong></p>
          <p>Karatina University Christian Union</p>
        </div>
      </div>
    </body>
    </html>
  `

  const text = `
Welcome to KarUCU Main Campus!

Hello ${userName},

Thank you for registering. To activate your account, visit:
${activationUrl}

We're excited to have you join our community!

---
KarUCU Main Campus
  `

  return { html, text }
}

// Send Password Reset Email
export async function sendPasswordResetEmail(email, resetToken, userName) {
  const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${resetToken}`
  const { html, text } = getPasswordResetEmailTemplate(resetUrl, userName)

  return await sendEmail({
    to: email,
    subject: 'Password Reset Request - KarUCU Main Campus',
    html,
    text,
  })
}

// Send Welcome Email
export async function sendWelcomeEmail(email, activationToken, userName) {
  const activationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/activate?token=${activationToken}`
  const { html, text } = getWelcomeEmailTemplate(userName, activationUrl)

  return await sendEmail({
    to: email,
    subject: 'Welcome to KarUCU Main Campus - Activate Your Account',
    html,
    text,
  })
}
