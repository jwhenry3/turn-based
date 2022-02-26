import { Room } from 'colyseus.js'
import { useEffect } from 'react'

function getAxis(keysDown: string[]) {
  const valueOf = (key: string) => Number(keysDown.includes(key))
  const horizontal = 0 - valueOf('a') + valueOf('d')
  const vertical = 0 - valueOf('w') + valueOf('s')
  return { horizontal, vertical }
}
export function useMovementInput(map: { current?: Room }) {
  useEffect(() => {
    let keysDown = []
    const movementKeys = ['w', 'a', 's', 'd']
    const move = () => {
      map.current?.send('character:move', getAxis(keysDown))
    }
    const onKeyDown = (e) => {
      if (
        movementKeys.includes(e.key.toLowerCase()) &&
        !keysDown.includes(e.key.toLowerCase())
      ) {
        keysDown.push(e.key.toLowerCase())
        move()
      }
    }
    const onKeyUp = (e) => {
      if (
        movementKeys.includes(e.key.toLowerCase()) &&
        keysDown.includes(e.key.toLowerCase())
      ) {
        keysDown.splice(keysDown.indexOf(e.key.toLowerCase()), 1)
        move()
      }
    }
    window.addEventListener('blur', () => {
      keysDown = []
      move()
    })
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
    }
  }, [])
}
