import { NextResponse } from 'next/server'
import { verifyAuth } from '@/lib/auth'
import { query } from '@/lib/db'
import { sendEmail } from '@/lib/email'

// Send thank you email for nomination
async function sendThankYouEmail(nominator, nominee, election, position) {
  // Ensure we have names to use
  const nominatorName = nominator.full_name || nominator.email || 'Member'
  const nomineeName = nominee.full_name || nominee.email || 'Nominee'
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Thank You for Your Nomination</title>
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
        .nomination-box {
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
          color: white;
          padding: 20px;
          border-radius: 8px;
          margin: 20px 0;
        }
        .nomination-box h3 {
          margin: 0 0 10px 0;
          font-size: 18px;
        }
        .nomination-box p {
          margin: 5px 0;
          opacity: 0.95;
        }
        .info-box {
          background: #f3f4f6;
          padding: 15px;
          border-radius: 6px;
          margin: 15px 0;
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
          <div class="logo">🗳️ Thank You for Voting!</div>
          <p style="color: #6b7280; margin: 0;">KarUCU Leadership Elections</p>
        </div>
        
        <div class="content">
          <h2 style="color: #1f2937; margin-bottom: 20px;">Your Vote Has Been Recorded</h2>
          
          <p>Dear ${nominatorName},</p>
          
          <p>Thank you for participating in the <strong>${election.title}</strong>! Your nomination has been successfully recorded.</p>
          
          <div class="nomination-box">
            <h3>📋 Nomination Details</h3>
            <p><strong>Position:</strong> ${position}</p>
            <p><strong>Nominee:</strong> ${nomineeName}</p>
            <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
          </div>
          
          <p>Your voice matters in shaping the future leadership of KarUCU Main Campus. By participating in this election, you're helping to identify and support the leaders who will guide our community.</p>
          
          <div class="info-box">
            <p style="margin: 0;"><strong>📊 Election Information:</strong></p>
            <p style="margin: 5px 0 0 0;">Election ends: ${new Date(election.end_date).toLocaleString()}</p>
            <p style="margin: 5px 0 0 0;">You can nominate up to ${election.max_nominations_per_member} members total</p>
          </div>
          
          <p><strong>What's Next?</strong></p>
          <ul>
            <li>You can continue nominating other members for different positions</li>
            <li>Results will be announced after the election closes</li>
            <li>All nominations are confidential</li>
          </ul>
          
          <p>Thank you for being an active member of our community and for taking the time to participate in this important process.</p>
          
          <p style="margin-top: 25px;">
            <strong>God bless you,</strong><br>
            KarUCU Leadership Team
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
Thank You for Your Nomination!

Dear ${nominatorName},

Thank you for participating in the ${election.title}! Your nomination has been successfully recorded.

NOMINATION DETAILS:
- Position: ${position}
- Nominee: ${nomineeName}
- Date: ${new Date().toLocaleString()}

Your voice matters in shaping the future leadership of KarUCU Main Campus.

Election ends: ${new Date(election.end_date).toLocaleString()}
You can nominate up to ${election.max_nominations_per_member} members total.

What's Next?
- You can continue nominating other members for different positions
- Results will be announced after the election closes
- All nominations are confidential

Thank you for being an active member of our community!

God bless you,
KarUCU Leadership Team

---
KarUCU Main Campus
Karatina University Christian Union

This is an automated email. Please do not reply to this message.
  `

  return await sendEmail({
    to: nominator.email,
    subject: `Thank You for Your Nomination - ${election.title}`,
    html,
    text,
  })
}

// GET - Get user's nominations
export async function GET(request) {
  try {
    const user = await verifyAuth(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const nominations = await query(
      `SELECT 
        ln.*,
        u.full_name as nominee_name,
        u.email as nominee_email,
        u.registration_number,
        u.course,
        u.year_of_study,
        le.title as election_title
       FROM leader_nominations ln
       JOIN users u ON ln.nominee_id = u.id
       JOIN leader_elections le ON ln.election_id = le.id
       WHERE ln.nominator_id = ?
       ORDER BY ln.created_at DESC`,
      [user.id]
    )

    return NextResponse.json(nominations)
  } catch (error) {
    console.error('Error fetching nominations:', error)
    return NextResponse.json({ 
      error: 'Failed to fetch nominations',
      message: error.message 
    }, { status: 500 })
  }
}

// POST - Submit nomination
export async function POST(request) {
  try {
    const user = await verifyAuth(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { election_id, nominee_id, position, reason } = body

    if (!election_id || !nominee_id || !position) {
      return NextResponse.json({ 
        error: 'Election ID, nominee ID, and position are required' 
      }, { status: 400 })
    }

    // Check if election is open
    const election = await query(
      `SELECT * FROM leader_elections 
       WHERE id = ? AND status = 'open' 
       AND start_date <= NOW() AND end_date >= NOW()`,
      [election_id]
    )

    if (election.length === 0) {
      return NextResponse.json({ 
        error: 'Election is not open or does not exist' 
      }, { status: 400 })
    }

    // Check if user has reached max nominations
    const count = await query(
      'SELECT COUNT(*) as count FROM leader_nominations WHERE election_id = ? AND nominator_id = ?',
      [election_id, user.id]
    )

    if (count[0].count >= election[0].max_nominations_per_member) {
      return NextResponse.json({ 
        error: `You have reached the maximum of ${election[0].max_nominations_per_member} nominations` 
      }, { status: 400 })
    }

    // Check if nominee exists and is active
    const nominee = await query(
      'SELECT * FROM users WHERE id = ? AND status = "active"',
      [nominee_id]
    )

    if (nominee.length === 0) {
      return NextResponse.json({ 
        error: 'Nominee not found or inactive' 
      }, { status: 400 })
    }

    // Cannot nominate yourself
    if (nominee_id === user.id) {
      return NextResponse.json({ 
        error: 'You cannot nominate yourself' 
      }, { status: 400 })
    }

    // Check if user has already voted for this position
    const existingVote = await query(
      'SELECT * FROM leader_nominations WHERE election_id = ? AND nominator_id = ? AND position = ?',
      [election_id, user.id, position]
    )

    if (existingVote.length > 0) {
      return NextResponse.json({ 
        error: `You have already voted for the ${position} position` 
      }, { status: 400 })
    }

    // Insert nomination
    const result = await query(
      `INSERT INTO leader_nominations 
       (election_id, nominator_id, nominee_id, position, reason) 
       VALUES (?, ?, ?, ?, ?)`,
      [election_id, user.id, nominee_id, position, reason]
    )

    const newNomination = await query(
      `SELECT 
        ln.*,
        u.full_name as nominee_name,
        u.email as nominee_email
       FROM leader_nominations ln
       JOIN users u ON ln.nominee_id = u.id
       WHERE ln.id = ?`,
      [result.insertId]
    )

    // Send thank you email (don't wait for it to complete)
    sendThankYouEmail(user, nominee[0], election[0], position).catch(err => {
      console.error('Error sending thank you email:', err)
    })

    return NextResponse.json(newNomination[0], { status: 201 })
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return NextResponse.json({ 
        error: 'You have already voted for this position' 
      }, { status: 400 })
    }
    console.error('Error creating nomination:', error)
    return NextResponse.json({ 
      error: 'Failed to create nomination',
      message: error.message 
    }, { status: 500 })
  }
}
