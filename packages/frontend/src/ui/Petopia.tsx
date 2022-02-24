import { lazy, Suspense } from 'react'
import { useLobbyState } from '../networking/state/use-lobby-state'
import { useLobby } from '../networking/use-lobby'
import Lobby from './lobby/Lobby'

export function Petopia() {
  useLobby(true)
  const lobbyState = useLobbyState()
  if (!lobbyState.account?.character) {
    return <Lobby />
  }
  try {
    const Component = lazy(
      () => import('./maps/' + lobbyState.account.character.position.map)
    )
    return (
      <Suspense fallback={<div>Loading map...</div>}>
        <Component />
      </Suspense>
    )
  } catch (e) {
    return <div>Map Not Found</div>
  }
}
