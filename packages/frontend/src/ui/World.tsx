import { Button } from '@mui/material'
import { useEffect, useRef } from 'react'
import { NetworkedScene } from '../phaser/scenes/networked.scene'
import { useSceneState } from '../phaser/use-scene-state'
import { app } from './app'

export function World() {
  const oldMap = useRef<string>('')
  const { scene, update } = useSceneState()
  const onLogout = (e) => {
    app.rooms.lobby.send('account:logout')
    update('lobby')
  }
  const onLeave = (e) => {
    app.rooms.starter.send('character:battle:leave')
  }
  useEffect(() => {
    ;(async () => {
      if (oldMap.current !== scene) {
        const oldScene = app.game.scene.getScene(oldMap.current)
        if (oldScene instanceof NetworkedScene) {
          await oldScene.stop()
          oldScene.connector.onDisconnect = () => null
        } else if (oldScene) {
          app.game.scene.stop(oldMap.current)
        }
        const newScene = app.game.scene.getScene(scene)
        if (newScene instanceof NetworkedScene) {
          await newScene.start()
          // logout or go to lobby when the map disconnects so we properly update state
          newScene.connector.onDisconnect = () => update('lobby')
        } else if (newScene) {
          app.game.scene.start(scene)
        }
        oldMap.current = scene
      }
    })()
  }, [scene])
  // Todo: hud and game UI goes here
  return (
    <>
      <Button onClick={onLogout}>Logout</Button>{' '}
      <Button onClick={onLeave}>Leave Battle</Button>
    </>
  )
}
