import { Character } from '../../networking/schemas/Character'
import { app } from '../../ui/app'
import { lerp } from '../behaviors/lerp'
import { MovableEntity } from './movable'

export class PlayerEntity extends MovableEntity<Character> {
  rectangle: Phaser.GameObjects.Rectangle

  get isLocalPlayer() {
    return this.model.currentClientId === this.scene.connector.room.sessionId
  }

  create() {
    console.log('player create')
    // Using a circle for collision
    this.rectangle = new Phaser.GameObjects.Rectangle(
      this.scene,
      this.position.x,
      this.position.y,
      32,
      64,
      Phaser.Display.Color.HexStringToColor('#55f').color
    )
    this.rectangle.setInteractive(
      new Phaser.Geom.Rectangle(0, 0, 32, 64),
      Phaser.Geom.Rectangle.Contains
    )
    this.rectangle.on('pointerdown', (e) => {
      if (this.model.inBattle && !this.isLocalPlayer) {
        console.log('prompt for joining battle')
      }
      if (this.isLocalPlayer) {
        console.log(e)
      }
    })
    this.rectangle.setDepth(
      Math.round(this.rectangle.y)
    )
    this.rectangle.originX = 16
    this.rectangle.originY = 60
    this.scene.add.existing(this.rectangle)
    if (this.isLocalPlayer) {
      this.scene.cameras.main.startFollow(this.rectangle, false, 0.05, 0.05)
      this.scene.cameras.main.setDeadzone(128, 128)
      this.scene.cameras.main.setZoom(1)
      app.movement.create(this.scene.input)
      app.movement.enabled = true
      app.movement.onChange = ([horizontal, vertical]) => {
        this.scene.connector.room.send('character:move', {
          horizontal,
          vertical,
        })
      }
    }
  }
  lastWidth = 1600
  preUpdate() {
    if (!this.rectangle) {
      this.create()
    }
    if (this.lastWidth !== window.innerWidth) {
      // this.scene.cameras.main.setZoom(window.innerWidth / 1600)
    }
    if (this.isLocalPlayer && this.rectangle) {
      app.movement.update(this.scene.input, this.rectangle)
    }
    if (
      this.rectangle.x !== this.position.x ||
      this.rectangle.y !== this.position.y
    ) {
      const newX = lerp(this.rectangle.x, this.position.x, 0.2)
      const newY = lerp(this.rectangle.y, this.position.y, 0.2)
      this.rectangle.setPosition(newX, newY)
    }
    this.rectangle.setDepth(
      Math.round(this.rectangle.y - this.rectangle.height)
    )
  }
  destroy() {
    super.destroy()
    this.rectangle.destroy()
  }
}
