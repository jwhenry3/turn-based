import { Client } from 'colyseus.js'
import { useEffect, useState } from 'react'
import { app } from '../ui/app'
import { useLobbyState } from './state/use-lobby-state'

export function useLobby(isTopLevel: boolean = false) {
  const [attempts, setAttempts] = useState<number>(0)
  const update = useLobbyState(
    ({ update }) => update,
    () => false
  )

  useEffect(() => {
    if (!app.rooms.lobby && isTopLevel) {
      let timeout
      ;(async () => {
        try {
          const client = new Client('ws://localhost:9200')
          console.log('Connecting to Lobby... attempt:', attempts + 1)
          let room = await client.joinOrCreate('lobby')
          app.rooms.lobby = room
          console.log('Connected!')
          room.onStateChange(async (state: any) => {
            const account = state.accounts.get(room.sessionId)
            update(account)
          })
          room.onLeave(async (code) => {
            console.log('Disconnected', code)
            const reconnectCodes = [1000, 1006, 1002, 1003]
            if (reconnectCodes.includes(code)) {
              app.rooms.lobby = undefined
              timeout = setTimeout(() => setAttempts(attempts + 1), 5000)
            }
          })
          room.onMessage('*', (type: string, message) => {
            app.messages.lobby.next({ type, message })
          })
        } catch (e) {
          app.rooms.lobby = undefined
          timeout = setTimeout(() => setAttempts(attempts + 1), 5000)
        }
      })()
      return () => {
        if (typeof timeout !== 'undefined') {
          clearTimeout(timeout)
        }
        if (typeof app.rooms.lobby !== 'undefined' && isTopLevel) {
          app.rooms.lobby.connection.close()
          app.rooms.lobby = undefined
        }
      }
    }
  }, [attempts])
}
