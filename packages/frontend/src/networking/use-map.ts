import { Client, Room } from 'colyseus.js'
import { useEffect, useRef, useState } from 'react'

export function useMap(name: string, port: number) {
  const map = useRef<Room | undefined>()
  const [attempts, setAttempts] = useState<number>(0)

  useEffect(() => {
    if (!map.current) {
      let timeout
      ;(async () => {
        try {
          const client = new Client('ws://localhost:' + port)
          console.log('Connecting to Map... attempt:', attempts + 1)
          let room = await client.joinOrCreate('lobby')
          map.current = room
          console.log('Connected!')
          room.onStateChange(async (state: any) => {
            console.log('state', state)
          })
          room.onLeave(async (code) => {
            console.log('Disconnected', code)
            if (code === 1000) {
              map.current = undefined
              timeout = setTimeout(() => setAttempts(attempts + 1), 5000)
            }
          })
        } catch (e) {
          map.current = undefined
          timeout = setTimeout(() => setAttempts(attempts + 1), 5000)
        }
      })()
      return () => {
        if (typeof timeout !== 'undefined') {
          clearTimeout(timeout)
        }
      }
    }
  }, [attempts])
  return map
}
