import { BattlePet } from '../../../networking/schemas/BattlePet'
import { BattleScene } from '../../scenes/battle.scene'
import { SceneConnector } from '../../scenes/scene.connector'
import { BattleScenePlayer } from './battle-player'

export class BattleScenePet extends Phaser.GameObjects.GameObject {
  rectangle: Phaser.GameObjects.Rectangle

  owner: BattleScenePlayer

  constructor(
    public model: BattlePet,
    public scene: BattleScene,
    public connector: SceneConnector
  ) {
    super(scene, 'sprite')
  }

  create() {
    const location =
      this.scene.battleLocations.players[this.owner.model.battleLocation]
    this.rectangle = this.scene.add.rectangle(
      location[0] - 64,
      location[1] + 32,
      32,
      64,
      Phaser.Display.Color.HexStringToColor('#8af').color
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
