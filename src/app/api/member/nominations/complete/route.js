import { NextResponse } from 'next/server'
import { verifyAuth } from '@/lib/auth'
import { query } from '@/lib/db'
import { sendEmail } from '@/lib/email'

// Send completion summary email
async function sendCompletionEmail(user, election, nominations, positions) {
  // Ensure we have a name to use
  const userName = user.full_name || user.email || 'Member'
  
  const nominationsList = nominations.map(nom => 
    `<li><strong>${nom.position}:</strong> ${nom.nominee_name}</li>`
  ).join('')

  const positionsVoted = [...new Set(nominations.map(n => n.position))]
  const positionsNotVoted = positions.filter(p => !positionsVoted.includes(p))

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Nomination Complete - Thank You!</title>
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
        .summary-box {
          background: #f3f4f6;
          padding: 20px;
          border-radius: 8px;
          margin: 20px 0;
        }
        .summary-box h4 {
          margin: 0 0 15px 0;
          color: #1f2937;
        }
        .nominations-list {
          list-style: none;
          padding: 0;
          margin: 10px 0;
        }
        .nominations-list li {
          padding: 10px;
          margin: 5px 0;
          background: white;
          border-radius: 6px;
          border-left: 4px solid #6366f1;
        }
        .stats {
          display: flex;
          justify-content: space-around;
          margin: 20px 0;
          padding: 15px;
          background: #ede9fe;
          border-radius: 8px;
        }
        .stat {
          text-align: center;
        }
        .stat-number {
          font-size: 32px;
          font-weight: bold;
          color: #6366f1;
        }
        .stat-label {
          font-size: 14px;
          color: #6b7280;
        }
        .info-box {
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
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <img src="https://drive.google.com/uc?export=view&id=1vp8LSt-HRbMIUhLXpT1F3G93wKOe5iWS" alt="KarUCU Logo" style="width: 120px; height: auto; margin-bottom: 15px;" />
          <div class="logo">✅ Nomination Complete!</div>
          <p style="color: #6b7280; margin: 0;">KarUCU Leadership Elections</p>
        </div>
        
        <div class="content">
          <div class="success-box">
            <h3>🎉 Thank You for Participating!</h3>
            <p style="margin: 5px 0; opacity: 0.95;">Your nominations have been successfully submitted</p>
          </div>
          
          <p>Dear ${userName},</p>
          
          <p>Thank you for completing your nominations for the <strong>${election.title}</strong>! Your participation is vital in shaping the future leadership of KarUCU Main Campus.</p>
          
          <div class="stats">
            <div class="stat">
              <div class="stat-number">${nominations.length}</div>
              <div class="stat-label">Total Votes</div>
            </div>
            <div class="stat">
              <div class="stat-number">${positionsVoted.length}</div>
              <div class="stat-label">Positions Voted</div>
            </div>
          </div>
          
          <div class="summary-box">
            <h4>📋 Your Nominations Summary</h4>
            <ul class="nominations-list">
              ${nominationsList}
            </ul>
          </div>
          
          ${positionsNotVoted.length > 0 ? `
          <div class="info-box">
            <p style="margin: 0;"><strong>ℹ️ Note:</strong> You did not vote for the following positions:</p>
            <p style="margin: 5px 0 0 0;">${positionsNotVoted.join(', ')}</p>
            <p style="margin: 5px 0 0 0; font-size: 14px;">This is optional - you can vote for as many or as few positions as you like.</p>
          </div>
          ` : `
          <div class="success-box" style="background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);">
            <p style="margin: 0;">🌟 You voted for all available positions! Thank you for your complete participation.</p>
          </div>
          `}
          
          <p><strong>What Happens Next?</strong></p>
          <ul>
            <li>Your nominations are confidential and secure</li>
            <li>Results will be tallied after the election closes on ${new Date(election.end_date).toLocaleDateString()}</li>
            <li>Winners will be announced to the community</li>
            <li>You'll receive updates about the election results</li>
          </ul>
          
          <p>Your voice matters, and we're grateful for your thoughtful participation in this important process. Together, we're building a stronger community!</p>
          
          <p style="margin-top: 25px;">
            <strong>May God bless you abundantly,</strong><br>
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
Nomination Complete - Thank You!

Dear ${userName},

Thank you for completing your nominations for the ${election.title}!

YOUR NOMINATIONS SUMMARY:
${nominations.map(nom => `- ${nom.position}: ${nom.nominee_name}`).join('\n')}

STATISTICS:
- Total Votes: ${nominations.length}
- Positions Voted: ${positionsVoted.length}

${positionsNotVoted.length > 0 ? `
Note: You did not vote for: ${positionsNotVoted.join(', ')}
This is optional - you can vote for as many or as few positions as you like.
` : 'You voted for all available positions! Thank you for your complete participation.'}

What Happens Next?
- Your nominations are confidential and secure
- Results will be tallied after the election closes on ${new Date(election.end_date).toLocaleDateString()}
- Winners will be announced to the community
- You'll receive updates about the election results

Your voice matters, and we're grateful for your thoughtful participation!

May God bless you abundantly,
KarUCU Leadership Team

---
KarUCU Main Campus
Karatina University Christian Union

This is an automated email. Please do not reply to this message.
  `

  return await sendEmail({
    to: user.email,
    subject: `Nomination Complete - Thank You! | ${election.title}`,
    html,
    text,
  })
}

// POST - Complete nominations and send summary email
export async function POST(request) {
  try {
    const user = await verifyAuth(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { election_id } = body

    if (!election_id) {
      return NextResponse.json({ 
        error: 'Election ID is required' 
      }, { status: 400 })
    }

    // Get election details
    const election = await query(
      'SELECT * FROM leader_elections WHERE id = ?',
      [election_id]
    )

    if (election.length === 0) {
      return NextResponse.json({ 
        error: 'Election not found' 
      }, { status: 404 })
    }

    // Get user's nominations for this election
    const nominations = await query(
      `SELECT 
        ln.*,
        u.full_name as nominee_name,
        u.email as nominee_email
       FROM leader_nominations ln
       JOIN users u ON ln.nominee_id = u.id
       WHERE ln.election_id = ? AND ln.nominator_id = ?
       ORDER BY ln.position`,
      [election_id, user.id]
    )

    if (nominations.length === 0) {
      return NextResponse.json({ 
        error: 'No nominations found. Please submit at least one nomination before completing.' 
      }, { status: 400 })
    }

    // Get all available positions
    const positionsResult = await query(
      'SELECT DISTINCT position FROM leader_nominations WHERE election_id = ? ORDER BY position',
      [election_id]
    )
    const positions = positionsResult.map(p => p.position)

    // Send completion email
    await sendCompletionEmail(user, election[0], nominations, positions)

    return NextResponse.json({ 
      success: true,
      message: 'Nomination completed successfully! Check your email for a summary.',
      nominations_count: nominations.length,
      positions_voted: [...new Set(nominations.map(n => n.position))].length
    })
  } catch (error) {
    console.error('Error completing nomination:', error)
    return NextResponse.json({ 
      error: 'Failed to complete nomination',
      message: error.message 
    }, { status: 500 })
  }
}
