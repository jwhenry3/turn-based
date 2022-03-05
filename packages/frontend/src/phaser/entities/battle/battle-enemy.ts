import { BattleNpc } from '../../../networking/schemas/BattleNpc'
import { app } from '../../../ui/app'
import { blurAll } from '../../behaviors/blurAll'
import { BattleScene } from '../../scenes/battle.scene'
import { SceneConnector } from '../../scenes/scene.connector'
import { NamePlugin } from '../plugins/name'
import { RectanglePlugin } from '../plugins/rectangle'
import { BattleEntity } from './battle-entity'

export class BattleSceneEnemy extends BattleEntity<BattleNpc> {
  battleLocation = 0

  constructor(
    public model: BattleNpc,
    public scene: BattleScene,
    public connector: SceneConnector
  ) {
    super(model, scene, connector)
  }

  getBattleLocation() {
    return this.scene.rightPositions[this.model.battleLocation]
  }
  create() {
    this.rectanglePlugin.color = '#f50'
    this.setPosition(0, 0)
    this.rectanglePlugin.create()
    this.namePlugin.create(this.model.name, 'rgba(255, 120, 0)')
    this.add(this.namePlugin.text)
    this.add(this.rectanglePlugin.rectangle)
    this.setDepth(this.y)
    this.rectanglePlugin.rectangle.on('pointerdown', (e) => {
      // console.log('Selected!', this.model.name)
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
