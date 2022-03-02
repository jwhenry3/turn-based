import { PetNpc } from '../../networking/schemas/PetNpc'
import { app } from '../../ui/app'
import { blurAll } from '../behaviors/blurAll'
import { lerp } from '../behaviors/lerp'
import { MovableEntity } from './movable'
import { PlayerEntity } from './player'

export class PetEntity extends MovableEntity<PetNpc> {
  rectangle: Phaser.GameObjects.Rectangle

  owner: PlayerEntity

  create() {
    this.rectangle = new Phaser.GameObjects.Rectangle(
      this.scene,
      this.position.x,
      this.position.y,
      32,
      64,
      Phaser.Display.Color.HexStringToColor('#8af').color
    )
    this.rectangle.setInteractive(
      new Phaser.Geom.Rectangle(0, 0, 32, 64),
      Phaser.Geom.Rectangle.Contains
    )
    this.rectangle.on('pointerdown', (e) => {
      if (e.downElement.tagName.toLowerCase() !== 'canvas') return
      blurAll()
      e.downElement.focus()
      if (app.selected === this) {
        app.movement.mouseDestination = {
          x: this.position.x,
          y: this.position.y,
        }
      }
      app.selected = this
    })
    this.rectangle.setDepth(Math.round(this.rectangle.y))
    this.rectangle.setOrigin(0.5, 0.75)
    this.scene.add.existing(this.rectangle)
  }

  preUpdate() {
    if (!this.rectangle) {
      this.create()
    }
    if (this.rectangle.active) {
      if (
        this.rectangle.x !== this.position.x ||
        this.rectangle.y !== this.position.y
      ) {
        const newX = lerp(this.rectangle.x, this.position.x, 0.2)
        const newY = lerp(this.rectangle.y, this.position.y, 0.2)
        this.rectangle.setPosition(newX, newY)
      }
      this.rectangle.setDepth(Math.round(this.rectangle.y))
    }
    if (app.selected === this) {
      this.rectangle.setStrokeStyle(
        4,
        Phaser.Display.Color.HexStringToColor('#aaf').color,
        0.5
      )
    } else {
      this.rectangle.setStrokeStyle(0)
    }
  }
  destroy() {
    super.destroy()
    this.rectangle?.destroy()
  }
}
