import { Client } from 'colyseus.js'
import { useEffect, useRef } from 'react'

export function useClient() {
  const client = useRef<Client | undefined>()

  useEffect(() => {
    if (!client.current) {
      client.current = new Client('ws://localhost:9200')
    }
  }, [])
  return client
}
