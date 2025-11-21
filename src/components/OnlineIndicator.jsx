'use client'

import { useSocket } from '@/contexts/SocketContext'

export default function OnlineIndicator() {
  const { isConnected, onlineUsers } = useSocket()

  return (
    <div className="flex items-center space-x-2 text-sm">
      <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-gray-400'}`}>
        {isConnected && (
          <div className="w-2 h-2 rounded-full bg-green-500 animate-ping"></div>
        )}
      </div>
      <span className="text-gray-600">
        {isConnected ? `${onlineUsers} online` : 'Offline'}
      </span>
    </div>
  )
}
