import { Room } from 'colyseus.js'
import { useEffect, useRef, useState } from 'react'
import { useClient } from './use-client'

export function useLobby() {
  const client = useClient()
  const lobby = useRef<Room | undefined>()
  const [attempts, setAttempts] = useState<number>(0)

  useEffect(() => {
    if (client.current) {
      let timeout
      ;(async () => {
        try {
          console.log('Connecting to Lobby... attempt:', attempts + 1)
          const join = (name: string) => client.current.joinOrCreate(name)
          let room = await join('lobby')
          lobby.current = room
          let currentMap: Room
          let characters = []
          console.log('Connected!')
          room.onMessage('rooms', (data) => {
            console.log(data)
          })
          room.send('account:login', { username: '', password: '' })
          room.onMessage('account:login:success', () => {
            room.send('characters:list')
          })
          room.onMessage('characters:list:data', (data) => {
            characters = data
            room.send('characters:select', { id: data[0].id })
          })
          room.onStateChange(async (state: any) => {
            const account = state.accounts.get(room.sessionId)
            if (account) {
              console.log('Logged in!', account)
              if (account.character) {
                console.log('Character Chosen!', account.character.toJSON())
                if (!currentMap) {
                  currentMap = await join(account.character.map)
                  console.log('Joined Map as ' + account.character.name)
                }
              }
            }
          })
          room.onLeave(async (code) => {
            console.log('Disconnected', code)
            if (code === 1000) {
              timeout = setTimeout(() => setAttempts(attempts + 1), 5000)
            }
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
    }
  }, [client.current, attempts])
}
