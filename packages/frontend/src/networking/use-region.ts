import { Client } from 'colyseus.js'
import { useEffect, useRef } from 'react'
import { regionServers } from './maps'
import { useRoomsState } from './state/use-rooms-state'

const regions: Record<string, Client> = {}
export function useRegion(name: string, roomName?: string) {
  const region = useRef<Client | undefined>()
  const { rooms, setRoomsFor } = useRoomsState(({ setRoomsFor, regions }) => ({
    rooms: roomName
      ? regions[name]?.filter((room) => room.name === roomName) || []
      : regions[name] || [],
    setRoomsFor,
  }))

  useEffect(() => {
    let roomInstance
    let timeout
    if (!regions[name]) {
      regions[name] = new Client(regionServers[name])
      const connect = async () => {
        if (timeout) {
          clearTimeout(timeout)
        }
        try {
          const room = await regions[name].joinOrCreate('lobby')
          roomInstance = room
          room.onMessage('rooms', (data) => {
            setRoomsFor(name, data)
          })
          room.onLeave((code) => {
            if (code === 1000) {
              timeout = setTimeout(connect, 5000)
            }
          })
        } catch (e) {
          timeout = setTimeout(connect, 5000)
        }
      }
      connect()
    }
    region.current = regions[name]
    return () => {
      if (timeout) {
        clearTimeout(timeout)
        timeout = undefined
      }
    }
  }, [region])
  return { region, rooms }
}
