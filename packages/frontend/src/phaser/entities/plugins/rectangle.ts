import { app } from '../../../ui/app'
import { blurAll } from '../../behaviors/blurAll'
import { BattleEntity } from '../battle/battle-entity'
import { MovableEntity } from '../movable'

export class RectanglePlugin {
  gameObject: Phaser.GameObjects.Rectangle
  constructor(
    public scene: Phaser.Scene,
    public owner: MovableEntity<any> | BattleEntity<any>,
    public afterSelected?: () => void,
    public onSelected?: () => void
  ) {}

  create() {
    this.gameObject = new Phaser.GameObjects.Rectangle(this.scene, 0, 0, 33, 57)
    this.gameObject.setOrigin(0.5, 1)
    this.gameObject.setInteractive(
      new Phaser.Geom.Rectangle(0, 0, 33, 57),
      Phaser.Geom.Rectangle.Contains
    )
    this.gameObject.on('pointerdown', (e) => {
      if (e.downElement.tagName.toLowerCase() !== 'canvas') return
      blurAll()
      if (app.selected === this.owner && this.afterSelected) {
        this.afterSelected()
      }
      app.selected = this.owner as any
      if (this.onSelected) {
        this.onSelected()
      }
    })
  }

  update() {
    if (!this.owner) return
    if (
      app.selected === this.owner ||
      (app.target as any) === this.owner.model
    ) {
      this.gameObject.setStrokeStyle(
        4,
        Phaser.Display.Color.HexStringToColor('#fff').color,
        0.5
      )
    } else {
      this.gameObject.setStrokeStyle(0)
    }
    if (
      app.selected === this.owner ||
      (app.target as any) === this.owner.model
    ) {
      this.gameObject.setStrokeStyle(
        4,
        Phaser.Display.Color.HexStringToColor('#fff').color,
        0.5
      )
    } else {
      this.gameObject.setStrokeStyle(0)
    }
  }
}
function afterSelected() {
  throw new Error('Function not implemented.')
}
