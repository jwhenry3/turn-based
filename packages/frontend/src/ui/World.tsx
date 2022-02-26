import { useEffect, useRef } from 'react'
import { NetworkedScene } from '../phaser/scenes/networked.scene'
import { useSceneState } from '../phaser/use-scene-state'
import { app } from './app'

export function World() {
  const oldMap = useRef<string>('')
  const { scene, update } = useSceneState()

  useEffect(() => {
    ;(async () => {
      if (oldMap.current !== scene) {
        const oldScene = app.game.scene.getScene(oldMap.current)
        if (oldScene instanceof NetworkedScene) {
          await oldScene.stop()
        } else if (oldScene) {
          app.game.scene.stop(oldMap.current)
        }
        const newScene = app.game.scene.getScene(scene)
        if (newScene instanceof NetworkedScene) {
          await newScene.start()
        } else if (newScene) {
          app.game.scene.start(scene)
        }
        oldMap.current = scene
      }
    })()
  }, [scene])
  // Todo: hud and game UI goes here
  return <>{scene}</>
}
