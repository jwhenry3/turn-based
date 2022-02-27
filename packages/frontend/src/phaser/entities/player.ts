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
      60,
      Phaser.Display.Color.HexStringToColor('#00aa22').color
    )
    this.scene.add.existing(this.rectangle)
  }

  preUpdate() {
    if (!this.rectangle) {
      this.create()
    }
    if (this.isLocalPlayer) {
      app.movement.update(this.scene.input)
    }
    if (
      this.rectangle.x !== this.position.x ||
      this.rectangle.y !== this.position.y
    ) {
      this.rectangle?.setPosition(
        lerp(this.rectangle.x, this.position.x, 0.5),
        lerp(this.rectangle.y, this.position.y, 0.5)
      )
    }
  }
}
