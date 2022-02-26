import { MapSchema } from '@colyseus/schema'
import { useEffect, useState } from 'react'
import { app } from '../ui/app'
import { Character } from './schemas/Character'
import { Npc } from './schemas/Npc'

export function useMap(name: string, root: boolean = false) {
  const [attempts, setAttempts] = useState(0)
  useEffect(() => {
    let timeout
    if (!app.regions[app.regionMaps[name]]) {
      throw new Error('invalid map name')
    }
    ;(async () => {
      try {
        const client = app.regions[app.regionMaps[name]]
        let room = await client.joinOrCreate(name, {
          token: app.auth.token,
          characterId: app.auth.characterId,
        })
        app.rooms[name] = room
        app.entities = room.state as {
          players: MapSchema<Character>
          npcs: MapSchema<Npc>
        }

        room.onLeave(async (code) => {
          console.log('Disconnected', code)
          const reconnectCodes = [1000, 1006, 1002, 1003]
          if (reconnectCodes.includes(code)) {
            timeout = setTimeout(() => setAttempts(attempts + 1), 5000)
          }
        })
        return room
      } catch (e) {
        timeout = setTimeout(() => setAttempts(attempts + 1), 5000)
      }
    })()
    return () => {
      if (typeof timeout !== 'undefined') {
        clearTimeout(timeout)
      }
      app.rooms[name]?.connection.close()
      app.rooms[name] = undefined
    }
  }, [])
}
