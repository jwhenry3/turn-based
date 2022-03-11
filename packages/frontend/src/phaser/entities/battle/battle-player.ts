import { BattlePlayer } from '../../../networking/schemas/BattlePlayer'
import { Character } from '../../../networking/schemas/Character'
import { app } from '../../../ui/app'
import { blurAll } from '../../behaviors/blurAll'
import { lerp } from '../../behaviors/lerp'
import { BattleScene } from '../../scenes/battle.scene'
import { SceneConnector } from '../../scenes/scene.connector'
import { EntitySpritePlugin } from '../plugins/entity-sprite'
import { NamePlugin } from '../plugins/name'
import { createPluginPipeline, PluginPipeline } from '../plugins/pipeline'
import { RectanglePlugin } from '../plugins/rectangle'
import { ShadowPlugin } from '../plugins/shadow'
import { BattleEntity } from './battle-entity'
import { BattleScenePet } from './battle-pet'
import { BattlePosition } from './battle-position'

export class BattleScenePlayer extends BattleEntity<BattlePlayer> {
  pluginPipeline!: PluginPipeline
  pet: BattleScenePet
  petPosition: BattlePosition

  constructor(
    public character: Character,
    public model: BattlePlayer,
    public scene: BattleScene,
    public connector: SceneConnector
  ) {
    super(model, scene, connector)
    const player = this.model
    if (player.pet) {
      this.pet = new BattleScenePet(
        this,
        player.pet,
        this.scene,
        this.connector
      )
    }
  }

  get isLocalPlayer() {
    return this.character.currentClientId === this.connector.room.sessionId
  }
  getBattleLocation() {
    return this.scene.leftPositions[this.model.battleLocation]
  }
  onClick() {
    app.target = this.model
    app.updates.next('target:stats')
  }
  create() {
    this.pluginPipeline = createPluginPipeline([
      new RectanglePlugin(this.scene, this, undefined, () => this.onClick()),
      new ShadowPlugin(this.scene, this),
      new NamePlugin(this.scene, this, this.character.name),
      new EntitySpritePlugin(this.scene, this),
    ])
    this.setInteractive(
      new Phaser.Geom.Rectangle(0, 0, 33, 57),
      Phaser.Geom.Rectangle.Contains
    )
    this.pluginPipeline.create()
    this.pluginPipeline.addToParent(this)

    this.setDepth(this.y)
    if (this.pet) {
      const container = new BattlePosition(
        this.scene,
        this.parentContainer.x,
        this.parentContainer.y
      )
      container.originalY = this.parentContainer.y + 32
      if (this.scene.isMobilePortrait()) {
        container.originalX = this.parentContainer.x - 40
      } else {
        container.originalX = this.parentContainer.x - 64
      }
      container.setPosition(container.originalX, container.originalY)
      container.setDepth(container.y)
      this.scene.add.existing(this.pet)
      container.add(this.pet)
      this.scene.add.existing(container)
      this.pet.owner = this
    }
  }
  preUpdate() {
    if (!this.pluginPipeline) this.create()
    this.handleJump()
    this.pluginPipeline.update()

    this.setDepth(this.y)
  }
}
