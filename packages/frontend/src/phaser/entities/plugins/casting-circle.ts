import { BattleEntity } from '../battle/battle-entity'
import { MovableEntity } from '../movable'

export class CastingCirclePlugin {
  gameObject: Phaser.GameObjects.Arc

  isGlowing = false
  isTarget = false
  constructor(public scene: Phaser.Scene, public owner: BattleEntity<any>) {}

  create() {
    this.gameObject = new Phaser.GameObjects.Arc(
      this.scene,
      0,
      0,
      16,
      0,
      360,
      false
    )
    this.gameObject.setOrigin(0.5, 0.5)
    this.gameObject.setScale(2, 1)
  }

  update() {
    if (!this.gameObject) return
    if (this.owner.isCasting || this.owner.isCastingTarget) {
      this.gameObject.setFillStyle(
        Phaser.Display.Color.HexStringToColor(
          this.owner.isCastingTarget ? '#f8a' : '#8af'
        ).color,
        0.5
      )
      this.gameObject.setStrokeStyle(
        2,
        Phaser.Display.Color.HexStringToColor(
          this.owner.isCastingTarget ? '#f8a' : '#8af'
        ).color
      )
      this.gameObject.setScale(2, 1)
      this.gameObject.setVisible(true)
    } else {
      this.gameObject.setVisible(false)
    }
  }
}
