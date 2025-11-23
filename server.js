const { createServer } = require('http')
const { parse } = require('url')
const next = require('next')
const { Server } = require('socket.io')

const dev = process.env.NODE_ENV !== 'production'
const hostname = 'localhost'
const port = process.env.PORT || 3000

const app = next({ dev, hostname, port })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  const httpServer = createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true)
      await handle(req, res, parsedUrl)
    } catch (err) {
      console.error('Error occurred handling', req.url, err)
      res.statusCode = 500
      res.end('internal server error')
    }
  })

  // Initialize Socket.IO
  const io = new Server(httpServer, {
    cors: {
      origin: `http://localhost:${port}`,
      methods: ['GET', 'POST']
    }
  })

  // Store connected users
  const connectedUsers = new Map()

  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id)

    // Handle user authentication
    socket.on('authenticate', (userData) => {
      connectedUsers.set(socket.id, userData)
      console.log('User authenticated:', userData.email)
      
      // Broadcast user count
      io.emit('users:count', connectedUsers.size)
    })

    // Handle new blog post
    socket.on('blog:new', (blogData) => {
      console.log('New blog post:', blogData.title)
      io.emit('blog:created', blogData)
    })

    // Handle new event
    socket.on('event:new', (eventData) => {
      console.log('New event:', eventData.title)
      io.emit('event:created', eventData)
    })

    // Handle new announcement
    socket.on('announcement:new', (announcementData) => {
      console.log('New announcement:', announcementData.title)
      io.emit('announcement:created', announcementData)
    })

    // Handle prayer request
    socket.on('prayer:new', (prayerData) => {
      console.log('New prayer request from:', prayerData.userName)
      io.emit('prayer:created', prayerData)
    })

    // Handle user activity
    socket.on('activity:update', (activityData) => {
      io.emit('activity:new', activityData)
    })

    // Handle new reading calendar entry
    socket.on('reading-calendar:new', (readingData) => {
      console.log('New reading calendar entry:', readingData.book)
      io.emit('reading-calendar:created', readingData)
    })

    // Handle typing indicator for comments
    socket.on('comment:typing', (data) => {
      socket.broadcast.emit('comment:typing', data)
    })

    // Handle disconnect
    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id)
      connectedUsers.delete(socket.id)
      io.emit('users:count', connectedUsers.size)
    })
  })

  httpServer
    .once('error', (err) => {
      console.error(err)
      process.exit(1)
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`)
      console.log(`> WebSocket server running`)
    })
})
