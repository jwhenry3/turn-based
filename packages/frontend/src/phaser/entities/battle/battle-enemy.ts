import { BattleNpc } from '../../../networking/schemas/BattleNpc'
import { app } from '../../../ui/app'
import { BattleScene } from '../../scenes/battle.scene'
import { SceneConnector } from '../../scenes/scene.connector'
import { CastingCirclePlugin } from '../plugins/casting-circle'
import { EntitySpritePlugin } from '../plugins/entity-sprite'
import { NamePlugin } from '../plugins/name'
import { PluginPipeline, createPluginPipeline } from '../plugins/pipeline'
import { RectanglePlugin } from '../plugins/rectangle'
import { ShadowPlugin } from '../plugins/shadow'
import { BattleEntity } from './battle-entity'

export class BattleSceneEnemy extends BattleEntity<BattleNpc> {
  pluginPipeline!: PluginPipeline
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
  onClick() {
    app.target = this.model
    app.updates.next('target:stats')
  }
  create() {
    this.pluginPipeline = createPluginPipeline([
      new CastingCirclePlugin(this.scene, this),
      new RectanglePlugin(this.scene, this, undefined, () => this.onClick()),
      new ShadowPlugin(this.scene, this),
      new NamePlugin(this.scene, this, this.model.name, 'rgba(255, 120, 0)'),
      new EntitySpritePlugin(this.scene, this),
    ])
    this.setInteractive(
      new Phaser.Geom.Rectangle(0, 0, 33, 57),
      Phaser.Geom.Rectangle.Contains
    )
    this.pluginPipeline.create()
    this.pluginPipeline.addToParent(this)
  }

  preUpdate() {
    if (!this.pluginPipeline) this.create()
    this.handleJump()
    this.pluginPipeline.update()
  }
}
