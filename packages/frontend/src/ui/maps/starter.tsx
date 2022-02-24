import { useEffect } from 'react'
import { usePlayerListState } from '../../networking/state/use-player-list-state'
import { useMap } from '../../networking/use-map'
import { Player } from '../entities/Player'

export default function Starter() {
  const { map } = useMap('starter', true)
  const players = usePlayerListState(({ players }) => players)
  useEffect(() => {
    const keysDown = []
    const movementKeys = ['w', 'a', 's', 'd']
    const onKeyDown = (e) => {
      if (movementKeys.includes(e.key.toLowerCase()) && !keysDown.includes(e.key.toLowerCase())) {
        keysDown.push(e.key.toLowerCase())
      }
    }
    const onKeyUp = (e) => {
      if (keysDown.includes(e.key.toLowerCase())) {
        keysDown.splice(keysDown.indexOf(e.key.toLowerCase()), 1)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)
    const interval = setInterval(() => {
      const horizontal = keysDown.includes('a')
        ? -1
        : keysDown.includes('d')
        ? 1
        : 0
      const vertical = keysDown.includes('w')
        ? -1
        : keysDown.includes('s')
        ? 1
        : 0
      if (horizontal || vertical) {
        map.current?.send('character:move', { horizontal, vertical })
      }
    }, 1000 / 10) // interval for 30fps
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
      clearInterval(interval)
    }
  }, [])
  console.log('Rerender')
  return (
    <div>
      <div>Starter Map</div>
      {players.map((key) => (
        <Player key={key} name={key} />
      ))}
    </div>
  )
}
