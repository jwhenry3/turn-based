import { BattleNpc } from '../../../networking/schemas/BattleNpc'
import { app } from '../../../ui/app'
import { blurAll } from '../../behaviors/blurAll'
import { BattleScene } from '../../scenes/battle.scene'
import { SceneConnector } from '../../scenes/scene.connector'
import { NamePlugin } from '../plugins/name'

export class BattleSceneEnemy extends Phaser.GameObjects.GameObject {
  rectangle: Phaser.GameObjects.Rectangle
  namePlugin: NamePlugin = new NamePlugin(this.scene)

  battleLocation = 0

  constructor(
    public model: BattleNpc,
    public scene: BattleScene,
    public connector: SceneConnector
  ) {
    super(scene, 'sprite')
  }
  create() {
    const location =
      this.scene.battleLocations.enemies[this.model.battleLocation]
    this.rectangle = this.scene.add.rectangle(
      location[0],
      location[1],
      32,
      64,
      Phaser.Display.Color.HexStringToColor('#f50').color
    )
    this.namePlugin.create(
      this.model.name,
      location[0],
      location[1],
      'rgba(255, 120, 0)'
    )
    this.rectangle.setInteractive(
      new Phaser.Geom.Rectangle(0, 0, 32, 64),
      Phaser.Geom.Rectangle.Contains
    )
    this.rectangle.setDepth(
      Math.round(this.rectangle.y - this.rectangle.height)
    )
    this.rectangle.setOrigin(0.5, 0.75)
    this.rectangle.on('pointerdown', (e) => {
      console.log('Selected!', this.model.name)
      if (e.downElement.tagName.toLowerCase() !== 'canvas') return
      blurAll()
      e.downElement.focus()
      console.log('Selected!', this.model.name)
      app.target = this.model
      app.updates.next('target:stats')
    })
  }

  preUpdate() {
    if (!this.rectangle) {
      this.create()
    }
    if (app.target === this.model) {
      this.rectangle.setStrokeStyle(
        4,
        Phaser.Display.Color.HexStringToColor('#aaf').color,
        0.5
      )
    } else {
      this.rectangle.setStrokeStyle(0)
    }
    this.namePlugin.update(this.rectangle.x, this.rectangle.y)
  }

  destroy() {
    super.destroy()
    this.rectangle.destroy()
    this.namePlugin.destroy()
  }
}
