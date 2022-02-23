import { Client, Room } from 'colyseus.js'
import { useEffect, useRef, useState } from 'react'
import { useLobbyState } from './state/use-lobby-state'

const lobbyObj: { current: Room | undefined } = { current: undefined }
export function useLobby(isTopLevel: boolean = false) {
  const lobby = lobbyObj
  const [attempts, setAttempts] = useState<number>(0)
  const lobbyState = useLobbyState()

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
        if (typeof lobby.current !== 'undefined' && isTopLevel) {
          lobby.current.connection.close()
          lobby.current = undefined
        }
      }
    }
  }, [attempts])
  return lobby
}
