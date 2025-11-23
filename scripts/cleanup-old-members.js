#!/usr/bin/env node

/**
 * Automated Cleanup Script for Old Members
 * 
 * This script deletes members who have been registered for more than 4 years.
 * Intended for university students who have graduated.
 * 
 * Usage:
 *   node scripts/cleanup-old-members.js --preview    # Preview members to be deleted
 *   node scripts/cleanup-old-members.js --execute    # Execute cleanup
 *   node scripts/cleanup-old-members.js --help       # Show help
 * 
 * Schedule this script to run periodically:
 *   - End of each academic year
 *   - Or monthly via cron job
 */

const mysql = require('mysql2/promise')
require('dotenv').config({ path: '.env.local' })

const args = process.argv.slice(2)
const mode = args[0]

async function getConnection() {
  return await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'karucu_main_campus'
  })
}

async function previewOldMembers() {
  const connection = await getConnection()
  
  try {
    const [members] = await connection.execute(`
      SELECT 
        id, 
        registration_number, 
        email, 
        full_name, 
        course,
        year_of_study,
        created_at,
        TIMESTAMPDIFF(YEAR, created_at, NOW()) as years_registered,
        TIMESTAMPDIFF(MONTH, created_at, NOW()) as months_registered
      FROM users
      WHERE member_type = 'student'
      AND role = 'member'
      AND created_at < DATE_SUB(NOW(), INTERVAL 4 YEAR)
      ORDER BY created_at ASC
    `)

    console.log('\n=== MEMBERS TO BE DELETED ===\n')
    console.log(`Total: ${members.length} members\n`)

    if (members.length === 0) {
      console.log('No members found for cleanup.')
      return
    }

    members.forEach((member, index) => {
      console.log(`${index + 1}. ${member.full_name}`)
      console.log(`   Email: ${member.email}`)
      console.log(`   Reg No: ${member.registration_number}`)
      console.log(`   Course: ${member.course || 'N/A'}`)
      console.log(`   Registered: ${member.created_at.toISOString().split('T')[0]}`)
      console.log(`   Duration: ${member.years_registered} years, ${member.months_registered % 12} months`)
      console.log('')
    })

    console.log(`\nTo execute cleanup, run: node scripts/cleanup-old-members.js --execute\n`)
  } finally {
    await connection.end()
  }
}

async function executeCleanup() {
  const connection = await getConnection()
  
  try {
    // Start transaction
    await connection.beginTransaction()

    // Get members to be deleted
    const [membersToDelete] = await connection.execute(`
      SELECT * FROM users
      WHERE member_type = 'student'
      AND role = 'member'
      AND created_at < DATE_SUB(NOW(), INTERVAL 4 YEAR)
    `)

    if (membersToDelete.length === 0) {
      console.log('\nNo members found for cleanup.')
      await connection.rollback()
      return
    }

    console.log(`\n=== EXECUTING CLEANUP ===\n`)
    console.log(`Deleting ${membersToDelete.length} members...\n`)

    // Archive members before deletion
    for (const member of membersToDelete) {
      await connection.execute(`
        INSERT INTO users_archive 
        (id, registration_number, email, password_hash, full_name, phone, 
         member_type, role, status, course, year_of_study, staff_id, 
         alumni_year, doctrinal_agreement, profile_image, reset_token, 
         reset_token_expiry, created_at, updated_at, last_login, 
         deleted_at, deletion_reason)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), ?)
      `, [
        member.id,
        member.registration_number,
        member.email,
        member.password_hash,
        member.full_name,
        member.phone,
        member.member_type,
        member.role,
        member.status,
        member.course,
        member.year_of_study,
        member.staff_id,
        member.alumni_year,
        member.doctrinal_agreement,
        member.profile_image,
        member.reset_token,
        member.reset_token_expiry,
        member.created_at,
        member.updated_at,
        member.last_login,
        'Automatic cleanup - 4+ years registered'
      ])
    }

    console.log(`✓ Archived ${membersToDelete.length} members`)

    // Delete old members
    const [result] = await connection.execute(`
      DELETE FROM users
      WHERE member_type = 'student'
      AND role = 'member'
      AND created_at < DATE_SUB(NOW(), INTERVAL 4 YEAR)
    `)

    // Commit transaction
    await connection.commit()

    console.log(`✓ Deleted ${result.affectedRows} members`)
    console.log(`\n=== CLEANUP COMPLETE ===\n`)
    console.log(`Total members processed: ${membersToDelete.length}`)
    console.log(`Archived: ${membersToDelete.length}`)
    console.log(`Deleted: ${result.affectedRows}`)
    console.log(`\nCleanup completed successfully!\n`)
  } catch (error) {
    await connection.rollback()
    console.error('\n❌ Error during cleanup:', error.message)
    throw error
  } finally {
    await connection.end()
  }
}

function showHelp() {
  console.log(`
=== Old Members Cleanup Script ===

This script manages the automatic deletion of members who have been 
registered for more than 4 years (typically graduated students).

Usage:
  node scripts/cleanup-old-members.js [option]

Options:
  --preview    Preview members that will be deleted (safe, read-only)
  --execute    Execute the cleanup (deletes members, archives first)
  --help       Show this help message

Examples:
  # Preview members to be deleted
  node scripts/cleanup-old-members.js --preview

  # Execute cleanup
  node scripts/cleanup-old-members.js --execute

Scheduling:
  You can schedule this script to run automatically using cron:
  
  # Run at the end of each academic year (e.g., July 1st at 2 AM)
  0 2 1 7 * cd /path/to/project && node scripts/cleanup-old-members.js --execute

  # Run monthly on the 1st at 3 AM
  0 3 1 * * cd /path/to/project && node scripts/cleanup-old-members.js --execute

Notes:
  - Only deletes members with role='member' and member_type='student'
  - Admins and editors are never deleted
  - Members are archived before deletion
  - Requires database credentials in .env.local
`)
}

// Main execution
async function main() {
  try {
    switch (mode) {
      case '--preview':
        await previewOldMembers()
        break
      case '--execute':
        await executeCleanup()
        break
      case '--help':
      default:
        showHelp()
        break
    }
  } catch (error) {
    console.error('Fatal error:', error)
    process.exit(1)
  }
}

main()
