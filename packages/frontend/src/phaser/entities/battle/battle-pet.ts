import { BattlePet } from '../../../networking/schemas/BattlePet'
import { app } from '../../../ui/app'
import { blurAll } from '../../behaviors/blurAll'
import { BattleScene } from '../../scenes/battle.scene'
import { SceneConnector } from '../../scenes/scene.connector'
import { NamePlugin } from '../plugins/name'
import { BattleScenePlayer } from './battle-player'

export class BattleScenePet extends Phaser.GameObjects.GameObject {
  rectangle: Phaser.GameObjects.Rectangle
  namePlugin: NamePlugin = new NamePlugin(this.scene)

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
      location[1] + 16,
      32,
      64,
      Phaser.Display.Color.HexStringToColor('#8af').color
    )
    this.namePlugin.create(
      this.owner.character.name,
      location[0] - 64,
      location[1] + 16
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
      console.log('Selected!', 'pet')
      if (e.downElement.tagName.toLowerCase() !== 'canvas') return
      blurAll()
      e.downElement.focus()
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
