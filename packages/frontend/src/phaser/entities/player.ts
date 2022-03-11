import { Character } from '../../networking/schemas/Character'
import { app } from '../../ui/app'
import { useSceneState } from '../use-scene-state'
import { MovableEntity } from './movable'
import { PetEntity } from './pet'
import { EntitySpritePlugin } from './plugins/entity-sprite'
import { InputPlugin } from './plugins/input'
import { MovementPlugin } from './plugins/movement'
import { NamePlugin } from './plugins/name'
import { PetPlugin } from './plugins/pet'
import { createPluginPipeline, PluginPipeline } from './plugins/pipeline'
import { Plugin } from './plugins/plugin.interface'
import { RectanglePlugin } from './plugins/rectangle'
import { ShadowPlugin } from './plugins/shadow'

export class PlayerEntity extends MovableEntity<Character> {
  battleId?: string
  pet?: PetEntity

  hasCreated = false

  get isLocalPlayer() {
    return this.model.currentClientId === this.scene.connector.room.sessionId
  }

  pluginPipeline!: PluginPipeline
  onClick() {
    if (this.model.battleId) {
      this.scene.connector.room.send('character:battle:join', {
        battleId: this.model.battleId,
      })
      return
    }
    const scene = useSceneState.getState().scene
    app.rooms[scene].send('character:move:destination', {
      x: this.x,
      y: this.y,
    })
  }
  create() {
    const plugins: Plugin[] = [
      new MovementPlugin(this.scene, this),
      new RectanglePlugin(this.scene, this, () => this.onClick()),
      new ShadowPlugin(this.scene, this),
      new NamePlugin(this.scene, this, this.model.name),
      new EntitySpritePlugin(this.scene, this),
      new PetPlugin(this.scene, this),
    ]
    if (this.isLocalPlayer) {
      plugins.unshift(new InputPlugin(this.scene, this))
    }
    this.pluginPipeline = createPluginPipeline(plugins)
    this.setPosition(this.model.position.x, this.model.position.y)

    this.setDepth(Math.round(this.y + 32))
    if (this.isLocalPlayer) {
      app.character = this.model
      app.updates.next('character:stats')
      this.scene.cameras.main.startFollow(this, false, 0.05, 0.05)
      this.scene.cameras.main.setDeadzone(128, 128)
      this.scene.cameras.main.setZoom(1)
    }
    this.pluginPipeline.create()
    this.pluginPipeline.addToParent(this)
  }
  lastWidth = 1600

  preUpdate() {
    if (!this.pluginPipeline) this.create()
    this.pluginPipeline.update()
  }
  destroy() {
    this.pluginPipeline.destroy()
    super.destroy()
  }
}
