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
import { World } from './World'
const GameContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`
const maps: Record<string, Function> = {}
export default function Mmorpg() {
  const lobby = useLobby()
  const { scene, update } = useSceneState()
  const onRef = (node) => {
    if (!app.game) {
      app.game = new Phaser.Game({
        parent: node,
        type: Phaser.WEBGL,
        backgroundColor: '#0af',
        scale: {
          mode: Phaser.Scale.RESIZE,
          parent: node,
          width: 1600,
          height: 900,
          autoCenter: Phaser.Scale.Center.CENTER_BOTH,
          autoRound: true,
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
  const onFocusChange = (value: boolean) => {
    console.log('focus change', value)
  }
  return (
    <div>
      <GameContainer
        ref={(node) => onRef(node)}
        onMouseLeave={() => onFocusChange(false)}
        onMouseEnter={() => onFocusChange(true)}
      />
      <div onMouseEnter={() => onFocusChange(false)}>
        {scene === 'lobby' && lobby && lobby.state && <Lobby />}
        {scene && scene !== 'lobby' && <World />}
      </div>
    </div>
  )
}
