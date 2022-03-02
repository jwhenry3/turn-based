import { PetNpc } from '../../networking/schemas/PetNpc'
import { app } from '../../ui/app'
import { lerp } from '../behaviors/lerp'
import { MovableEntity } from './movable'

export class PetEntity extends MovableEntity<PetNpc> {
  rectangle: Phaser.GameObjects.Rectangle

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
    if (this.rectangle.active && this.model.despawned) {
      this.rectangle.setActive(false)
      this.rectangle.setVisible(false)
    }
    if (!this.rectangle.active && !this.model.despawned) {
      this.rectangle.setActive(true)
      this.rectangle.setVisible(true)
    }
    if (this.rectangle.active) {
      if (
        this.rectangle.x !== this.position.x ||
        this.rectangle.y !== this.position.y
      ) {
        const newX = lerp(this.rectangle.x, this.position.x, 0.5)
        const newY = lerp(this.rectangle.y, this.position.y, 0.5)
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
    this.rectangle.destroy()
  }
}