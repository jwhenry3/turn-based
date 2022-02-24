import { useEffect } from 'react'

export function useUpdateLoop(onUpdate: () => void, speed = 1000 / 60) {
  useEffect(() => {
    let interval = setInterval(() => {
      onUpdate()
    }, speed)

    return () => clearInterval(interval)
  }, [])
}
