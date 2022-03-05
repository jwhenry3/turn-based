import { app } from '../../../ui/app'
import { BattleEntity } from '../battle/battle-entity'
import { MovableEntity } from '../movable'

export class RectanglePlugin {
  rectangle: Phaser.GameObjects.Rectangle
  public color: string = '#55f'
  constructor(
    public scene: Phaser.Scene,
    public owner: MovableEntity<any> | BattleEntity<any>
  ) {}

  create() {
    this.rectangle = new Phaser.GameObjects.Rectangle(
      this.scene,
      0,
      0,
      32,
      64,
      Phaser.Display.Color.HexStringToColor(this.color).color
    )
    this.rectangle.setOrigin(0.5, 0.75)
    this.rectangle.setInteractive(
      new Phaser.Geom.Rectangle(0, 0, 32, 64),
      Phaser.Geom.Rectangle.Contains
    )
  }

  update() {
    if (!this.owner) return
    if (
      app.selected === this.owner ||
      (app.target as any) === this.owner.model
    ) {
      this.rectangle.setStrokeStyle(
        4,
        Phaser.Display.Color.HexStringToColor('#fff').color,
        0.5
      )
    } else {
      this.rectangle.setStrokeStyle(0)
    }
    if (this.owner?.model?.isInBattle) {
      this.rectangle.setFillStyle(
        Phaser.Display.Color.HexStringToColor('#f50').color
      )
    } else {
      this.rectangle.setFillStyle(
        Phaser.Display.Color.HexStringToColor(this.color).color
      )
    }
    if (
      app.selected === this.owner ||
      (app.target as any) === this.owner.model
    ) {
      this.rectangle.setStrokeStyle(
        4,
        Phaser.Display.Color.HexStringToColor('#fff').color,
        0.5
      )
    } else {
      this.rectangle.setStrokeStyle(0)
    }
  }
}
