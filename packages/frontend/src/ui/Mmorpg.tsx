import styled from '@emotion/styled'
import 'phaser'
import { lazy, Suspense, useRef, useState } from 'react'
import { useSceneState } from '../phaser/use-scene-state'
import { useLobby } from '../networking/use-lobby'
import Lobby from './lobby/Lobby'
import { BackgroundScene } from '../phaser/scenes/background.scene'
import { LobbyScene } from '../phaser/scenes/lobby.scene'
import { StarterScene } from '../phaser/scenes/starter.scene'
import { app } from './app'
const GameContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`
const maps: Record<string, Function> = {}
export default function Mmorpg() {
  useLobby()
  const { scene, update } = useSceneState()
  const onRef = (node) => {
    if (!app.game) {
      app.game = new Phaser.Game({
        parent: node,
        type: Phaser.AUTO,
        backgroundColor: '#0af',
        scale: {
          mode: Phaser.Scale.RESIZE,
          parent: node,
          width: '100%',
          height: '100%',
        },
        input: {
          gamepad: true,
        },
        antialias: false,
        scene: [BackgroundScene],
      })
      app.scenes.lobby = app.game.scene.add('lobby', LobbyScene) as any
      app.scenes.starter = app.game.scene.add('starter', StarterScene) as any
      update('lobby')
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
    <div>
      <GameContainer ref={(node) => onRef(node)} />
      {scene === 'lobby' && <Lobby />}
      {scene && scene !== 'lobby' && renderMap()}
    </div>
  )
}
