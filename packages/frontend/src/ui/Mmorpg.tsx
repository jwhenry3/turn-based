import styled from '@emotion/styled'
import 'phaser'
import { lazy, Suspense, useRef, useState } from 'react'
import { useSceneState } from '../networking/state/use-scene-state'
import { useLobby } from '../networking/use-lobby'
import Lobby from './lobby/Lobby'
const GameContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`
const maps: Record<string, Function> = {}
export default function Mmorpg() {
  useLobby(true)
  const { scene } = useSceneState()
  const game = useRef<Phaser.Game | undefined>()
  const [hasInteracted, setHasInteracted] = useState(false)
  const onRef = (node) => {
    if (!game.current) {
      game.current = new Phaser.Game({
        parent: node,
        type: Phaser.AUTO,
        backgroundColor: '#0af',
        scale: {
          mode: Phaser.Scale.RESIZE,
          parent: node,
          width: '100%',
          height: '100%',
        },
        antialias: false,
        scene: {
          preload: () => {},
          create() {
            this.scale.on('resize', (gameSize) => {
              this.cameras.resize(gameSize.width, gameSize.height)
            })
          },
          update: () => {},
        },
      })
    }
  }
  const renderMap = () => {
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
  return (
    <div onClick={() => setHasInteracted(true)}>
      {hasInteracted && <GameContainer ref={(node) => onRef(node)} />}
      {!scene && <Lobby />}
      {scene && renderMap()}
    </div>
  )
}
