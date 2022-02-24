import { Client, Room } from 'colyseus.js'
import { useEffect, useRef, useState } from 'react'
import { mapRegions } from './maps'
import { useAuthState } from './state/use-auth-state'
import { useEntityState } from './state/use-entity-state'
import { usePlayerListState } from './state/use-player-list-state'
import { useRegion } from './use-region'

const maps: Record<string, { room: Room }> = {}
export function useMap(name: string, root: boolean = false) {
  const { token, characterId } = useAuthState()
  const { region } = useRegion(mapRegions[name], name)
  const map = useRef<Room | undefined>(maps[name]?.room)
  const playerList = usePlayerListState(({ update }) => ({ update }))
  const updateEntities = useEntityState(({ update }) => update)
  const connect = async (data: { timeout: any }) => {
    try {
      const client = region.current as Client
      let room = await client.joinOrCreate(name, {
        token,
        characterId,
      })
      maps[name] = { room }
      map.current = room
      console.log('Connected!')
      room.onMessage('scene:created', () => {
        console.log('Scene Created')
      })
      room.onStateChange(async (state: any) => {
        const stateObject = state.toJSON()
        playerList.update(Object.keys(stateObject.players))
        updateEntities(stateObject.players)
      })

      const stateObject = (room.state as any).toJSON()
      playerList.update(Object.keys(stateObject.players))
      updateEntities(stateObject.players)

      room.onLeave(async (code) => {
        console.log('Disconnected', code)
        if (code === 1000) {
          map.current = undefined
          data.timeout = setTimeout(connect, 5000)
        }
      })
      return room
    } catch (e) {
      map.current = undefined
      data.timeout = setTimeout(connect, 5000)
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
