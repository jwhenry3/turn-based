import { BattlePlayer } from '../../../networking/schemas/BattlePlayer'
import { Character } from '../../../networking/schemas/Character'
import { BattleScene } from '../../scenes/battle.scene'
import { SceneConnector } from '../../scenes/scene.connector'

export class BattleScenePlayer extends Phaser.GameObjects.GameObject {
  rectangle: Phaser.GameObjects.Rectangle
  character: Character

  constructor(
    public model: BattlePlayer,
    public scene: BattleScene,
    public connector: SceneConnector
  ) {
    super(scene, 'sprite')
  }

  get isLocalPlayer() {
    return (
      this.character.currentClientId === this.connector.room.sessionId
    )
  }

  create() {
    const location =
      this.scene.battleLocations.players[this.model.battleLocation]
    this.rectangle = this.scene.add.rectangle(
      location[0],
      location[1],
      32,
      64,
      Phaser.Display.Color.HexStringToColor('#55f').color
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
