import { Position } from '../../networking/schemas/Position'
import { app } from '../../ui/app'
import { blurAll } from '../behaviors/blurAll'
import { lerp } from '../behaviors/lerp'
import { NetworkedScene } from '../scenes/networked.scene'
import { useSceneState } from '../use-scene-state'
import { NamePlugin } from './plugins/name'
import { RectanglePlugin } from './plugins/rectangle'
import { ShadowPlugin } from './plugins/shadow'

export class MovableEntity<
  T extends { position: Position; battleId?: string }
> extends Phaser.GameObjects.Container {
  rectanglePlugin: RectanglePlugin = new RectanglePlugin(this.scene, this)
  shadowPlugin: ShadowPlugin = new ShadowPlugin(this.scene, this)
  namePlugin: NamePlugin = new NamePlugin(this.scene, this)

  animateJump = false
  falling = false
  jumpMax = 32
  jumpCurrent = 0

  constructor(public model: T, public scene: NetworkedScene) {
    super(scene)
  }

  setPosition(x: number, y: number, z?: number, w?: number) {
    this.x = x
    this.y = y
    return this
  }
  handleClick(afterSelected: () => void) {
    this.rectanglePlugin.rectangle.on('pointerdown', (e) => {
      if (e.downElement.tagName.toLowerCase() !== 'canvas') return
      blurAll()
      if (app.selected === this) {
        afterSelected()
      }
      app.selected = this
    })
  }

  timer = 0
  jumping = false

  handleJump() {
    if (this.animateJump || this.jumping) {
      this.jumping = true
      this.animateJump = false
      const nextValue = Math.sin(Math.PI * this.timer * 20) * this.jumpMax
      this.timer += 0.002
      if (nextValue > 0) {
        if (this.jumpCurrent < nextValue) {
          this.falling = true
        }
        this.jumpCurrent = nextValue
        this.rectanglePlugin.rectangle.setPosition(0, -this.jumpCurrent)
      }
      if (nextValue <= 0 && nextValue < this.jumpCurrent) {
        this.jumping = false
        this.falling = false
        this.jumpCurrent = 0
        this.timer = 0
      }
    }
  }

  lerpTo(x: number, y: number) {
    const diffX = Math.abs(x - this.x)
    const diffY = Math.abs(y - this.y)
    let newX = this.x
    let newY = this.y
    if (diffX < 2) {
      newX = x
    } else {
      newX = lerp(this.x, x, Math.abs(x / this.x) * 0.08)
    }
    if (diffY < 2) {
      newY = y
    } else {
      newY = lerp(this.y, y, Math.abs(y / this.y) * 0.08)
    }
    return { newX, newY }
  }
}
