import { app } from '../../ui/app'
import { blurAll } from '../behaviors/blurAll'
import { NetworkedScene } from './networked.scene'
import { SceneConnector } from './scene.connector'

export class StarterScene extends NetworkedScene {
  attempts = 0
  timeout: any

  connector = new SceneConnector('starter')
  width = 2056
  height = 2056

  rectangle: Phaser.GameObjects.Rectangle
  create() {
    super.create()
    this.rectangle = this.add.rectangle(
      this.width / 2,
      this.height / 2,
      this.width,
      this.height,
      Phaser.Display.Color.HexStringToColor('#00aa66').color
    )
    this.rectangle.setDepth(-100)
    this.rectangle.setInteractive(
      new Phaser.Geom.Rectangle(0, 0, this.width, this.height),
      Phaser.Geom.Rectangle.Contains
    )
    this.rectangle.on('pointerdown', (e: Phaser.Input.Pointer) => {
      if (e.downElement.tagName.toLowerCase() !== 'canvas') return
      blurAll()
      const input = app.movement
      app.target = undefined
      if (input.mouseTick === 0) {
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
