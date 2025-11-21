import { NextResponse } from 'next/server'
import { verifyAuth } from '@/lib/auth'
import { executeQuery } from '@/lib/db'
import { sendEmail } from '@/lib/email'

// Send group assignment email
async function sendGroupAssignmentEmail(registration, session, location, groupNumber) {
  const userName = registration.full_name || registration.email || 'Member'
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Bible Study Group Assignment</title>
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
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
          color: white;
          padding: 20px;
          border-radius: 8px;
          margin: 20px 0;
          text-align: center;
        }
        .success-box h3 {
          margin: 0 0 10px 0;
          font-size: 24px;
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
          <div class="logo">👥 Group Assignment</div>
          <p style="color: #6b7280; margin: 0;">KarUCU Bible Study</p>
        </div>
        
        <div class="content">
          <div class="success-box">
            <h3>Group ${groupNumber}</h3>
            <p style="margin: 5px 0; opacity: 0.95;">You've been assigned to your study group!</p>
          </div>
          
          <p>Dear ${userName},</p>
          
          <p>Great news! You've been assigned to a Bible study group. We're excited to have you join your fellow members for this journey of spiritual growth and fellowship.</p>
          
          <div class="details-box">
            <h4>📋 Your Group Details</h4>
            <div class="detail-row">
              <div class="detail-label">Session:</div>
              <div class="detail-value">${session.title}</div>
            </div>
            <div class="detail-row">
              <div class="detail-label">Group Number:</div>
              <div class="detail-value"><strong>Group ${groupNumber}</strong></div>
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
          </div>
          
          <div class="info-box">
            <p style="margin: 0;"><strong>ℹ️ Important Information:</strong></p>
            <ul style="margin: 10px 0 0 0; padding-left: 20px;">
              <li>Your group leader will contact you with meeting details</li>
              <li>First meeting date and time will be communicated soon</li>
              <li>Bring your Bible and a notebook</li>
              <li>Be ready to participate and share</li>
            </ul>
          </div>
          
          <p><strong>What to Bring:</strong></p>
          <ul>
            <li>📖 Your Bible (physical or digital)</li>
            <li>📝 Notebook and pen for notes</li>
            <li>💡 Questions and insights to share</li>
            <li>❤️ An open heart and mind</li>
          </ul>
          
          <p><strong>Group Study Benefits:</strong></p>
          <ul>
            <li>Deeper understanding through discussion</li>
            <li>Accountability and encouragement</li>
            <li>Building lasting friendships</li>
            <li>Practical application of Scripture</li>
            <li>Prayer support from group members</li>
          </ul>
          
          <p>If you have any questions about your group assignment or need to make changes, please contact the Bible study coordinator through the member portal.</p>
          
          <p style="margin-top: 25px;">
            <strong>Looking forward to studying together!</strong><br>
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
Bible Study Group Assignment

Dear ${userName},

Great news! You've been assigned to a Bible study group.

YOUR GROUP DETAILS:
- Session: ${session.title}
- Group Number: Group ${groupNumber}
- Location: ${location.name}
- Start Date: ${new Date(session.start_date).toLocaleDateString()}
- End Date: ${new Date(session.end_date).toLocaleDateString()}

IMPORTANT INFORMATION:
- Your group leader will contact you with meeting details
- First meeting date and time will be communicated soon
- Bring your Bible and a notebook
- Be ready to participate and share

WHAT TO BRING:
- Your Bible (physical or digital)
- Notebook and pen for notes
- Questions and insights to share
- An open heart and mind

GROUP STUDY BENEFITS:
- Deeper understanding through discussion
- Accountability and encouragement
- Building lasting friendships
- Practical application of Scripture
- Prayer support from group members

Looking forward to studying together!

KarUCU Bible Study Team

---
KarUCU Main Campus
Karatina University Christian Union

This is an automated email. Please do not reply to this message.
  `

  return await sendEmail({
    to: registration.email,
    subject: `Bible Study Group Assignment - Group ${groupNumber}`,
    html,
    text,
  })
}

// POST - Auto-assign groups based on location
export async function POST(request) {
  try {
    const user = await verifyAuth(request)
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { session_id, location_id, members_per_group = 10 } = body

    if (!session_id) {
      return NextResponse.json({ error: 'Session ID is required' }, { status: 400 })
    }

    // Build query based on filters
    let query = `
      SELECT id FROM bible_study_registrations 
      WHERE session_id = ? AND status = 'approved'
    `
    const params = [session_id]

    if (location_id) {
      query += ' AND location_id = ?'
      params.push(location_id)
    }

    query += ' ORDER BY registered_at ASC'

    // Get all approved registrations
    const registrations = await executeQuery(query, params)

    if (registrations.length === 0) {
      return NextResponse.json({ 
        success: true, 
        message: 'No approved registrations to group',
        grouped: 0,
        total_groups: 0
      })
    }

    // Get session details for email
    const [session] = await executeQuery(
      'SELECT * FROM bible_study_sessions WHERE id = ?',
      [session_id]
    )

    // Assign groups and send emails
    let groupNumber = 1
    let memberCount = 0
    let emailsSent = 0

    for (const registration of registrations) {
      // Update group assignment
      await executeQuery(
        'UPDATE bible_study_registrations SET group_number = ? WHERE id = ?',
        [groupNumber, registration.id]
      )

      // Get full registration details for email
      const [fullRegistration] = await executeQuery(
        `SELECT r.*, l.name as location_name
         FROM bible_study_registrations r
         LEFT JOIN study_locations l ON r.location_id = l.id
         WHERE r.id = ?`,
        [registration.id]
      )

      // Get location details
      const [locationDetails] = await executeQuery(
        'SELECT * FROM study_locations WHERE id = ?',
        [fullRegistration.location_id]
      )

      // Send group assignment email (don't wait)
      sendGroupAssignmentEmail(fullRegistration, session, locationDetails, groupNumber).then(() => {
        emailsSent++
      }).catch(err => {
        console.error('Error sending group assignment email:', err)
      })

      memberCount++
      if (memberCount >= members_per_group) {
        groupNumber++
        memberCount = 0
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: `Successfully grouped ${registrations.length} members into ${groupNumber} groups. Emails are being sent.`,
      total_members: registrations.length,
      total_groups: groupNumber
    })
  } catch (error) {
    console.error('Error assigning groups:', error)
    return NextResponse.json({ 
      error: 'Failed to assign groups',
      message: error.message 
    }, { status: 500 })
  }
}
