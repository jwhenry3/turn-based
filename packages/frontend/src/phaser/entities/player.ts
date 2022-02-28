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
    if (this.isLocalPlayer) {
      app.movement.create(this.scene.input)
      app.movement.enabled = true
      app.movement.onChange = ([horizontal, vertical]) => {
        this.scene.connector.room.send('character:move', {
          horizontal,
          vertical,
        })
      }
    }
    // Using a circle for collision
    this.rectangle = new Phaser.GameObjects.Rectangle(
      this.scene,
      this.position.x,
      this.position.y,
      32,
      64,
      Phaser.Display.Color.HexStringToColor('#00aa22').color
    )
    this.rectangle.setDepth(
      Math.round(this.rectangle.y - this.rectangle.height)
    )
    this.rectangle.originX = 16
    this.rectangle.originY = 56
    this.scene.add.existing(this.rectangle)
  }

  preUpdate() {
    if (!this.rectangle) {
      this.create()
    }
    if (this.isLocalPlayer && this.rectangle) {
      app.movement.update(this.scene.input, this.rectangle)
    }
    if (
      this.rectangle.x !== this.position.x ||
      this.rectangle.y !== this.position.y
    ) {
      const newX = lerp(this.rectangle.x, this.position.x, 0.5)
      const newY = lerp(this.rectangle.y, this.position.y, 0.5)
      this.rectangle.setPosition(newX, newY)
    }
    this.rectangle.setDepth(
      Math.round(this.rectangle.y - this.rectangle.height)
    )
  }
}
