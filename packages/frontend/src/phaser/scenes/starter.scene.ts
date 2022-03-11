import { app } from '../../ui/app'
import { blurAll } from '../behaviors/blurAll'
import { InputPlugin } from '../entities/plugins/input'
import { NetworkedScene } from './networked.scene'
import { SceneConnector } from './scene.connector'

export class StarterScene extends NetworkedScene {
  attempts = 0
  timeout: any

  connector = new SceneConnector('starter')

  ground: Phaser.GameObjects.Rectangle
  create() {
    super.create()
    this.ground.on('pointerdown', (e: Phaser.Input.Pointer) => {
      if (e.downElement.tagName.toLowerCase() !== 'canvas') return
      blurAll()
      const input = this.localPlayer?.pluginPipeline?.plugins?.find(
        (p: InputPlugin) => p.mouseCooldown
      ) as InputPlugin
      // console.log(input)
      app.selected = undefined
      if (input?.mouseTick === 0) {
        input.mouseTick = input.mouseCooldown
        e.updateWorldPoint(this.input.scene.cameras.main)
        this.connector.room.send('character:move:destination', {
          x: e.worldX,
          y: e.worldY,
        })
      }
    })
  }
}
