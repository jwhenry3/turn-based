import { BattleEntity } from '../battle/battle-entity'
import { MovableEntity } from '../movable'

export class ShadowPlugin {
  shadow: Phaser.GameObjects.Arc

  isGlowing = false
  isTarget = false
  constructor(
    public scene: Phaser.Scene,
    public owner: MovableEntity<any> | BattleEntity<any>
  ) {}

  create() {
    this.shadow = new Phaser.GameObjects.Arc(
      this.scene,
      0,
      16,
      16,
      0,
      360,
      false,
      Phaser.Display.Color.HexStringToColor('#333').color,
      0.2
    )
    this.shadow.setOrigin(0.5, 0.5)
    this.shadow.setScale(1, 0.5)
  }

  update() {
    if (!this.shadow) return
    if (this.isGlowing) {
      this.shadow.setFillStyle(
        Phaser.Display.Color.HexStringToColor(this.isTarget ? '#f8a' : '#8af')
          .color,
        0.5
      )
      this.shadow.setStrokeStyle(
        2,
        Phaser.Display.Color.HexStringToColor(this.isTarget ? '#f8a' : '#8af')
          .color
      )
      this.shadow.setScale(2, 1)
    } else {
      this.shadow.setStrokeStyle(undefined)
      this.shadow.setFillStyle(
        Phaser.Display.Color.HexStringToColor('#333').color,
        0.2
      )
      this.shadow.setScale(1, 0.5)
    }
  }
}
