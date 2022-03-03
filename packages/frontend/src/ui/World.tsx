import { Button } from '@mui/material'
import { useEffect, useRef } from 'react'
import { NetworkedScene } from '../phaser/scenes/networked.scene'
import { useBattle } from '../phaser/use-battle'
import { useSceneState } from '../phaser/use-scene-state'
import { app } from './app'
import { BattleHud } from './battle/hud/BattleHud'
import { WorldHud } from './world/hud/WorldHud'

export function World() {
  const oldMap = useRef<string>('')
  const { battle } = useBattle()
  const { scene, update } = useSceneState()
  useEffect(() => {
    ;(async () => {
      if (oldMap.current !== scene) {
        const oldScene = app.game.scene.getScene(oldMap.current)
        if (oldScene instanceof NetworkedScene) {
          oldScene.stop()
          oldScene.connector.onDisconnect = () => null
        } else if (oldScene) {
          app.game.scene.stop(oldMap.current)
        }
        const newScene = app.game.scene.getScene(scene)
        if (newScene instanceof NetworkedScene) {
          await newScene.start()
          // logout or go to lobby when the map disconnects so we properly update state
          newScene.connector.onDisconnect = () => {
            update('lobby')
            newScene.stop()
            newScene.connector.onDisconnect = () => null
          }
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
      {!battle && <WorldHud />}
      {battle && <BattleHud battle={battle} />}
    </>
  )
}
