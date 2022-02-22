import { Client } from 'colyseus.js'
import { useEffect, useRef } from 'react'
import { regionServers } from './maps'

const regions: Record<string, Client> = {}
export function useRegion(name: string) {
  const region = useRef<Client | undefined>()

  useEffect(() => {
    if (!regions[name]) {
      regions[name] = new Client(regionServers[name])
    }
    region.current = regions[name]
  }, [region])
  return region
}
