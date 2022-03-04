import { BattlePet } from '../../../networking/schemas/BattlePet'
import { app } from '../../../ui/app'
import { blurAll } from '../../behaviors/blurAll'
import { BattleScene } from '../../scenes/battle.scene'
import { SceneConnector } from '../../scenes/scene.connector'
import { NamePlugin } from '../plugins/name'
import { RectanglePlugin } from '../plugins/rectangle'
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

  getBattleLocation(type: string) {
    const location =
      this.scene.battleLocations[type][this.owner.model.battleLocation]

    return [location[0] - 64, location[1] + 16]
  }

  create() {
    this.setPosition(...this.getBattleLocation('players'))
    this.namePlugin.create(this.owner.character.name + "'s Pet")
    this.rectanglePlugin.create()
    this.add(this.namePlugin.text)
    this.add(this.rectanglePlugin.rectangle)
    this.setDepth(Math.round(this.y))
    this.rectanglePlugin.rectangle.on('pointerdown', (e) => {
      console.log('Selected!', 'pet')
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
  }
}
