import { Npc } from '../../networking/schemas/Npc'
import { lerp } from '../behaviors/lerp'
import { NetworkedScene } from '../scenes/networked.scene'
import { MovableEntity } from './movable'

export class NpcEntity extends MovableEntity<Npc> {
  rectangle: Phaser.GameObjects.Rectangle

  constructor(public model: Npc, public scene: NetworkedScene) {
    super(model, scene)
  }
  create() {
    // Using a circle for collision
    const color = Phaser.Display.Color.HexStringToColor('#ff8822')
    color.alpha = 0.5

    this.rectangle = new Phaser.GameObjects.Rectangle(
      this.scene,
      this.position.x,
      this.position.y,
      32,
      60,
      color.color,
      color.alpha
    )
    this.rectangle.setAlpha(color.alpha)
    this.scene.add.existing(this.rectangle)
  }

  preUpdate() {
    if (!this.rectangle) {
      this.create()
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
