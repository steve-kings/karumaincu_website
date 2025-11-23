# KarUCU Main Campus Website

A comprehensive church management system built with Next.js 14, featuring role-based access control, real-time notifications, and integrated spiritual content management.

## 🌟 Overview

KarUCU Main Campus Website is a full-stack web application designed for Karatina University Christian Union (KarUCU) Main Campus. It provides a complete digital platform for church operations, member engagement, and content management.

## 🚀 Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** JavaScript/React
- **Styling:** Tailwind CSS
- **Database:** MySQL
- **Authentication:** JWT + Google OAuth
- **Real-time:** Socket.io
- **Icons:** Lucide React + Font Awesome
- **Deployment:** Vercel

## 📋 Features

### 🔐 Authentication & Authorization
- **Multi-method Login:**
  - Email/Password authentication
  - Google OAuth integration
  - Secure JWT token management
- **Role-Based Access Control:**
  - Admin (full system access)
  - Editor (content management)
  - Member (user features)
- **Session Management:**
  - Secure cookie-based sessions
  - Auto-logout on token expiry
  - Role switching capability

### 👥 User Management
- User registration and profile management
- Role assignment and permissions
- User groups and categories
- Automated cleanup of inactive members (90+ days)

### 📝 Blog System
- **Public Blog:**
  - Browse and read published articles
  - Comment system with moderation
  - Category filtering
  - SEO optimization
- **Member Blogs:**
  - Create and submit blog posts
  - Draft and published status
  - Personal blog management
- **Admin/Editor Controls:**
  - Approve/reject submissions
  - Content moderation
  - Featured posts
  - Automated archival (180+ days)

### 📖 Bible & Spiritual Content
- **Bible Reader:**
  - Multiple Bible versions (KJV, NIV, ESV, etc.)
  - Chapter navigation
  - Integrated with Bible.org API
- **Verse of the Day:**
  - Daily inspirational verses
  - Automated scheduling
  - Admin management
  - Cleanup of old verses (30+ days)
- **Reading Plans:**
  - Daily reading calendar
  - Track reading progress (localStorage)
  - Edit and delete entries
  - Real-time updates

### 🎥 Media & Sermons
- **Sermons Library:**
  - YouTube video integration
  - Search and filter by series
  - Speaker information
  - Scripture references
- **Photo Galleries:**
  - Event photo collections
  - Category organization
  - External gallery links (Google Photos, Drive)
  - Thumbnail support (Unsplash)
- **Announcements:**
  - Scrolling announcement banner
  - Priority levels (high, medium, low)
  - Expiration dates
  - Category filtering

### 🙏 Prayer & Devotion
- **Prayer Journal:**
  - Personal prayer entries
  - Private notes
  - Date tracking
- **Prayer Requests:**
  - Submit prayer requests
  - Community prayer wall
  - Admin moderation

### 💬 Comments System
- **Blog Comments:**
  - Nested comment threads
  - Moderation workflow
  - Approve/reject functionality
  - Auto-deletion (90+ days after blog deletion)

### 🔔 Real-time Features
- **Live Notifications:**
  - Socket.io integration
  - Real-time updates
  - Event broadcasting
- **Reading Plan Updates:**
  - Live calendar changes
  - Instant synchronization

### 🎨 UI/UX Features
- **Dark Mode:**
  - AMOLED-optimized dark theme
  - Smooth transitions
  - System preference detection
- **Responsive Design:**
  - Mobile-first approach
  - Tablet and desktop optimization
  - Touch-friendly interfaces
- **Accessibility:**
  - Semantic HTML
  - ARIA labels
  - Keyboard navigation

### 🛠️ Admin Dashboard
- **User Management:**
  - View all users
  - Assign roles
  - Manage permissions
  - Cleanup inactive accounts
- **Content Management:**
  - Blogs, sermons, galleries
  - Spiritual content
  - Announcements
  - Comments moderation
- **Analytics:**
  - User statistics
  - Content metrics
  - Engagement tracking

### ✍️ Editor Dashboard
- **Content Creation:**
  - Blog management
  - Sermon uploads
  - Gallery additions
  - Spiritual content
- **Moderation:**
  - Review submissions
  - Approve/reject content
  - Edit capabilities

## 📁 Project Structure

```
karumaincu-website/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── admin/             # Admin dashboard pages
│   │   ├── editor/            # Editor dashboard pages
│   │   ├── member/            # Member area pages
│   │   ├── api/               # API routes
│   │   ├── blog/              # Public blog pages
│   │   ├── media/             # Media & gallery pages
│   │   ├── sermons/           # Sermons listing
│   │   └── login/             # Authentication pages
│   ├── components/            # React components
│   │   ├── AdminLayout.jsx
│   │   ├── EditorLayout.jsx
│   │   ├── MemberLayout.jsx
│   │   ├── Navigation.jsx
│   │   ├── BlogComments.jsx
│   │   └── ...
│   ├── contexts/              # React contexts
│   │   └── SocketContext.jsx
│   ├── hooks/                 # Custom React hooks
│   │   ├── useAuth.js
│   │   └── useRealtime.js
│   ├── lib/                   # Utility libraries
│   │   ├── db.js             # Database connection
│   │   ├── bibleApi.js       # Bible API integration
│   │   └── seo.js            # SEO utilities
│   └── styles/
│       └── globals.css
├── database/
│   ├── schema.sql            # Database schema
│   ├── migrations/           # Database migrations
│   └── DATABASE_MIGRATION_GUIDE.md
├── scripts/
│   ├── cleanup-old-members.js
│   ├── cleanup-old-blogs.js
│   └── cleanup-old-verses.js
├── public/                    # Static assets
├── .env.local                # Environment variables
└── package.json

```

## 🔧 Installation

### Prerequisites
- Node.js 18+ 
- MySQL 8+
- npm or yarn

### Setup Steps

1. **Clone the repository:**
```bash
git clone <repository-url>
cd karumaincu-website
```

2. **Install dependencies:**
```bash
npm install
```

3. **Configure environment variables:**
Create a `.env.local` file:
```env
# Database
DB_HOST=localhost
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=karumaincu_db

# JWT
JWT_SECRET=your_jwt_secret_key

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Bible API
BIBLE_API_KEY=your_bible_api_key

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

4. **Set up the database:**
```bash
# Import the schema
mysql -u your_user -p karumaincu_db < database/schema.sql

# Run migrations (if needed)
mysql -u your_user -p karumaincu_db < database/migrations/*.sql
```

5. **Run the development server:**
```bash
npm run dev
```

6. **Access the application:**
Open [http://localhost:3000](http://localhost:3000)

## 🗄️ Database Schema

### Core Tables
- `users` - User accounts and profiles
- `roles` - User roles and permissions
- `user_roles` - User-role assignments

### Content Tables
- `blogs` - Blog posts
- `blogs_archive` - Archived blogs
- `blog_comments` - Blog comments
- `sermons` - Sermon recordings
- `galleries` - Photo galleries
- `announcements` - System announcements

### Spiritual Content
- `verse_of_day` - Daily verses
- `reading_calendar` - Reading plan entries
- `prayer_requests` - Prayer submissions
- `prayer_journal` - Personal prayers

## 🔐 Authentication Flow

1. **Login:** User provides credentials or uses Google OAuth
2. **Token Generation:** JWT token created with user info and role
3. **Cookie Storage:** Token stored in HTTP-only cookie
4. **Authorization:** Middleware validates token on protected routes
5. **Role Check:** Access granted based on user role

## 🎯 User Roles & Permissions

### Admin
- Full system access
- User management
- All content CRUD operations
- System configuration
- Analytics and reports

### Editor
- Content creation and editing
- Moderation capabilities
- Limited user viewing
- No system configuration

### Member
- Personal content creation
- Blog submissions
- Prayer journal
- Reading plans
- Profile management

## 🔄 Automated Cleanup Jobs

Run these scripts periodically (via cron or scheduled tasks):

```bash
# Cleanup inactive members (90+ days)
node scripts/cleanup-old-members.js

# Archive old blogs (180+ days)
node scripts/cleanup-old-blogs.js

# Remove old verses (30+ days)
node scripts/cleanup-old-verses.js
```

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/google` - Google OAuth
- `GET /api/auth/profile` - Get user profile
- `POST /api/auth/logout` - Logout

### Blogs
- `GET /api/blogs` - List public blogs
- `GET /api/blogs/[id]` - Get blog details
- `POST /api/member/blogs` - Create blog (member)
- `PUT /api/admin/blogs/[id]` - Update blog (admin)

### Sermons
- `GET /api/sermons` - List sermons
- `POST /api/admin/sermons` - Create sermon (admin)

### Bible
- `GET /api/bible/versions` - List Bible versions
- `GET /api/bible/chapter` - Get chapter content
- `GET /api/verse-of-day` - Get daily verse

### Reading Calendar
- `GET /api/reading-calendar` - Get reading plan
- `POST /api/admin/spiritual/reading-calendar` - Add entry

## 🎨 Styling & Theming

- **Light Mode:** Clean, bright interface
- **Dark Mode:** AMOLED-optimized pure black theme
- **Colors:**
  - Primary: Purple (#9333ea)
  - Secondary: Teal (#14b8a6)
  - Accent: Pink (#ec4899)
- **Fonts:**
  - Headings: Poppins
  - Body: Inter

## 📱 Responsive Breakpoints

- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

## 🚀 Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Configure environment variables
4. Deploy

### Manual Deployment

```bash
# Build for production
npm run build

# Start production server
npm start
```

## 🔒 Security Features

- HTTP-only cookies for tokens
- CSRF protection
- SQL injection prevention (parameterized queries)
- XSS protection
- Role-based access control
- Secure password hashing
- Environment variable protection

## 🐛 Troubleshooting

### Common Issues

**Database Connection Failed:**
- Check `.env.local` credentials
- Ensure MySQL is running
- Verify database exists

**Authentication Not Working:**
- Clear browser cookies
- Check JWT_SECRET is set
- Verify token expiration

**Images Not Loading:**
- Use Unsplash URLs only
- Check image URL format
- Verify network connectivity

## 📚 Additional Documentation

- [Technical Architecture](TECHNICAL_ARCHITECTURE.md)
- [Feature Execution Plan](FEATURE_EXECUTION_PLAN.md)
- [Project Overview](PROJECT_OVERVIEW.md)
- [Database Migration Guide](database/DATABASE_MIGRATION_GUIDE.md)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is proprietary software for KarUCU Main Campus.

## 👨‍💻 Development Team

Developed for Karatina University Christian Union (KarUCU) Main Campus

## 📞 Support

For issues or questions, contact the development team.

---

**Built with ❤️ for KarUCU Main Campus**
