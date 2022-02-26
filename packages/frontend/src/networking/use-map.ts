import { MapSchema } from '@colyseus/schema'
import { Client, Room } from 'colyseus.js'
import { useEffect, useRef, useState } from 'react'
import { app } from '../ui/app'
import { mapRegions } from './maps'
import { Character } from './schemas/Character'
import { Npc } from './schemas/Npc'
import { useAuthState } from './state/use-auth-state'
import { useRegion } from './use-region'

const maps: Record<string, { room: Room }> = {}

export function useMap(name: string, root: boolean = false) {
  const { token, characterId } = useAuthState()
  const { region } = useRegion(mapRegions[name])
  const map = useRef<Room | undefined>(maps[name]?.room)

  const connect = async (data: { timeout: any }) => {
    try {
      const client = region.current as Client
      let room = await client.joinOrCreate(name, {
        token,
        characterId,
      })
      maps[name] = { room }
      map.current = room
      app.entities = room.state as {
        players: MapSchema<Character>
        npcs: MapSchema<Npc>
      }

      room.onLeave(async (code) => {
        console.log('Disconnected', code)
        const reconnectCodes = [1000, 1006, 1002, 1003]
        if (reconnectCodes.includes(code) && map.current === room) {
          map.current = undefined
          data.timeout = setTimeout(() => connect(data), 5000)
        }
      })
      return room
    } catch (e) {
      map.current = undefined
      data.timeout = setTimeout(() => connect(data), 5000)
    }
  }
  useEffect(() => {
    if (root) {
      maps[name] = {
        room: undefined,
      }
      const data = { timeout: undefined }
      connect(data)
      return () => {
        if (typeof data.timeout !== 'undefined') {
          clearTimeout(data.timeout)
        }
        if (typeof map.current !== 'undefined') {
          map.current.connection.close()
          map.current = undefined
          maps[name] = {
            room: undefined,
          }
        }
      }
    }
  }, [])

  // todo: expose high-level api for interacting with the server (move, chat, etc)
  return { region, map }
}
