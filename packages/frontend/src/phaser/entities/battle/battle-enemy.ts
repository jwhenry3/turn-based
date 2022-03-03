import { BattleNpc } from '../../../networking/schemas/BattleNpc'
import { BattleScene } from '../../scenes/battle.scene'
import { SceneConnector } from '../../scenes/scene.connector'

export class BattleSceneEnemy extends Phaser.GameObjects.GameObject {
  rectangle: Phaser.GameObjects.Rectangle

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
    this.rectangle.setDepth(
      Math.round(this.rectangle.y - this.rectangle.height)
    )
    this.rectangle.setOrigin(0.5, 0.75)
  }

  preUpdate() {
    if (!this.rectangle) {
      this.create()
    }
  }

  destroy() {
    super.destroy()
    this.rectangle.destroy()
  }
}
