import { NextResponse } from 'next/server'
import { verifyAuth } from '@/lib/auth'
import { executeQuery } from '@/lib/db'
import { sendEmail } from '@/lib/email'

// Send Bible Study registration confirmation email
async function sendBibleStudyConfirmationEmail(user, registration, session, location) {
  // Ensure we have a name to use
  const userName = registration.full_name || user.full_name || 'Member'
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Bible Study Registration Confirmed</title>
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
        .success-box {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: white;
          padding: 20px;
          border-radius: 8px;
          margin: 20px 0;
          text-align: center;
        }
        .success-box h3 {
          margin: 0 0 10px 0;
          font-size: 20px;
        }
        .details-box {
          background: #f3f4f6;
          padding: 20px;
          border-radius: 8px;
          margin: 20px 0;
        }
        .details-box h4 {
          margin: 0 0 15px 0;
          color: #1f2937;
        }
        .detail-row {
          display: flex;
          padding: 8px 0;
          border-bottom: 1px solid #e5e7eb;
        }
        .detail-row:last-child {
          border-bottom: none;
        }
        .detail-label {
          font-weight: 600;
          color: #6b7280;
          min-width: 150px;
        }
        .detail-value {
          color: #1f2937;
        }
        .info-box {
          background: #dbeafe;
          border-left: 4px solid #3b82f6;
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
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <img src="https://drive.google.com/uc?export=view&id=1vp8LSt-HRbMIUhLXpT1F3G93wKOe5iWS" alt="KarUCU Logo" style="width: 120px; height: auto; margin-bottom: 15px;" />
          <div class="logo">📖 Bible Study Registration</div>
          <p style="color: #6b7280; margin: 0;">KarUCU Main Campus</p>
        </div>
        
        <div class="content">
          <div class="success-box">
            <h3>✅ Registration Confirmed!</h3>
            <p style="margin: 5px 0; opacity: 0.95;">You're all set for Bible Study</p>
          </div>
          
          <p>Dear ${userName},</p>
          
          <p>Thank you for registering for our Bible Study session! We're excited to have you join us for a time of fellowship, learning, and spiritual growth.</p>
          
          <div class="details-box">
            <h4>📋 Your Registration Details</h4>
            <div class="detail-row">
              <div class="detail-label">Session:</div>
              <div class="detail-value">${session.title}</div>
            </div>
            <div class="detail-row">
              <div class="detail-label">Location:</div>
              <div class="detail-value">${location.name}</div>
            </div>
            <div class="detail-row">
              <div class="detail-label">Start Date:</div>
              <div class="detail-value">${new Date(session.start_date).toLocaleDateString()}</div>
            </div>
            <div class="detail-row">
              <div class="detail-label">End Date:</div>
              <div class="detail-value">${new Date(session.end_date).toLocaleDateString()}</div>
            </div>
            <div class="detail-row">
              <div class="detail-label">Your Email:</div>
              <div class="detail-value">${registration.email}</div>
            </div>
            ${registration.phone ? `
            <div class="detail-row">
              <div class="detail-label">Your Phone:</div>
              <div class="detail-value">${registration.phone}</div>
            </div>
            ` : ''}
            <div class="detail-row">
              <div class="detail-label">Status:</div>
              <div class="detail-value"><strong style="color: #10b981;">Approved ✓</strong></div>
            </div>
          </div>
          
          <div class="info-box">
            <p style="margin: 0;"><strong>ℹ️ What's Next?</strong></p>
            <ul style="margin: 10px 0 0 0; padding-left: 20px;">
              <li>Your registration has been automatically approved!</li>
              <li>You'll receive another email once assigned to a group</li>
              <li>Group assignments will be made by the admin</li>
              <li>Check your email regularly for group details</li>
            </ul>
          </div>
          
          <p><strong>What to Expect:</strong></p>
          <ul>
            <li>📖 In-depth Bible study and discussion</li>
            <li>🙏 Prayer and fellowship time</li>
            <li>👥 Small group interactions</li>
            <li>📝 Study materials and resources</li>
            <li>💬 Q&A sessions with leaders</li>
          </ul>
          
          <p><strong>Preparation Tips:</strong></p>
          <ul>
            <li>Bring your Bible (physical or digital)</li>
            <li>Come with an open heart and mind</li>
            <li>Prepare any questions you may have</li>
            <li>Be ready to participate and share</li>
          </ul>
          
          <p>If you have any questions or need to make changes to your registration, please contact us through the member portal or reach out to a Bible study coordinator.</p>
          
          <p style="margin-top: 25px;">
            <strong>We look forward to studying God's Word with you!</strong><br>
            KarUCU Bible Study Team
          </p>
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
Bible Study Registration Confirmed!

Dear ${userName},

Thank you for registering for our Bible Study session! We're excited to have you join us.

YOUR REGISTRATION DETAILS:
- Session: ${session.title}
- Location: ${location.name}
- Start Date: ${new Date(session.start_date).toLocaleDateString()}
- End Date: ${new Date(session.end_date).toLocaleDateString()}
- Your Email: ${registration.email}
${registration.phone ? `- Your Phone: ${registration.phone}` : ''}
- Status: Approved ✓

WHAT'S NEXT?
- Your registration has been automatically approved!
- You'll receive another email once assigned to a group
- Group assignments will be made by the admin
- Check your email regularly for group details

WHAT TO EXPECT:
- In-depth Bible study and discussion
- Prayer and fellowship time
- Small group interactions
- Study materials and resources
- Q&A sessions with leaders

PREPARATION TIPS:
- Bring your Bible (physical or digital)
- Come with an open heart and mind
- Prepare any questions you may have
- Be ready to participate and share

We look forward to studying God's Word with you!

KarUCU Bible Study Team

---
KarUCU Main Campus
Karatina University Christian Union

This is an automated email. Please do not reply to this message.
  `

  return await sendEmail({
    to: registration.email,
    subject: `Bible Study Registration Confirmed - ${session.title}`,
    html,
    text,
  })
}

// Bible Study Registration API
export async function POST(request) {
  try {
    const user = await verifyAuth(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { 
      session_id, 
      full_name, 
      email, 
      phone, 
      location_id, 
      year_of_study, 
      school, 
      registration_number, 
      notes 
    } = body

    // Validate required fields
    if (!session_id || !full_name || !email || !location_id || !year_of_study || !school) {
      return NextResponse.json({ 
        error: 'All required fields must be provided' 
      }, { status: 400 })
    }

    // Check if session exists and is open
    const [session] = await executeQuery(
      'SELECT * FROM bible_study_sessions WHERE id = ?',
      [session_id]
    )

    if (!session) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 })
    }

    if (!session.is_open) {
      return NextResponse.json({ 
        error: 'Registration is closed for this session' 
      }, { status: 400 })
    }

    // Check if deadline has passed
    if (new Date(session.registration_deadline) < new Date()) {
      return NextResponse.json({ 
        error: 'Registration deadline has passed' 
      }, { status: 400 })
    }

    // Check if user already registered for this session
    const [existing] = await executeQuery(
      'SELECT id FROM bible_study_registrations WHERE session_id = ? AND user_id = ?',
      [session_id, user.id]
    )

    if (existing) {
      return NextResponse.json({ 
        error: 'You are already registered for this session' 
      }, { status: 400 })
    }

    // Create registration with auto-approval
    const result = await executeQuery(
      `INSERT INTO bible_study_registrations 
       (session_id, user_id, full_name, email, phone, location_id, year_of_study, school, registration_number, notes, status) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'approved')`,
      [
        session_id, 
        user.id, 
        full_name, 
        email, 
        phone || null, 
        location_id, 
        year_of_study, 
        school, 
        registration_number || null, 
        notes || null
      ]
    )

    // Get the created registration with full details
    const [registration] = await executeQuery(
      `SELECT r.*, l.name as location_name, s.title as session_title
       FROM bible_study_registrations r
       LEFT JOIN study_locations l ON r.location_id = l.id
       LEFT JOIN bible_study_sessions s ON r.session_id = s.id
       WHERE r.id = ?`,
      [result.insertId]
    )

    // Get location details for email
    const [locationDetails] = await executeQuery(
      'SELECT * FROM study_locations WHERE id = ?',
      [location_id]
    )

    // Send confirmation email (don't wait for it to complete)
    sendBibleStudyConfirmationEmail(user, registration, session, locationDetails).catch(err => {
      console.error('Error sending Bible study confirmation email:', err)
    })

    return NextResponse.json({ 
      success: true, 
      message: 'Registration submitted successfully! Check your email for confirmation.',
      data: registration 
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating registration:', error)
    return NextResponse.json({ 
      error: 'Failed to submit registration',
      message: error.message 
    }, { status: 500 })
  }
}
