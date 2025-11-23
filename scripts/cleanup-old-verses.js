/**
 * Cleanup script for old verse of the day entries
 * Deletes verses older than 30 days to keep database clean
 * Run: node scripts/cleanup-old-verses.js
 */

const mysql = require('mysql2/promise')
require('dotenv').config({ path: '.env.local' })

async function cleanupOldVerses() {
  let connection

  try {
    console.log('🧹 Starting verse of the day cleanup...\n')

    // Create database connection
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    })

    console.log('✅ Connected to database')

    // Calculate date 30 days ago
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    const cutoffDate = thirtyDaysAgo.toISOString().split('T')[0]

    console.log(`📅 Cutoff date: ${cutoffDate}`)
    console.log(`   (Deleting verses older than this date)\n`)

    // Count verses to be deleted
    const [countResult] = await connection.execute(
      'SELECT COUNT(*) as count FROM verse_of_day WHERE date < ?',
      [cutoffDate]
    )

    const versesToDelete = countResult[0].count

    if (versesToDelete === 0) {
      console.log('✨ No old verses to delete. Database is clean!')
      return
    }

    console.log(`🗑️  Found ${versesToDelete} verses older than 30 days`)

    // Delete old verses
    const [deleteResult] = await connection.execute(
      'DELETE FROM verse_of_day WHERE date < ?',
      [cutoffDate]
    )

    console.log(`✅ Successfully deleted ${deleteResult.affectedRows} verses`)
    console.log('\n📊 Cleanup Summary:')
    console.log(`   - Verses deleted: ${deleteResult.affectedRows}`)
    console.log(`   - Cutoff date: ${cutoffDate}`)
    console.log(`   - Status: Complete`)

  } catch (error) {
    console.error('❌ Error during cleanup:', error.message)
    process.exit(1)
  } finally {
    if (connection) {
      await connection.end()
      console.log('\n🔌 Database connection closed')
    }
  }
}

// Run cleanup
cleanupOldVerses()
  .then(() => {
    console.log('\n✅ Cleanup completed successfully!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n❌ Cleanup failed:', error)
    process.exit(1)
  })
