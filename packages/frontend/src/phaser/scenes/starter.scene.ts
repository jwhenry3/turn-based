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
      // console.log(input)
      app.selected = undefined
      e.updateWorldPoint(this.input.scene.cameras.main)
      this.localPlayer.destX = Math.round(e.worldX / 8) * 8
      this.localPlayer.destY = Math.round(e.worldY / 8) * 8
    })
  }
}
