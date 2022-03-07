import { BattlePet } from '../../../networking/schemas/BattlePet'
import { app } from '../../../ui/app'
import { blurAll } from '../../behaviors/blurAll'
import { BattleScene } from '../../scenes/battle.scene'
import { SceneConnector } from '../../scenes/scene.connector'
import { BattleEntity } from './battle-entity'
import { BattleScenePlayer } from './battle-player'

export class BattleScenePet extends BattleEntity<BattlePet> {
  constructor(
    public owner: BattleScenePlayer,
    public model: BattlePet,
    public scene: BattleScene,
    public connector: SceneConnector
  ) {
    super(model, scene, connector)
  }

  getBattleLocation() {
    return this.scene.leftPositions[this.owner.model.battleLocation]
  }

  create() {
    this.namePlugin.create(this.owner.character.name + "'s Pet")
    this.shadowPlugin.create()
    this.rectanglePlugin.create()

    this.add(this.shadowPlugin.shadow)
    this.add(this.rectanglePlugin.rectangle)
    this.add(this.namePlugin.text)
    this.rectanglePlugin.rectangle.on('pointerdown', (e) => {
      // console.log('Selected!', 'pet')
      if (e.downElement.tagName.toLowerCase() !== 'canvas') return
      blurAll()
      e.downElement.focus()
      app.target = this.model
      app.updates.next('target:stats')
    })
  }

  preUpdate() {
    if (!this.rectanglePlugin.rectangle) this.create()
    this.namePlugin.update()
    this.rectanglePlugin.update()
    this.shadowPlugin.update()
    this.handleJump()
  }
}
