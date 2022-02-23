import { Client, Room } from 'colyseus.js'
import { useEffect, useRef, useState } from 'react'
import { mapRegions, regionServers } from './maps'
import { useRegion } from './use-region'

const maps: Record<string, { room: Room }> = {}
export function useMap(name: string) {
  const { region, rooms } = useRegion(mapRegions[name], name)
  const map = useRef<Room | undefined>()
  const [attempts, setAttempts] = useState<number>(0)

  useEffect(() => {
    if (!maps[name] && region.current) {
      let timeout
      maps[name] = {
        room: undefined,
      }
      ;(async () => {
        try {
          const client = region.current as Client
          console.log('Connecting to Map... attempt:', attempts + 1)
          let room = await client.joinOrCreate(name)
          maps[name] = { room }
          map.current = room
          console.log('Connected!')
          room.onMessage('scene:created', () => {
            console.log('Scene Created')
          })
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
  return { region, map, rooms }
}
