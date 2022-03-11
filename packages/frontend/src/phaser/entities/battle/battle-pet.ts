import { BattlePet } from '../../../networking/schemas/BattlePet'
import { app } from '../../../ui/app'
import { blurAll } from '../../behaviors/blurAll'
import { BattleScene } from '../../scenes/battle.scene'
import { SceneConnector } from '../../scenes/scene.connector'
import { EntitySpritePlugin } from '../plugins/entity-sprite'
import { NamePlugin } from '../plugins/name'
import { PluginPipeline, createPluginPipeline } from '../plugins/pipeline'
import { RectanglePlugin } from '../plugins/rectangle'
import { ShadowPlugin } from '../plugins/shadow'
import { BattleEntity } from './battle-entity'
import { BattleScenePlayer } from './battle-player'

export class BattleScenePet extends BattleEntity<BattlePet> {
  pluginPipeline!: PluginPipeline
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

  onClick() {
    app.target = this.model
    app.updates.next('target:stats')
  }

  create() {
    this.pluginPipeline = createPluginPipeline([
      new RectanglePlugin(this.scene, this, undefined, () => this.onClick()),
      new ShadowPlugin(this.scene, this),
      new NamePlugin(
        this.scene,
        this,
        this.owner.character.name + "'s Pet",
        'rgba(120, 150, 50, 0.8)'
      ),
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
