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
          const join = (name: string) => client.current.joinOrCreate(name)
          let room = await join('lobby')
          lobby.current = room
          console.log('Connected!')
          room.onMessage('rooms', (data) => {
            console.log(data)
          })
          room.send('account:login', { username: '', password: '' })
          room.onStateChange(async (state: any) => {
            console.log('State', state.toJSON())
            const account = state.accounts.get(room.sessionId)
            const previousAccount = lobbyState.account
            lobbyState.update(account)
            if (account && !previousAccount) {
              console.log('Logged in!', account)
            }
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
}
