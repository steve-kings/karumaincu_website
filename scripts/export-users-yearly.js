#!/usr/bin/env node

/**
 * Yearly User Export Script
 * 
 * Exports all users to Excel file before cleanup
 * Creates yearly backups for record keeping
 * 
 * Usage:
 *   node scripts/export-users-yearly.js                    # Export all users
 *   node scripts/export-users-yearly.js --old-only         # Export only 4+ year old users
 *   node scripts/export-users-yearly.js --year 2024        # Export for specific year
 */

const mysql = require('mysql2/promise')
const ExcelJS = require('exceljs')
const fs = require('fs')
const path = require('path')
require('dotenv').config({ path: '.env.local' })

const args = process.argv.slice(2)
const oldOnly = args.includes('--old-only')
const yearIndex = args.indexOf('--year')
const specificYear = yearIndex !== -1 ? args[yearIndex + 1] : new Date().getFullYear()

async function getConnection() {
  return await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'karucu_main_campus'
  })
}

async function exportUsers() {
  const connection = await getConnection()
  
  try {
    console.log('\n=== YEARLY USER EXPORT ===\n')

    // Build query based on options
    let query = `
      SELECT 
        id,
        registration_number,
        email,
        full_name,
        phone,
        member_type,
        role,
        course,
        year_of_study,
        staff_id,
        alumni_year,
        doctrinal_agreement,
        created_at,
        updated_at,
        last_login,
        TIMESTAMPDIFF(YEAR, created_at, NOW()) as years_registered
      FROM users
    `

    if (oldOnly) {
      query += ` WHERE created_at < DATE_SUB(NOW(), INTERVAL 4 YEAR)`
      console.log('Exporting users registered 4+ years ago...\n')
    } else {
      console.log('Exporting all users...\n')
    }

    query += ` ORDER BY created_at DESC`

    const [users] = await connection.execute(query)

    if (users.length === 0) {
      console.log('No users found to export.')
      return
    }

    console.log(`Found ${users.length} users to export\n`)

    // Create Excel workbook
    const workbook = new ExcelJS.Workbook()
    const worksheet = workbook.addWorksheet('Users')

    // Set column headers
    worksheet.columns = [
      { header: 'ID', key: 'id', width: 10 },
      { header: 'Registration Number', key: 'registration_number', width: 20 },
      { header: 'Full Name', key: 'full_name', width: 30 },
      { header: 'Email', key: 'email', width: 35 },
      { header: 'Phone', key: 'phone', width: 15 },
      { header: 'Member Type', key: 'member_type', width: 15 },
      { header: 'Role', key: 'role', width: 12 },
      { header: 'Course', key: 'course', width: 40 },
      { header: 'Year of Study', key: 'year_of_study', width: 15 },
      { header: 'Staff ID', key: 'staff_id', width: 15 },
      { header: 'Alumni Year', key: 'alumni_year', width: 15 },
      { header: 'Doctrinal Agreement', key: 'doctrinal_agreement', width: 20 },
      { header: 'Years Registered', key: 'years_registered', width: 18 },
      { header: 'Created At', key: 'created_at', width: 20 },
      { header: 'Last Login', key: 'last_login', width: 20 }
    ]

    // Style header row
    worksheet.getRow(1).font = { bold: true }
    worksheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF4F46E5' }
    }
    worksheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } }

    // Add data rows
    users.forEach(user => {
      worksheet.addRow({
        id: user.id,
        registration_number: user.registration_number,
        full_name: user.full_name,
        email: user.email,
        phone: user.phone || 'N/A',
        member_type: user.member_type,
        role: user.role,
        course: user.course || 'N/A',
        year_of_study: user.year_of_study || 'N/A',
        staff_id: user.staff_id || 'N/A',
        alumni_year: user.alumni_year || 'N/A',
        doctrinal_agreement: user.doctrinal_agreement ? 'Yes' : 'No',
        years_registered: user.years_registered,
        created_at: user.created_at ? new Date(user.created_at).toISOString().split('T')[0] : 'N/A',
        last_login: user.last_login ? new Date(user.last_login).toISOString().split('T')[0] : 'Never'
      })
    })

    // Add summary at the bottom
    worksheet.addRow([])
    worksheet.addRow(['SUMMARY'])
    worksheet.addRow(['Total Users:', users.length])
    worksheet.addRow(['Students:', users.filter(u => u.member_type === 'student').length])
    worksheet.addRow(['Associates:', users.filter(u => u.member_type === 'associate').length])
    worksheet.addRow(['Members:', users.filter(u => u.role === 'member').length])
    worksheet.addRow(['Editors:', users.filter(u => u.role === 'editor').length])
    worksheet.addRow(['Admins:', users.filter(u => u.role === 'admin').length])
    worksheet.addRow(['Export Date:', new Date().toISOString().split('T')[0]])

    // Create exports directory if it doesn't exist
    const exportsDir = path.join(process.cwd(), 'exports')
    if (!fs.existsSync(exportsDir)) {
      fs.mkdirSync(exportsDir, { recursive: true })
    }

    // Generate filename
    const timestamp = new Date().toISOString().split('T')[0]
    const suffix = oldOnly ? '_old-users' : '_all-users'
    const filename = `users_export_${specificYear}${suffix}_${timestamp}.xlsx`
    const filepath = path.join(exportsDir, filename)

    // Save file
    await workbook.xlsx.writeFile(filepath)

    console.log('✓ Export completed successfully!\n')
    console.log(`File saved: ${filepath}`)
    console.log(`Total users exported: ${users.length}`)
    console.log(`File size: ${(fs.statSync(filepath).size / 1024).toFixed(2)} KB\n`)

    return filepath
  } finally {
    await connection.end()
  }
}

// Main execution
async function main() {
  try {
    await exportUsers()
  } catch (error) {
    console.error('❌ Export failed:', error.message)
    process.exit(1)
  }
}

main()
