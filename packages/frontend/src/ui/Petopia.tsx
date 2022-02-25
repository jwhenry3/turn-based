import { lazy, Suspense } from 'react'
import { useSceneState } from '../networking/state/use-scene-state'
import { useLobby } from '../networking/use-lobby'
import Lobby from './lobby/Lobby'

const maps: Record<string, Function> = {}
export function Petopia() {
  useLobby(true)
  const { scene } = useSceneState()
  if (!scene) {
    return <Lobby />
  }
  try {
    maps[scene] = maps[scene] || lazy(() => import('./maps/' + scene))
    const Component = maps[scene]
    return (
      <Suspense fallback={<div>Loading map...</div>}>
        <Component />
      </Suspense>
    )
  } catch (e) {
    return <div>Map Not Found</div>
  }
}
