import { Position } from '../../networking/schemas/Position'
import { app } from '../../ui/app'
import { blurAll } from '../behaviors/blurAll'
import { lerp } from '../behaviors/lerp'
import { NetworkedScene } from '../scenes/networked.scene'
import { useSceneState } from '../use-scene-state'
import { PlayerEntity } from './player'
import { EntitySpritePlugin } from './plugins/entity-sprite'
import { NamePlugin } from './plugins/name'
import { RectanglePlugin } from './plugins/rectangle'
import { ShadowPlugin } from './plugins/shadow'

export class MovableEntity<
  T extends { position: Position; battleId?: string }
> extends Phaser.GameObjects.Container {
  animateJump = false
  falling = false
  jumpMax = 32
  jumpCurrent = 0

  body: Phaser.Physics.Arcade.Body

  constructor(public model: T, public scene: NetworkedScene) {
    super(scene)
  }

  create() {
    this.scene.physics.add.existing(this)
    this.body.setSize(33,57, true)
    this.body.setOffset(-16.5, -57)
  }

  setPosition(x: number, y: number, z?: number, w?: number) {
    this.x = x
    this.y = y
    return this
  }

  timer = 0
  jumping = false
  moving = false

  updateVelocityForDestination(x: number, y: number) {
    const diffX = Math.round(Math.abs(x - this.x))
    const diffY = Math.round(Math.abs(y - this.y))
    let [velX, velY] = [0, 0]
    this.moving = false
    if (diffX > 4) velX = x - this.x > 0 ? 100 : -100
    if (diffY > 4) velY = y - this.y > 0 ? 100 : -100
    return [velX, velY]
  }

  lerpTo(x: number, y: number) {
    const diffX = Math.abs(x - this.x)
    const diffY = Math.abs(y - this.y)
    let newX = this.x
    let newY = this.y
    this.moving = false
    if (diffX < 2) {
      newX = x
    } else {
      newX = lerp(this.x, x, Math.abs(x / this.x) * 0.08)
      this.moving = true
    }
    if (diffY < 2) {
      newY = y
    } else {
      newY = lerp(this.y, y, Math.abs(y / this.y) * 0.08)
      this.moving = true
    }
    return { newX, newY }
  }
}
