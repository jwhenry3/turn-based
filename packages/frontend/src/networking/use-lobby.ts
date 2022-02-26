import { Client } from 'colyseus.js'
import { useEffect, useState } from 'react'
import { app } from '../ui/app'

export function useLobby() {
  const [attempts, setAttempts] = useState(0)

  useEffect(() => {
    let timeout
    ;(async () => {
      try {
        const client = new Client('ws://localhost:9200')
        console.log('Connecting to Lobby... attempt:', attempts + 1)
        let room = await client.joinOrCreate('lobby')
        app.rooms.lobby = room
        console.log('Connected!')
        room.onLeave(async (code) => {
          console.log('Disconnected', code)
          const reconnectCodes = [1000, 1006, 1002, 1003]
          if (reconnectCodes.includes(code)) {
            timeout = setTimeout(() => setAttempts(attempts + 1), 5000)
          }
        })
        room.onMessage('*', (type: string, message) => {
          app.messages.lobby.next({ type, message })
        })
      } catch (e) {
        timeout = setTimeout(() => setAttempts(attempts + 1), 5000)
      }
    })()
    return () => {
      if (typeof timeout !== 'undefined') {
        clearTimeout(timeout)
      }
    }
  }, [attempts])
}
