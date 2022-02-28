import { Npc } from '../../networking/schemas/Npc'
import { lerp } from '../behaviors/lerp'
import { MovableEntity } from './movable'

export class NpcEntity extends MovableEntity<Npc> {
  rectangle: Phaser.GameObjects.Rectangle

  create() {
    this.rectangle = new Phaser.GameObjects.Rectangle(
      this.scene,
      this.position.x,
      this.position.y,
      32,
      64,
      Phaser.Display.Color.HexStringToColor('#ff8822').color
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
      this.rectangle.setDepth(
        Math.round(this.rectangle.y - this.rectangle.height)
      )
    }
  }
}
