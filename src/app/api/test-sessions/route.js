import { NextResponse } from 'next/server'
import { executeQuery } from '@/lib/db'

export async function GET(request) {
  try {
    console.log('[TEST] Starting direct database query test...')
    
    // Test 1: Direct query
    const query = 'SELECT * FROM bible_study_sessions ORDER BY created_at DESC'
    console.log('[TEST] Executing query:', query)
    
    const results = await executeQuery(query, [])
    console.log('[TEST] Raw results:', results)
    console.log('[TEST] Results type:', typeof results)
    console.log('[TEST] Results is array:', Array.isArray(results))
    console.log('[TEST] Results length:', results ? results.length : 'null/undefined')
    
    // Test 2: Count query
    const countQuery = 'SELECT COUNT(*) as count FROM bible_study_sessions'
    const countResults = await executeQuery(countQuery, [])
    console.log('[TEST] Count results:', countResults)
    
    // Test 3: Check table exists
    const tableQuery = "SHOW TABLES LIKE 'bible_study_sessions'"
    const tableResults = await executeQuery(tableQuery, [])
    console.log('[TEST] Table exists check:', tableResults)
    
    return NextResponse.json({
      success: true,
      directQuery: {
        results: results,
        count: results ? results.length : 0,
        type: typeof results,
        isArray: Array.isArray(results)
      },
      countQuery: countResults,
      tableExists: tableResults
    })
  } catch (error) {
    console.error('[TEST] Error:', error)
    return NextResponse.json({ 
      error: error.message,
      stack: error.stack 
    }, { status: 500 })
  }
}
