import { BattleEntity } from '../battle/battle-entity'
import { MovableEntity } from '../movable'

export class ShadowPlugin {
  gameObject: Phaser.GameObjects.Arc

  isGlowing = false
  isTarget = false
  constructor(
    public scene: Phaser.Scene,
    public owner: MovableEntity<any> | BattleEntity<any>
  ) {}

  create() {
    this.gameObject = new Phaser.GameObjects.Arc(
      this.scene,
      0,
      0,
      16,
      0,
      360,
      false,
      Phaser.Display.Color.HexStringToColor('#333').color,
      0.2
    )
    this.gameObject.setOrigin(0.5, 0.5)
    this.gameObject.setScale(1, 0.5)
  }

  update() {
    if (!this.gameObject) return
    if (this.isGlowing) {
      this.gameObject.setFillStyle(
        Phaser.Display.Color.HexStringToColor(this.isTarget ? '#f8a' : '#8af')
          .color,
        0.5
      )
      this.gameObject.setStrokeStyle(
        2,
        Phaser.Display.Color.HexStringToColor(this.isTarget ? '#f8a' : '#8af')
          .color
      )
      this.gameObject.setScale(2, 1)
    } else {
      this.gameObject.setStrokeStyle(undefined)
      this.gameObject.setFillStyle(
        Phaser.Display.Color.HexStringToColor('#333').color,
        0.2
      )
      this.gameObject.setScale(1, 0.5)
    }
  }
}
