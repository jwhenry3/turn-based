import { Client, Room } from 'colyseus.js'
import { useEffect, useRef, useState } from 'react'
import { mapRegions, regionServers } from './maps'
import { useRegion } from './use-region'

export function useMap(name: string) {
  const region = useRegion(mapRegions[name])
  const map = useRef<Room | undefined>()
  const [attempts, setAttempts] = useState<number>(0)

  useEffect(() => {
    if (!map.current && region.current) {
      let timeout
      ;(async () => {
        try {
          const client = region.current as Client
          console.log('Connecting to Map... attempt:', attempts + 1)
          let room = await client.joinOrCreate(name)
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
        if (typeof map.current !== 'undefined') {
          map.current.connection.close()
        }
      }
    }
  }, [region.current, attempts])

  // todo: expose high-level api for interacting with the server (move, chat, etc)
  return map
}
