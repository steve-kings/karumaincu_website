import { executeQuery } from '@/lib/db'

class BibleStudyService {
  // ============ SESSIONS ============
  async getAllSessions(filters = {}) {
    const { is_open, limit, offset } = filters
    
    let query = 'SELECT * FROM bible_study_sessions WHERE 1=1'
    const params = []

    if (is_open !== undefined) {
      query += ' AND is_open = ?'
      params.push(is_open === 'true' ? 1 : 0)
    }

    query += ' ORDER BY registration_deadline DESC'

    if (limit) {
      const limitInt = parseInt(limit, 10) || 50
      const offsetInt = parseInt(offset, 10) || 0
      query += ` LIMIT ${limitInt} OFFSET ${offsetInt}`
    }

    console.log('[Service] Executing query:', query)
    console.log('[Service] With params:', params)
    const results = await executeQuery(query, params)
    console.log('[Service] Query results:', results)
    console.log('[Service] Results length:', results ? results.length : 0)
    return results
  }

  async getSessionById(id) {
    const [session] = await executeQuery(
      'SELECT * FROM bible_study_sessions WHERE id = ?',
      [id]
    )
    
    if (!session) {
      throw new Error('Session not found')
    }
    
    return session
  }

  async createSession(data, createdBy) {
    const { title, description, registration_deadline, start_date, end_date, is_open, is_active, max_participants } = data

    if (!title || !registration_deadline || !start_date) {
      throw new Error('Title, registration deadline, and start date are required')
    }

    // Use is_open if provided, otherwise fall back to is_active
    const isOpenValue = is_open !== undefined ? is_open : (is_active !== undefined ? is_active : 1)

    const result = await executeQuery(
      `INSERT INTO bible_study_sessions (title, description, registration_deadline, start_date, end_date, is_open, max_participants, created_by) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [title, description, registration_deadline, start_date, end_date, isOpenValue ? 1 : 0, max_participants || null, createdBy]
    )

    return await this.getSessionById(result.insertId)
  }

  async updateSession(id, data) {
    const { title, description, registration_deadline, start_date, end_date, is_open, is_active, max_participants } = data

    await this.getSessionById(id)

    // Use is_open if provided, otherwise fall back to is_active
    const isOpenValue = is_open !== undefined ? is_open : (is_active !== undefined ? is_active : 1)

    await executeQuery(
      `UPDATE bible_study_sessions SET title = ?, description = ?, registration_deadline = ?, start_date = ?, end_date = ?, is_open = ?, max_participants = ? 
       WHERE id = ?`,
      [title, description, registration_deadline, start_date, end_date, isOpenValue ? 1 : 0, max_participants || null, id]
    )

    return await this.getSessionById(id)
  }

  async deleteSession(id) {
    await this.getSessionById(id)
    await executeQuery('DELETE FROM bible_study_sessions WHERE id = ?', [id])
    return { success: true, message: 'Session deleted successfully' }
  }

  // ============ LOCATIONS ============
  async getAllLocations(filters = {}) {
    const { is_active } = filters
    
    let query = 'SELECT * FROM study_locations WHERE 1=1'
    const params = []

    if (is_active !== undefined) {
      query += ' AND is_active = ?'
      params.push(is_active === 'true' ? 1 : 0)
    }

    query += ' ORDER BY name ASC'

    return await executeQuery(query, params)
  }

  async getLocationById(id) {
    const [location] = await executeQuery(
      'SELECT * FROM study_locations WHERE id = ?',
      [id]
    )
    
    if (!location) {
      throw new Error('Location not found')
    }
    
    return location
  }

  async createLocation(data) {
    const { location_name, description, capacity, is_active } = data

    if (!location_name) {
      throw new Error('Location name is required')
    }

    const result = await executeQuery(
      `INSERT INTO study_locations (name, description, capacity, is_active) 
       VALUES (?, ?, ?, ?)`,
      [
        location_name, 
        description || null, 
        capacity || null, 
        is_active !== false ? 1 : 0
      ]
    )

    return await this.getLocationById(result.insertId)
  }

  async updateLocation(id, data) {
    const { location_name, description, capacity, is_active } = data

    await this.getLocationById(id)

    await executeQuery(
      `UPDATE study_locations SET name = ?, description = ?, capacity = ?, is_active = ? 
       WHERE id = ?`,
      [
        location_name, 
        description || null, 
        capacity || null, 
        is_active ? 1 : 0, 
        id
      ]
    )

    return await this.getLocationById(id)
  }

  async deleteLocation(id) {
    await this.getLocationById(id)
    await executeQuery('DELETE FROM study_locations WHERE id = ?', [id])
    return { success: true, message: 'Location deleted successfully' }
  }

  // ============ REGISTRATIONS ============
  async getAllRegistrations(filters = {}) {
    const { session_id, location_id, status, user_id, limit, offset } = filters
    
    let query = `
      SELECT r.*, u.email as user_email, l.name as location_name, s.title as session_title
      FROM bible_study_registrations r
      LEFT JOIN users u ON r.user_id = u.id
      LEFT JOIN study_locations l ON r.location_id = l.id
      LEFT JOIN bible_study_sessions s ON r.session_id = s.id
      WHERE 1=1
    `
    const params = []

    if (session_id) {
      query += ' AND r.session_id = ?'
      params.push(session_id)
    }

    if (location_id) {
      query += ' AND r.location_id = ?'
      params.push(location_id)
    }

    if (status) {
      query += ' AND r.status = ?'
      params.push(status)
    }

    if (user_id) {
      query += ' AND r.user_id = ?'
      params.push(user_id)
    }

    query += ' ORDER BY r.registered_at DESC'

    if (limit) {
      const limitInt = parseInt(limit, 10) || 50
      const offsetInt = parseInt(offset, 10) || 0
      query += ` LIMIT ${limitInt} OFFSET ${offsetInt}`
    }

    return await executeQuery(query, params)
  }

  async getRegistrationById(id) {
    const [registration] = await executeQuery(`
      SELECT r.*, u.email as user_email, l.name as location_name, s.title as session_title
      FROM bible_study_registrations r
      LEFT JOIN users u ON r.user_id = u.id
      LEFT JOIN study_locations l ON r.location_id = l.id
      LEFT JOIN bible_study_sessions s ON r.session_id = s.id
      WHERE r.id = ?
    `, [id])
    
    if (!registration) {
      throw new Error('Registration not found')
    }
    
    return registration
  }

  async createRegistration(data, userId) {
    const { session_id, full_name, email, phone, location_id, year_of_study, school, registration_number, notes } = data

    if (!session_id || !full_name || !email || !location_id || !year_of_study || !school) {
      throw new Error('All required fields must be provided')
    }

    // Check if session is open
    const session = await this.getSessionById(session_id)
    if (!session.is_open) {
      throw new Error('Registration is closed for this session')
    }

    // Check deadline
    if (new Date(session.registration_deadline) < new Date()) {
      throw new Error('Registration deadline has passed')
    }

    // Check if already registered
    const [existing] = await executeQuery(
      'SELECT id FROM bible_study_registrations WHERE session_id = ? AND user_id = ?',
      [session_id, userId]
    )

    if (existing) {
      throw new Error('You are already registered for this session')
    }

    const result = await executeQuery(
      `INSERT INTO bible_study_registrations (session_id, user_id, full_name, email, phone, location_id, year_of_study, school, registration_number, notes) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [session_id, userId, full_name, email, phone, location_id, year_of_study, school, registration_number, notes]
    )

    return await this.getRegistrationById(result.insertId)
  }

  async updateRegistration(id, data) {
    const { status, group_number, notes } = data

    await this.getRegistrationById(id)

    await executeQuery(
      `UPDATE bible_study_registrations SET status = ?, group_number = ?, notes = ? 
       WHERE id = ?`,
      [status, group_number, notes, id]
    )

    return await this.getRegistrationById(id)
  }

  async deleteRegistration(id) {
    await this.getRegistrationById(id)
    await executeQuery('DELETE FROM bible_study_registrations WHERE id = ?', [id])
    return { success: true, message: 'Registration deleted successfully' }
  }

  // ============ GROUP SETTINGS ============
  async getGroupSettings(sessionId, locationId) {
    const [settings] = await executeQuery(
      'SELECT * FROM study_group_settings WHERE session_id = ? AND location_id = ?',
      [sessionId, locationId]
    )
    
    return settings || null
  }

  async setGroupSettings(data) {
    const { session_id, location_id, members_per_group, group_by_criteria, auto_assign } = data

    if (!session_id || !location_id || !members_per_group) {
      throw new Error('Session, location, and members per group are required')
    }

    // Check if settings exist
    const existing = await this.getGroupSettings(session_id, location_id)

    if (existing) {
      // Update
      await executeQuery(
        `UPDATE study_group_settings SET members_per_group = ?, group_by_criteria = ?, auto_assign = ? 
         WHERE session_id = ? AND location_id = ?`,
        [members_per_group, group_by_criteria, auto_assign ? 1 : 0, session_id, location_id]
      )
    } else {
      // Insert
      await executeQuery(
        `INSERT INTO study_group_settings (session_id, location_id, members_per_group, group_by_criteria, auto_assign) 
         VALUES (?, ?, ?, ?, ?)`,
        [session_id, location_id, members_per_group, group_by_criteria, auto_assign ? 1 : 0]
      )
    }

    return await this.getGroupSettings(session_id, location_id)
  }

  // ============ AUTO-GROUPING ============
  async autoAssignGroups(sessionId, locationId) {
    const settings = await this.getGroupSettings(sessionId, locationId)
    
    if (!settings) {
      throw new Error('Group settings not configured for this location')
    }

    // Get all approved registrations for this session and location
    const registrations = await executeQuery(
      'SELECT * FROM bible_study_registrations WHERE session_id = ? AND location_id = ? AND status = "approved" ORDER BY registered_at ASC',
      [sessionId, locationId]
    )

    if (registrations.length === 0) {
      return { success: true, message: 'No registrations to group', grouped: 0 }
    }

    const membersPerGroup = settings.members_per_group
    let groupNumber = 1
    let memberCount = 0

    for (const registration of registrations) {
      await executeQuery(
        'UPDATE bible_study_registrations SET group_number = ? WHERE id = ?',
        [groupNumber, registration.id]
      )

      memberCount++
      if (memberCount >= membersPerGroup) {
        groupNumber++
        memberCount = 0
      }
    }

    return { 
      success: true, 
      message: `Successfully grouped ${registrations.length} members into ${groupNumber} groups`,
      total_members: registrations.length,
      total_groups: groupNumber
    }
  }

  // ============ STATISTICS ============
  async getSessionStats(sessionId) {
    const [stats] = await executeQuery(`
      SELECT 
        COUNT(*) as total_registrations,
        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending,
        SUM(CASE WHEN status = 'approved' THEN 1 ELSE 0 END) as approved,
        SUM(CASE WHEN status = 'rejected' THEN 1 ELSE 0 END) as rejected,
        COUNT(DISTINCT location_id) as locations_count,
        COUNT(DISTINCT group_number) as groups_count
      FROM bible_study_registrations
      WHERE session_id = ?
    `, [sessionId])
    
    return stats
  }

  async getLocationStats(sessionId, locationId) {
    const [stats] = await executeQuery(`
      SELECT 
        COUNT(*) as total_registrations,
        SUM(CASE WHEN status = 'approved' THEN 1 ELSE 0 END) as approved,
        COUNT(DISTINCT group_number) as groups_count,
        COUNT(DISTINCT school) as schools_count
      FROM bible_study_registrations
      WHERE session_id = ? AND location_id = ?
    `, [sessionId, locationId])
    
    return stats
  }
}

export default new BibleStudyService()
