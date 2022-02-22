import { Room } from 'colyseus.js'
import { useEffect, useRef, useState } from 'react'
import { useLobbyState } from './state/use-lobby-state'
import { useClient } from './use-client'

export function useLobby() {
  const client = useClient()
  const lobby = useRef<Room | undefined>()
  const [attempts, setAttempts] = useState<number>(0)
  const lobbyState = useLobbyState()

  useEffect(() => {
    if (client.current && !lobby.current) {
      let timeout
      ;(async () => {
        try {
          console.log('Connecting to Lobby... attempt:', attempts + 1)
          let room = await client.current.joinOrCreate('lobby')
          lobby.current = room
          console.log('Connected!')
          room.onStateChange(async (state: any) => {
            const account = state.accounts.get(room.sessionId)
            lobbyState.update(account)
          })
          room.onLeave(async (code) => {
            console.log('Disconnected', code)
            if (code === 1000) {
              lobby.current = undefined
              timeout = setTimeout(() => setAttempts(attempts + 1), 5000)
            }
          })
        } catch (e) {
          lobby.current = undefined
          timeout = setTimeout(() => setAttempts(attempts + 1), 5000)
        }
      })()
      return () => {
        if (typeof timeout !== 'undefined') {
          clearTimeout(timeout)
        }
      }
    }
  }, [client.current, attempts])
  return lobby
}
