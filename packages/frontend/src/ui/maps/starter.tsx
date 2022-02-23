import { useEffect } from 'react'
import { useRoomsState } from '../../networking/state/use-rooms-state'
import { useMap } from '../../networking/use-map'

export default function Starter() {
  const { region, map, rooms } = useMap('starter')
  const roomsState = useRoomsState()

  useEffect(() => {
    console.log(rooms)
  }, [rooms])

  return <div>Starter Map</div>
}
