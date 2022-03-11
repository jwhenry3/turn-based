import { PetNpc } from '../../networking/schemas/PetNpc'
import { app } from '../../ui/app'
import { blurAll } from '../behaviors/blurAll'
import { useSceneState } from '../use-scene-state'
import { MovableEntity } from './movable'
import { PlayerEntity } from './player'
import { EntitySpritePlugin } from './plugins/entity-sprite'
import { MovementPlugin } from './plugins/movement'
import { NamePlugin } from './plugins/name'
import { PluginPipeline, createPluginPipeline } from './plugins/pipeline'
import { RectanglePlugin } from './plugins/rectangle'
import { ShadowPlugin } from './plugins/shadow'

export class PetEntity extends MovableEntity<PetNpc> {
  owner: PlayerEntity
  pluginPipeline!: PluginPipeline

  onClick() {
    const scene = useSceneState.getState().scene
    app.rooms[scene].send('character:move:destination', {
      x: this.x,
      y: this.y,
    })
  }
  create() {
    this.pluginPipeline = createPluginPipeline([
      new MovementPlugin(this.scene, this),
      new RectanglePlugin(this.scene, this, () => this.onClick()),
      new ShadowPlugin(this.scene, this),
      new NamePlugin(
        this.scene,
        this,
        this.owner.model.name + "'s Pet",
        'rgba(120, 150, 50, 0.8)'
      ),
      new EntitySpritePlugin(this.scene, this),
    ])
    this.setPosition(this.model.position.x, this.model.position.y)
    this.setInteractive(
      new Phaser.Geom.Rectangle(0, 0, 32, 64),
      Phaser.Geom.Rectangle.Contains
    )
    this.pluginPipeline.create()
    this.pluginPipeline.addToParent(this)
  }

  preUpdate() {
    if (!this.pluginPipeline) this.create()
    this.pluginPipeline.update()
  }
}
