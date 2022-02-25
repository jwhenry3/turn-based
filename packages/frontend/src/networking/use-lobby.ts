import { Client, Room } from 'colyseus.js'
import { useEffect, useRef, useState } from 'react'
import { useLobbyState } from './state/use-lobby-state'
import { Observable, Subject } from 'rxjs'

const lobbyObj: {
  current: Room | undefined
  messages: Subject<{ type: string; message: any }>
} = {
  current: undefined,
  messages: new Subject<{ type: string; message: any }>(),
}
export function useLobby(isTopLevel: boolean = false) {
  const lobby = lobbyObj
  const [attempts, setAttempts] = useState<number>(0)
  const update = useLobbyState(
    ({ update }) => update,
    () => false
  )

  useEffect(() => {
    if (!lobby.current && isTopLevel) {
      let timeout
      ;(async () => {
        try {
          const client = new Client('ws://localhost:9200')
          console.log('Connecting to Lobby... attempt:', attempts + 1)
          let room = await client.joinOrCreate('lobby')
          lobby.current = room
          console.log('Connected!')
          room.onStateChange(async (state: any) => {
            const account = state.accounts.get(room.sessionId)
            update(account)
          })
          room.onLeave(async (code) => {
            console.log('Disconnected', code)
            const reconnectCodes = [1000, 1006, 1002, 1003]
            if (reconnectCodes.includes(code)) {
              lobby.current = undefined
              timeout = setTimeout(() => setAttempts(attempts + 1), 5000)
            }
          })
          room.onMessage('*', (type: string, message) => {
            lobby.messages.next({ type, message })
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
        if (typeof lobby.current !== 'undefined' && isTopLevel) {
          lobby.current.connection.close()
          lobby.current = undefined
        }
      }
    }
  }, [attempts])
  return lobby
}
