/**
 * Cleanup script for old blog posts
 * Deletes approved blogs older than 2 months to keep database clean
 * Run: node scripts/cleanup-old-blogs.js
 */

const mysql = require('mysql2/promise')
require('dotenv').config({ path: '.env.local' })

async function cleanupOldBlogs() {
  let connection

  try {
    console.log('🧹 Starting blog cleanup...\n')

    // Create database connection
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    })

    console.log('✅ Connected to database')

    // Calculate date 2 months ago
    const twoMonthsAgo = new Date()
    twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2)
    const cutoffDate = twoMonthsAgo.toISOString().split('T')[0]

    console.log(`📅 Cutoff date: ${cutoffDate}`)
    console.log(`   (Deleting approved blogs older than this date)\n`)

    // Count blogs to be deleted
    const [countResult] = await connection.execute(
      `SELECT COUNT(*) as count FROM blogs 
       WHERE status = 'approved' 
       AND created_at < ?`,
      [cutoffDate]
    )

    const blogsToDelete = countResult[0].count

    if (blogsToDelete === 0) {
      console.log('✨ No old blogs to delete. Database is clean!')
      return
    }

    console.log(`🗑️  Found ${blogsToDelete} approved blogs older than 2 months`)

    // Optional: Archive blogs before deletion
    console.log('📦 Archiving blogs before deletion...')
    
    // Create archive table if it doesn't exist
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS blogs_archive (
        id INT PRIMARY KEY,
        title VARCHAR(255),
        content LONGTEXT,
        author_id INT,
        category VARCHAR(100),
        status VARCHAR(50),
        created_at TIMESTAMP,
        archived_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        deletion_reason VARCHAR(255) DEFAULT 'Automatic cleanup - 2+ months old'
      )
    `)

    // Archive the blogs
    await connection.execute(`
      INSERT INTO blogs_archive (id, title, content, author_id, category, status, created_at)
      SELECT id, title, content, author_id, category, status, created_at
      FROM blogs
      WHERE status = 'approved' 
      AND created_at < ?
      AND id NOT IN (SELECT id FROM blogs_archive)
    `, [cutoffDate])

    console.log('✅ Blogs archived successfully')

    // Delete old blogs
    const [deleteResult] = await connection.execute(
      `DELETE FROM blogs 
       WHERE status = 'approved' 
       AND created_at < ?`,
      [cutoffDate]
    )

    console.log(`✅ Successfully deleted ${deleteResult.affectedRows} blogs`)
    console.log('\n📊 Cleanup Summary:')
    console.log(`   - Blogs deleted: ${deleteResult.affectedRows}`)
    console.log(`   - Cutoff date: ${cutoffDate}`)
    console.log(`   - Status: Complete`)
    console.log(`   - Archived: Yes (check blogs_archive table)`)

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
cleanupOldBlogs()
  .then(() => {
    console.log('\n✅ Blog cleanup completed successfully!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n❌ Blog cleanup failed:', error)
    process.exit(1)
  })
