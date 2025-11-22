# Editor Dashboard Implementation

## Overview
Created a new Editor role dashboard with limited permissions between Member and Admin.

## What Editors CAN Do:
1. ✅ **Review & Approve Blogs** - Approve or reject blog submissions
2. ✅ **View Prayer Requests** - Read and monitor prayer requests (read-only)
3. ✅ **View Bible Study Registrations** - See who registered (read-only, cannot create sessions)
4. ✅ **Add Spiritual Content** - Add verse of the day and reading calendar
5. ✅ **Add Sermons** - Add new sermon videos
6. ✅ **Add Gallery** - Add new photo galleries

## What Editors CANNOT Do:
- ❌ Create Bible Study sessions
- ❌ Create Nominations or Elections
- ❌ Add/Edit/Delete Leaders
- ❌ Edit or Delete content (only Admin can)
- ❌ Manage Users
- ❌ Access full admin features

## Files Created:

### 1. Layout Component
- `src/components/EditorLayout.jsx` - Editor dashboard layout with sidebar

### 2. Pages
- `src/app/editor/page.jsx` - Editor dashboard home
- `src/app/editor/blogs/page.jsx` - Review and approve blogs

### 3. API Routes
- `src/app/api/editor/stats/route.js` - Dashboard statistics
- `src/app/api/editor/blogs/route.js` - Get blogs for review
- `src/app/api/editor/blogs/[id]/approve/route.js` - Approve blog
- `src/app/api/editor/blogs/[id]/reject/route.js` - Reject blog

## Still Need to Create:

### Pages (Copy from admin with modifications):
1. `src/app/editor/prayer-requests/page.jsx` - View only (no edit/delete)
2. `src/app/editor/bible-study/page.jsx` - View registrations only
3. `src/app/editor/spiritual-content/page.jsx` - Add verse/reading (copy from admin)
4. `src/app/editor/sermons/page.jsx` - Add sermons (copy from admin, remove edit/delete)
5. `src/app/editor/gallery/page.jsx` - Add galleries (copy from admin, remove edit/delete)

### API Routes (if needed):
- Most can reuse existing admin APIs with role check modifications

## How to Assign Editor Role:

Admin can change user role in the database or through admin panel:

```sql
UPDATE users SET role = 'editor' WHERE id = [user_id];
```

Or add UI in admin users page to change roles.

## Access Control:

All editor routes check for:
```javascript
if (decoded.role !== 'editor' && decoded.role !== 'admin') {
  return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
}
```

This allows both editors and admins to access editor features.

## Navigation Update Needed:

Update `src/components/Navigation.jsx` to show "Editor Dashboard" link for users with editor role.

## Next Steps:

1. Create remaining editor pages (prayer-requests, bible-study, spiritual-content, sermons, gallery)
2. Update Navigation component to show editor link
3. Add role management UI in admin users page
4. Test all permissions
5. Deploy to Vercel

## Testing:

1. Create a test user
2. Set role to 'editor' in database
3. Login and verify access to /editor
4. Test blog approval workflow
5. Verify cannot access /admin routes
6. Verify cannot edit/delete content
